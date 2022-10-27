import {GithubCommit} from "../pages";
import GitCommitView from "./GitCommitView";

export default function GitCommitListView({commits}:{commits: GithubCommit[]}){
    return(
        <>{(commits.map((commit)=>{
            return(<GitCommitView commit={commit} key={commit.sha}/>)
        }))}</>
    )
}