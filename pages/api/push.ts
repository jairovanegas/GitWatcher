import type { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher';

/**
 * Instantiate the Pusher Client
 */
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export type WebhookCallbackUser = {
  email: string,
  name: string,
  username: string
}

export type WebhookCallbackCommit = {
  id: string,
  message: string,
  timestamp: string,
  url: string,
  author: WebhookCallbackUser,
  committer: WebhookCallbackUser
}

type GithubWebhookCallbackData = {
  commits: WebhookCallbackCommit[]
}

/**
 * Callback for the Github Webhook for pushes to the main branch
 * @param {GithubWebhookCallbackData} req Request from the Github Webhook
 * @param res Response
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: GithubWebhookCallbackData = req.body;
  try {
    await pusher.trigger("git-watcher", "push-event", {
      commits: data.commits
    });
    res.json({ message: "completed" });
  } catch (e) {
    res.status(500).send('Internal Server Error.');
  }
}