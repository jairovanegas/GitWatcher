import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { Octokit } from "octokit";
import GitCommitListView from "../components/GitCommitListView";
import Pusher from "pusher-js";
import axios from "axios";
import { useEffect, useState } from 'react';
import { WebhookCallbackCommit } from './api/push';

export interface GithubCommit {
    sha: string,
    commit: {
        message: string
    },
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
    },
    html_url: string
}

export async function getServerSideProps() {
    const octokit = new Octokit({
        auth: process.env["ACCESS_TOKEN"]
    });
    const commitsFromGithub = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'jairovanegas',
        repo: 'git-watcher'
    });
    return {
        props: {
            data: commitsFromGithub.data
        }
    }
}

export default function Home({ data }: { data: GithubCommit[] }) {

    const [commitHistory, setCommitHistory] = useState(data);

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });
        const channel = pusher.subscribe("git-watcher");

        channel.bind("push-event", ({ commits }: { commits: WebhookCallbackCommit[] }) => {
            console.log(commits);
            setCommitHistory(previousCommitHistory => [...commits.map((commit) => {
                return {
                    sha: commit.id,
                    commit: {
                        message: commit.message
                    },
                    author: commit.author,
                    committer: commit.committer,
                    html_url: commit.url
                }
            }), ...previousCommitHistory])
        });

        return () => {
            pusher.unsubscribe("push-event");
        };
    }, []);

    return (
        <div>
            <Head>
                <title>GitWatcher</title>
                <meta name="description" content="Watcher of commits in it's repository" />
                <link rel="icon" href="/gitico.png" />
            </Head>
            <main className="mt-5">
                <h1 className={styles.title}>
                    Welcome to this <a href="https://github.com/jairovanegas/git-watcher">repository</a>
                </h1>

                <p className="text-center text-5xl mt-5">
                    Commit History
                </p>

                <div className="ml-10 mr-10 mt-5">
                    <GitCommitListView commits={commitHistory} />
                </div>
            </main>
        </div>
    );
}
