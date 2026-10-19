import type { AIProvider } from "./lib/logic/aiVerificationLogic";

export type BarChartOrientation = "horizontal" | "vertical"
export type ColorMode = "dark" | "light";
export type UserType = "user" | "ai" | "bot";
export type CommitType = "user" | "aicoop" | "ai" | "bot" | "unknown";
export type StoredResults = RepoResultData[] 
export interface CommitTypeData extends Record<CommitType, number> {}
export interface RateLimitState {
    current : number,
    total : number,
}
export interface ProgressState {
    current : number,
    total : number,
    label : string,
}
export interface CommitInfoResult {
    authorName : string,
    commitType : CommitType,
    aiUsed : AIProvider | null,
    commitDate?: Date | null,
}
export interface RepoResultData {
    fullRepoName : string,
    repoUrl : string,
    aiPercent : number,
    aisUsed : {[index : string]: number},
    totalCommitNumber : number,
    totalAiCommitNumber : number,
    totalCommitVelocity : number,
    barData : BarChartData[],
    barDataByYear : {[index : number]: BarChartData[]},
    velocyBarDataByYear : {[index : number]: BarChartData},
    dateTaken : Date,
}
export interface CommitVelocity {
    perDay : number,
    perWeek : number,
    perMonth : number,
    perYear : number,
}
export interface AiProfile {
    avatarSrc : string,
}
export interface BarChartData {
    values : number,
    percent : number,
    color : string,
    label : string,
}
export interface AppFlags {
    parsingError : boolean
    requestError : boolean
    requestSent : boolean
    isLoading : boolean
    isAuthOpened : boolean
    authError : boolean
    notEnoughRequests : boolean
    isStorageOpen : boolean
}