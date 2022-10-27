import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { Octokit } from "octokit";
import GitCommitListView from "../components/GitCommitListView";
import Pusher from "pusher-js";
import { useEffect, useState } from 'react';
import { WebhookCallbackCommit } from './api/push';

export type GithubUser = {
    login: string,
    avatar_url: string,
    html_url: string
};

export type GithubCommit = {
    sha: string,
    commit: {
        message: string
    },
    author: GithubUser,
    committer: GithubUser,
    html_url: string
}

/**
 * The commits history is fetched from the Github api
 * @returns {{data: GithubCommit[]}} Commit Array from the api
 */
export async function getServerSideProps() {
    try {
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
    } catch (e) {
        return {
            props: {}
        }
    }
}

export default function Home({ data }: { data: GithubCommit[] }) {

    const [commitHistory, setCommitHistory] = useState(data);

    /**
     * The Pusher Channel is connected and awaiting for events.
     * When an event arrives appends it to the start of the commits array
     */
    useEffect(() => {
        try {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            });
            const channel = pusher.subscribe("git-watcher");
            try {
                /**
                 * When an event arrives, transforms the commits in the incoming array to
                 * matching types and appends the result in front of the previous array
                 */
                channel.bind("push-event", ({ commits }: { commits: WebhookCallbackCommit[] }) => {
                    setCommitHistory(previousCommitHistory => [...commits.map((commit) => {
                        return {
                            sha: commit.id,
                            commit: {
                                message: commit.message
                            },
                            author: {
                                login: commit.author.username,
                                avatar_url: "",
                                html_url: ""
                            },
                            committer: {
                                login: commit.committer.username,
                                avatar_url: "",
                                html_url: ""
                            },
                            html_url: commit.url
                        }
                    }), ...previousCommitHistory])
                });
    
                return () => {
                    pusher.unsubscribe("push-event");
                };
            } catch (e) {
                return () => {
                    pusher.unsubscribe("push-event");
                };
            }
        } catch (e) {
            console.log("Error creating pusher channel");
        }
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
