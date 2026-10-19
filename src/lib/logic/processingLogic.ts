import type { Endpoints } from "@octokit/types";
import type { BarChartData, CommitInfoResult, CommitType, CommitTypeData, CommitVelocity, RepoResultData } from "../../App";
import { CheckAiEmail } from "./aiVerificationLogic";

export function CalculateResults(repoInfo : Endpoints["GET /repos/{owner}/{repo}"]["response"], commits : CommitInfoResult[]) : RepoResultData | null
{
    if(commits == null)
    {
        return null;
    }

    const result : RepoResultData = {
        repoUrl: repoInfo.data.html_url,
        fullRepoName: repoInfo.data.full_name,
        aisUsed: {},
        aiPercent: 0,
        totalCommitNumber: commits.length,
        totalAiCommitNumber: 0,
        totalCommitVelocity: 0,
        barData: [],
        barDataByYear: {},
        velocyBarDataByYear: {},
        dateTaken: new Date(Date.now())
    }
    const commitAmountByAuthor : CommitTypeData = {"ai":0,"aicoop":0,"bot":0,"unknown":0,"user":0}
    const yearsAvailable = CalculateAvailableYears();
    const commitAmountByAuthorByYear : {[index : number]: CommitTypeData} | null = yearsAvailable.reduce((acu : {[index : number]: CommitTypeData}, cur) => (acu[cur] = {"ai":0,"aicoop":0,"bot":0,"unknown":0,"user":0}, acu), {})
    const commitsPerYear : {[index : number]: CommitInfoResult[]} = {}
    const commitVelocityPerYear : {[index : number]: number} = {}
    let commitTopVelocityPerYear : number = 0
    const commitAuthors : {[index : string]: number} = {}
    
    commits.forEach((value, i) => {
        commitAuthors[value.authorName] ??= 0;
        commitAuthors[value.authorName] += 1;
        commitAmountByAuthor[value.commitType] += 1;
        if(value.aiUsed != null)
        {
            result.aisUsed[value.aiUsed] ??= 0;
            result.aisUsed[value.aiUsed] += 1;
        }
        if(commitAmountByAuthorByYear != null && value.commitDate != null)
        {
            const commitYear = value.commitDate.getFullYear();
            if(commitAmountByAuthorByYear[commitYear] != null)
            {
                commitsPerYear[commitYear] ??= [];
                commitsPerYear[commitYear].push(value);
                commitAmountByAuthorByYear[commitYear][value.commitType] += 1
            }
        }
    })
    Object.entries(commitsPerYear).forEach((value) => {
        const velocity = CalculateCommitSpeedWithElapsed(value[1].length, 31557600000);
        commitVelocityPerYear[parseInt(value[0])] = velocity.perWeek;
        if(velocity.perWeek > commitTopVelocityPerYear)
        {
            commitTopVelocityPerYear = velocity.perWeek;
        }
    })
    result.aiPercent = Math.round(((commitAmountByAuthor.ai + commitAmountByAuthor.aicoop) / commits.length) * 1000) / 10;
    result.totalAiCommitNumber = commitAmountByAuthor.ai + commitAmountByAuthor.aicoop;
    result.totalCommitVelocity = CalculateCommitSpeed(commits, commits.length).perWeek;

    result.barData = CalculateCommitBarData(commitAmountByAuthor, commits.length);
    result.barDataByYear = yearsAvailable.reduce((acu : {[index : number]: BarChartData[]}, cur) => (acu[cur] = commitAmountByAuthorByYear != null && commitsPerYear[cur] != null ? CalculateCommitBarData(commitAmountByAuthorByYear[cur], commitsPerYear[cur].length) : [], acu), {})
    result.velocyBarDataByYear = yearsAvailable.reduce((acu : {[index : number]: BarChartData}, cur) => (acu[cur] = CalculateVelocityBarData(commitsPerYear[cur] != null ? commitVelocityPerYear[cur] : 0, commitTopVelocityPerYear), acu), {})
    return result;
}

