import{getAuth} from "../authentification"

async function listlabels(): Promise<void>{
    const gmail = await getAuth();

    const result = (await gmail).users.labels.list({
        userId: "me",
    });

    console.log(result);
}

await listlabels();