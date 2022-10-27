import Head from 'next/head'

import styles from '../styles/Home.module.css'
import {Octokit} from "octokit";
import GitCommitListView from "../components/GitCommitListView";

export interface GithubCommit {
    "sha": string,
    "commit": {
        "author": {
            "name": string,
            "email": string,
            "date": string
        },
        "committer": {
            "name": string,
            "email": string,
            "date": string
        },
        "message": string
    },
    "author": {
        "login": string,
        "id": number,
        "avatar_url": string,
        "html_url": string,
        "type": string,
        "site_admin": boolean
    },
    "committer": {
        "login": string,
        "id": number,
        "avatar_url": string,
        "html_url": string,
        "type": string,
        "site_admin": boolean
    },
    "html_url": string
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

export default function Home({data}: { data: GithubCommit[] }) {
    console.log(data);
    return (
        <div>
            <Head>
                <title>GitWatcher</title>
                <meta name="description" content="Watcher of commits in it's repository"/>
                <link rel="icon" href="/gitico.png"/>
            </Head>
            <main className="mt-5">
                <h1 className={styles.title}>
                    Welcome to this <a href="https://github.com/jairovanegas/git-watcher">repository</a>
                </h1>

                <p className="text-center text-5xl mt-5">
                    Commit History
                </p>

                <div className="ml-10 mr-10 mt-5">
                    <GitCommitListView commits={data}/>
                </div>
            </main>
        </div>
    );
}
