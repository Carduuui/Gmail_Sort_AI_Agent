import {generateText, stepCountIs, tool} from 'ai';
import {anthropic} from "@ai-sdk/anthropic";
import {z} from 'zod';
import{getAuth} from "../../authentification"
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';

export async function POST(req: Request){
    const gmail = await getAuth();
    
    const result = await generateText({
        model: anthropic("claude-sonnet-4-6"),
        messages: [{
            role: "user",
            content: `Label alle E-Mails die heute reingekommen sind. 
                    Sie dürfen maximal zwei Label bekommen.`,
        }],
        tools: {
            getLabels: tool({
                description: "Gibt alle verfügbaren Labels aus.",
                inputSchema: z.object({}),
                execute: async () =>{
                    const { data } = await gmail.users.labels.list({
                        userId: "me",
                    })
                    
                    return data.labels?.map(l => ({id: l.id, name: l.name})) ?? [];
                }
            }),
            getTodaysEmails: tool({
                description: "Gibt alle E-Mails von heute aus.",
                inputSchema: z.object({}),
                execute: async () => {
                    const { data } = await gmail.users.messages.list({
                        userId: "me",
                        labelIds: ["INBOX"],
                        q: "newer_than:1d",
                    })

                    if(!data.messages) return [];

                    const emails = await Promise.all(
                        data.messages.map(async (msg) =>{
                            const full = await gmail.users.messages.get({
                                userId: "me",
                                id: msg.id!,
                            });

                            const headers = full.data.payload?.headers;
                            const subject = headers?.find(h => h.name === "Subject")?.value ?? "(kein Betreff)";
                            const from = headers?.find(h => h.name === "From")?.value ?? "(unbekannt)";

                            return {
                                id: msg.id,
                                subject,
                                from,
                                snippet: full.data.snippet ?? "",
                            };
                        })
                    )

                    return emails;
                }
            }),
            setLabels: tool({
                description: "Damit können Labels gesetzt werden",
                inputSchema: z.object({
                            messageId: z.string().describe("Die ID der E-Mail"),
                            labelIds: z.array(z.string()).max(2).describe("Die IDs der Labels, die gesetzt werden sollen"),
                }),
                execute: async ({messageId,labelIds}) =>{
                    try {
                        await gmail.users.messages.modify({
                            userId: "me",
                            id: messageId,
                            requestBody: { addLabelIds: labelIds },
                        });
                        console.log(`✓ Erfolgreich`);
                        return { success: true };
                    } catch (err) {
                        console.error(`✗ Fehler:`, (err as Error).message);
                        return { success: false, error: (err as Error).message };
                    }
                }
            })
        },
        stopWhen: stepCountIs(10)
    });

        return Response.json({text: result.text});

    
}