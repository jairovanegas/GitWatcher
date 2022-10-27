import {GithubCommit} from "../pages";

export default function GitCommitList({commits}:{commits: GithubCommit[]}){
    return(
        (commits.map((commit)=>{
            return (
                <div key={commit.sha}>
                    <p>{commit.commit.message}</p>
                    <p>{commit.author.login}</p>
                </div>
            )
        }))
    )
}