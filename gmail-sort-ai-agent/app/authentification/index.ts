import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google, gmail_v1} from 'googleapis';

// The scope for reading Gmail labels.
const SCOPES: string[] = ['https://www.googleapis.com/auth/gmail.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH: string = path.join(process.cwd(), '../../credentials.json');

export async function getAuth(): Promise<gmail_v1.Gmail> {

  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  const gmail = google.gmail({version: 'v1', auth});

  return gmail;
}
