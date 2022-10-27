import type { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export type WebhookCallbackCommit = {
  id: string,
  message: string,
  timestamp: string,
  url: string,
  author: {
    login: string,
    id: number,
    avatar_url: string,
    html_url: string,
    type: string,
    site_admin: boolean
  },
  committer: {
    login: string,
    id: number,
    avatar_url: string,
    html_url: string,
    type: string,
    site_admin: boolean
  }
}

type GithubWebhookCallbackData = {
  commits: WebhookCallbackCommit[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: GithubWebhookCallbackData = req.body;
  const response = await pusher.trigger("git-watcher", "push-event", {
    commits: data.commits
  });
  res.json({ message: "completed" });
}