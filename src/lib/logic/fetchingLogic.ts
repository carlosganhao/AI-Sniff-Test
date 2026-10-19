import type { Octokit } from "octokit";
import type { CommitInfoResult } from "../../App";
import { GetCommitAuthorType } from "./processingLogic";

export async function GetCommitPageCount(octokit : Octokit, owner : string, repo : string, updateCallback : () => void, signal : AbortSignal | undefined) : Promise<number>
{
    var commitPage = await octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 100,
        request: {
            signal,
        }
    });
    await updateCallback()
    var linkHeader = commitPage.headers.link;
    var match = linkHeader?.match(/per_page=100&page=(?<last_page>\d*)>; rel="last"/);
    return parseInt(match?.groups?.last_page ?? "1");
}

export async function GetRepoInformation(octokit : Octokit, owner : string, repo : string, pages : number, updateCallback : () => void, signal : AbortSignal | undefined)
{
    const repoInfo = await octokit.rest.repos.get({
        owner,
        repo,
        request: {
            signal,
        }
    })
    await updateCallback()
    return repoInfo;
}

export async function ProcessCommits(octokit : Octokit, owner: string, repo: string, pages: number, updateCallback : () => void, signal : AbortSignal | undefined): Promise<CommitInfoResult[]>
{
    const result: CommitInfoResult[] = []
    const batchSize = 15
    let currentPage = 1
    let pendingRequests: Promise<boolean>[] = []

    while (currentPage <= pages) {
        while (pendingRequests.length < batchSize && currentPage <= pages)
        {
            pendingRequests.push(
                octokit.rest.repos.listCommits({
                    owner,
                    repo,
                    page: currentPage,
                    per_page: 100,
                    request: {
                        signal
                    }
                })
                .then(response => response.data)
                .then(data => {
                    updateCallback()
                    for (const commit of data) {
                        result.push(GetCommitAuthorType(commit))
                    }
                    return true;
                })
                .catch(error => {
                    return false;
                })
            )
            currentPage++
        }

        const batchResults = await Promise.all(pendingRequests)
        signal?.throwIfAborted()
        const failedRequests = batchResults.filter(r => r == false)
        if(failedRequests.length > 0)
        {
            throw new Error(`Failed to fetch ${failedRequests.length} pages`)
        }

        pendingRequests = []
    }

    return result
}