export function GetCommitAuthorType(commit : Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][0]) : CommitInfoResult
{
    if(commit.commit.author?.name == null)
    {
        return {
            commitType: "unknown",
            authorName: "unknown",
            aiUsed: null,
            commitDate: null,
        };
    }
    
    // const emailMatch = commit.commit.author?.email.match(/(.*\+)?(?<email>.*)/)
    const emailMatch = commit.commit.author?.email?.slice(commit.commit.author?.email.indexOf("+") + 1) ?? ""
    const authorAI = CheckAiEmail(emailMatch)
    if(authorAI != null)
    {
        return {
            commitType: "ai",
            authorName: commit.commit.author.email ?? commit.commit.author.name,
            aiUsed: authorAI,
            commitDate: commit.commit.author?.date != null ? new Date(commit.commit.author?.date) : null,
        };
    }

    const match = commit.commit.message.match(/[Cc]o-[Aa]uthored-[Bb]y:[^\\]*<(?<coauthor>[^>]*@[^>]*)>/)
    const usedAiEmail = match?.groups?.coauthor.slice(match?.groups?.coauthor.indexOf("+") + 1)
    const coauthorAI = CheckAiEmail(usedAiEmail)
    if(coauthorAI != null)
    {
        return {
            commitType: "aicoop",
            authorName: commit.commit.author.email ?? commit.commit.author.name,
            aiUsed: coauthorAI,
            commitDate: commit.commit.author?.date != null ? new Date(commit.commit.author?.date) : null,
        };
    }

    if(commit.author?.type == "Bot")
    {
        return {
            commitType: "bot",
            authorName: commit.commit.author.email ?? commit.commit.author.name,
            aiUsed: null,
            commitDate: commit.commit.author?.date != null ? new Date(commit.commit.author?.date) : null,
        };
    }
    
    return {
        commitType: "user",
        authorName: commit.commit.author.email ?? commit.commit.author.name,
        aiUsed: null,
        commitDate: commit.commit.author?.date != null ? new Date(commit.commit.author?.date) : null,
    };
}

export function GetSectionColor(commitType : CommitType) : string
{
    switch (commitType) {
        case "ai":
            return "var(--color-error-600-400)"
        case "aicoop":
            return "var(--color-warning-600-400)"
        case "user":
            return "var(--color-primary-600-400)"
        case "bot":
            return "var(--color-success-600-400)"
        default:
            return "var(--color-secondary-600-400)"
    }
}

export function GetSectionName(commitType : CommitType) : string
{
    switch (commitType) {
        case "ai":
            return "AI"
        case "aicoop":
            return "AI Coauthored"
        case "user":
            return "User"
        case "bot":
            return "Bot"
        default:
            return "Unknown"
    }
}

export function GetNameplate(aiPercent : number) : string
{
    if(aiPercent <= 0)
    {
        return "Untouched"
    }
    else if(aiPercent <= 15)
    {
        return "AI Touched"
    }
    else if(aiPercent <= 50)
    {
        return "AI Assisted"
    }
    else if(aiPercent <= 80)
    {
        return "AI Influenced"
    }
    return "Vibe Coded"
}

export function CalculateAvailableYears() : number[] 
{
    const olderYear = (new Date(Date.now())).getFullYear() - 4
    return Array.from({length: 5}, (e, i)=> i + olderYear)
}

export function CalculateCommitBarData(commitsByAuthor : CommitTypeData, size : number) : BarChartData[]
{
    const commitTypes = Object.keys(commitsByAuthor);
    const commitTypesAmount = Object.values(commitsByAuthor) as number[];
    const result : BarChartData[] = []
    for(let i = 0; i < commitTypes.length; i++)
    {
        result[i] = {
            label: commitTypes[i],
            values: commitTypesAmount[i],
            color: GetSectionColor(commitTypes[i] as CommitType),
            percent: (commitTypesAmount[i] / size) * 100,
        }
    }
    return result;
}

export function CalculateVelocityBarData(commitVelocity : number, topVelicity : number) : BarChartData
{
    return {
        label: "Average commits per week",
        values: commitVelocity,
        color: "var(--color-surface-950-50)",
        percent: (commitVelocity / topVelicity) * 100,
    }
}

export function CalculateCommitSpeedWithElapsed(totalCommits : number, elapsedMs : number) : CommitVelocity
{
    return {
        perDay: Math.round((totalCommits / Math.floor(elapsedMs / 86400000)) * 100) / 100,
        perWeek: Math.round((totalCommits / Math.floor(elapsedMs / 604800000)) * 100) / 100,
        perMonth: Math.round((totalCommits / Math.floor(elapsedMs / 2628000000)) * 100) / 100,
        perYear: Math.round((totalCommits / Math.floor(elapsedMs / 31557600000)) * 100) / 100,
    }
}

export function CalculateCommitSpeed(data : CommitInfoResult[], totalCommits : number) : CommitVelocity
{
    let firstCommit = data.find(x => x.commitDate != null);
    let lastCommit = data.findLast(x => x.commitDate != null);
    if(lastCommit == null || lastCommit.commitDate == null
        || firstCommit == null || firstCommit.commitDate == null)
    {
        return {
            perDay: 0,
            perWeek: 0,
            perMonth: 0,
            perYear: 0
        };
    }

    let firstDate = firstCommit.commitDate.valueOf();
    let lastDate = lastCommit.commitDate.valueOf();
    let elapsedTime = firstDate <= lastDate ? (lastDate - firstDate) : (firstDate - lastDate);
    return CalculateCommitSpeedWithElapsed(totalCommits, elapsedTime)
}