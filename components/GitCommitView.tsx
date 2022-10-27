import { GithubCommit, GithubUser } from "../pages";
import Image from 'next/image'
import { useEffect, useState } from "react";
import { Octokit } from "octokit";

export default function GitCommitView({ commit }: { commit: GithubCommit }) {

    const [userInfo, setUserInfo] = useState(commit.author);

    useEffect(() => {
        if (commit.author.avatar_url === "") {
            console.log("No Avatar");
            const octokit = new Octokit({
                auth: process.env["ACCESS_TOKEN"]
            });
            octokit.request('GET /users/{username}', {
                username: userInfo.login
            }).then((value) => {
                console.log(value);
                const user: GithubUser = value.data;
                setUserInfo((previousUser) => {
                    return user;
                });
            })
        }
    }, []);

    return (
        <div className="shadow-md content-center items-center mt-3 mb-3 bg-white rounded-md p-2">
            <p className="text-3xl text-justify text-black">Commit message: <a href={commit.html_url} target="_blank" className="hover:text-blue-700">{commit.commit.message}</a></p>
            <div className="flex items-center text-black">
                <p className="text-left text-2xl mr-2">Author:</p>
                <div className="h-10 w-10 bg-cover rounded-md" style={{ backgroundImage: `url(${userInfo.avatar_url})` }} />
                <div className="text-left text-2xl ml-2">
                    <p><a href={userInfo.html_url} target="_blank" className="hover:text-blue-700">{userInfo.login}</a></p>
                </div>
            </div>
        </div>
    )
}