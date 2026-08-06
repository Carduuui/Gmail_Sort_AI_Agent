import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google, gmail_v1} from 'googleapis';
import type {OAuth2Client} from 'google-auth-library';

// The scope for reading Gmail labels.
const SCOPES: string[] = ['https://www.googleapis.com/auth/gmail.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH: string = path.join(process.cwd(), '../../credentials.json');

const TOKEN_PATH: string = path.join(process.cwd(), '../../token.json');

export async function getAuth(): Promise<gmail_v1.Gmail> {

  let auth = await loadSavedCredentials();

  if(!auth){
    auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    await saveCredentials(auth);
  }

  const gmail = google.gmail({version: 'v1', auth});

  return gmail;
}

async function loadSavedCredentials(): Promise<OAuth2Client | null>{
  
  try{
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials =  JSON.parse(content);
    return google.auth.fromJSON(credentials) as OAuth2Client;
  }
  catch{
    return null;
  }
}

async function saveCredentials(client: OAuth2Client): Promise<void>{
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;

  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });

  await fs.writeFile(TOKEN_PATH, payload);
}