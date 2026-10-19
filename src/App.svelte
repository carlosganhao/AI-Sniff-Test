<script lang="ts">
    import { ChevronDown, ChevronLeft, ChevronUp, Info } from "@lucide/svelte";
    import { Collapsible, Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
    import { Octokit, RequestError } from "octokit";
    import type { AppFlags, ProgressState, RateLimitState, RepoResultData } from "./App";
    import LightSwitch from "./lib/components/LightSwitch.svelte";
    import ResultEntry from "./lib/components/ResultEntry.svelte";
    import { GetCommitPageCount, GetRepoInformation, ProcessCommits } from "./lib/logic/fetchingLogic";
    import { CalculateResults } from "./lib/logic/processingLogic";
    import ErrorPage from "./lib/pages/ErrorPage.svelte";
    import ProgressPage from "./lib/pages/ProgressPage.svelte";
    import ResultsPage from "./lib/pages/ResultsPage.svelte";
    import WaitingPage from "./lib/pages/WaitingPage.svelte";
    import { storedResults } from "./lib/Storage";

    const progressDefaultState = {total: 0, current: 0, label: ""}

    let octokit = $state.raw(new Octokit())
    let abortController : AbortController | null = $state(null)
    let flags : AppFlags = $state({
        parsingError: false,
        requestError: false,
        requestSent: false,
        isLoading: false,
        isAuthOpened: false,
        authError: false,
        notEnoughRequests: false,
        isStorageOpen: false,
    })
    let progressState : ProgressState = $state(progressDefaultState)
    let inputText : string = $state("");
    let authText : string = $state("");
    let rateLimitState : RateLimitState = $state({total: 60, current: 60})
    let repoResultData : RepoResultData | null = $state.raw(null)

    async function ChangeAuth(authToken : () => string)
    {
        try {
            flags.authError = false;
            octokit = new Octokit({auth: authToken()})
            await UpdateRateLimit()
        }
        catch(error)
        {
            octokit = new Octokit()

            if(error instanceof RequestError && error.name == "HttpError" && error.status == 401)
            {
                flags.authError = true;
                return;
            }
        }

    }

    async function ProcessRepo()
    {
        repoResultData = null;
        progressState = progressDefaultState;
        flags.requestSent = true;
        flags.isLoading = true;
        flags.notEnoughRequests = false;
        flags.requestError = false;
        flags.parsingError = false;
        abortController = new AbortController();
        const match = inputText.match(/https:\/\/github.com\/(?<owner>[^\/]*)\/(?<repo>[^\/|#]*)(?:\/|#|$)/)

        if(match?.groups == null)
        {
            flags.isLoading = false;
            flags.parsingError = true;
            return;
        }

        const groups = match?.groups;
        try {
            var pages : number = await GetCommitPageCount(octokit, groups.owner, groups.repo, async () => await UpdateRateLimit(), abortController.signal)
            abortController.signal.throwIfAborted();

            if(!HasSuficientRequestsLeft(pages))
            {
                flags.isLoading = false;
                flags.notEnoughRequests = true;
                return;
            }

            progressState = {current: 1, total: pages + 1, label: "Fetching repo information"}
            const repoInfo = await GetRepoInformation(octokit, groups.owner, groups.repo, pages, async () => await UpdateRateLimit(), abortController.signal);
            abortController.signal.throwIfAborted();

            const commits = await ProcessCommits(octokit, groups.owner, groups.repo, pages, async () => { UpdateProgress(`Processing ${progressState.current}/${pages} commit pages`); UpdateRateLimit(); }, abortController.signal);
            abortController.signal.throwIfAborted();

            repoResultData = CalculateResults(repoInfo, commits);
            flags.isStorageOpen = false;
            if(repoResultData == null)
            {
                return;
            }
            UpdateStoredResults(repoResultData);
        }
        catch (error)
        {
            if(error instanceof Error && error.name == "AbortError")
            {
                flags.isLoading = false;
                flags.requestSent = false;
                return
            }
            flags.requestError = true;
        }

        UpdateRateLimit()
        flags.isLoading = false
    }

    async function OnSubmit(formEvent : SubmitEvent)
    {
        formEvent?.preventDefault();
        ProcessRepo();
    }

    async function UpdateRateLimit()
    {
        var rateData = (await octokit.rest.rateLimit.get()).data
        rateLimitState.current = rateData.rate.remaining
        rateLimitState.total = rateData.rate.limit
    }

    async function UpdateProgress(label : string, delta : number = 1)
    {
        progressState.label = label;
        var nextCurrent = progressState.current + delta;
        progressState.current = nextCurrent ;
    }

    function HasSuficientRequestsLeft(pagesCount : number) : boolean
    {
        if(rateLimitState.current <= 0)
        {
            return false;
        }

        return rateLimitState.current > pagesCount + 1
    }

    function ToggleStorage(currentState : boolean)
    {
        flags.isStorageOpen = !currentState;
    }

    function UpdateStoredResults(result : RepoResultData)
    {
        const foundIndex = $storedResults.findIndex((value) => value.fullRepoName == result.fullRepoName)
        if(foundIndex != -1)
        {
            storedResults.update((cur) => {
                cur.splice(foundIndex, 1)
                cur.unshift(result);
                return cur
            })
            return;
        }

        if($storedResults.length >= 16)
        {
            storedResults.update((cur) => {
                cur.pop()
                cur.unshift(result);
                return cur
            })
            return;
        }

        storedResults.update((cur) => {
            cur.unshift(result);
            return cur
        })
    }

    function SelectStoredResult(index : number)
    {
        flags.requestSent = true;
        flags.isLoading = false;
        const selectedResult = $storedResults[index]
        repoResultData = selectedResult;
        inputText = selectedResult.repoUrl;
        flags.isStorageOpen = false;
    }

    function RefetchStoredResult(index : number)
    {
        flags.requestSent = true;
        flags.isLoading = false;
        const selectedResult = $storedResults[index]
        inputText = selectedResult.repoUrl;
        ProcessRepo();
        flags.isStorageOpen = false;
    }

    function DeleteStoredResult(index : number)
    {
        storedResults.update((cur) => {
            cur.splice(index, 1)
            return cur
        })
    }

    UpdateRateLimit()
</script>

<header class="grow-0 shrink flex flex-col items-center my-2 md:my-4">
    <h1 class="h1 uppercase text-center">AI Sniff Test</h1>
    <div class="flex w-full max-w-sm h-2">
        <div class="h-full bg-error-600-400" style:width="10%"></div>
        <div class="h-full bg-warning-600-400" style:width="15%"></div>
        <div class="h-full bg-success-600-400" style:width="30%"></div>
        <div class="h-full bg-primary-600-400" style:width="45%"></div>
    </div>
    <p class="mt-2 text-center">Know how much AI commits there are in a github repo</p>
</header>
<main class="grow flex flex-col w-full max-w-3xl overflow-x-hidden overflow-y-auto m-auto gap-4">
    <section class="flex flex-col px-2 md:px-0">
        <header class="flex justify-between items-baseline text-surface-contrast-50-950 text-xs py-1 border-b-2">
            <button class="flex items-center" onclick={() => ToggleStorage(flags.isStorageOpen)}><ChevronLeft class="h-elem-sm"/> Open storage</button>
            <LightSwitch />
        </header>
        <form class="flex flex-col items-center my-2" onsubmit={OnSubmit}>
            <div class="w-full field-group flex gap-0">
                <input class="input border-2 border-e-0 shadow-none! ring-0" type="url" name="repoUrl" placeholder="git repo here" bind:value={inputText}>
                <button class="btn btn-lg preset-filled" type="submit">Check</button>
            </div>
        </form>
        <Collapsible open={flags.isAuthOpened} onOpenChange={(details => (flags.isAuthOpened = details.open))} class="items-stretch text-sm text-surface-600-400">
            <Collapsible.Content>
                <input class="input border-2 shadow-none! ring-0" type="password" name="auth" onchange={() => ChangeAuth(() => authText)} placeholder="git API Key here" bind:value={authText}>
            </Collapsible.Content>
            <div class="flex justify-between gap-x-2">
                <Tooltip positioning={{placement: "bottom-start"}}>
                    <Tooltip.Trigger class="flex self-center gap-1 items-center">
                        <span class="truncate-text">{rateLimitState.current} / {rateLimitState.total} req. left</span><Info class="h-elem-base" />
                    </Tooltip.Trigger>
                    <Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Content class="card max-w-md bg-surface-50-950 p-2 border-2 border-surface-950-50 text-surface-950-50">
                                <p class="truncate-text">Github rate limits API requests.</p>
                                <p class="truncate-text">When unauthorized this limit is 60 requests per hour.</p>
                                <p class="truncate-text">When authorized the default limit is 5000 requests per hour.</p>
                                <Tooltip.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-950-50)]">
                                    <Tooltip.ArrowTip />
                                </Tooltip.Arrow>
                            </Tooltip.Content>
                        </Tooltip.Positioner>
                    </Portal>
                </Tooltip>
                {#if flags.authError}
                    <span class="text-error-600-400 text-center ms-auto truncate-text">!!! Auth token is invalid !!!</span>
                {/if}
                <Collapsible.Trigger class="flex items-center">
                    <span>Auth</span>
                    <Collapsible.Indicator class="group">
                        <ChevronUp class="h-elem-sm group-data-[state=open]:block hidden" />
                        <ChevronDown class="h-elem-sm group-data-[state=open]:hidden block" />
                    </Collapsible.Indicator>
                </Collapsible.Trigger>
            </div>
        </Collapsible>
    </section>
    <section class="relative grow flex flex-col">
        <article class="flex flex-col card preset-outlined-surface-950-50 border-2! mx-2 md:mx-0 my-auto">
            {#if !flags.requestSent}
                <WaitingPage />
            {:else if flags.isLoading}
                <ProgressPage progressState={progressState} onCancel={() => abortController?.abort()} />
            {:else if flags.parsingError}
                <ErrorPage typeOfError="failedToParse" />
            {:else if flags.notEnoughRequests}
                <ErrorPage typeOfError="notEnoughRequests" />
            {:else if flags.requestError}
                <ErrorPage typeOfError="other" />
            {:else if repoResultData != null}
                <ResultsPage repoResultData={repoResultData} />
            {:else}
                <ErrorPage typeOfError="other" />
            {/if}
        </article>
        <aside 
            class={{
                "absolute h-full w-full transition-transform duration-300 motion-reduce:duration-0": true,
                "-translate-x-full": !flags.isStorageOpen,
                "translate-x-none": flags.isStorageOpen,
            }}
        >
            <div class="h-full inset-bs-0 inset-be-0 mx-2 md:mx-0 flex flex-col border-2 border-surface-950-50 text-surface-950-50 bg-surface-50-950 ">
                <header class="col-span-2 px-2 py-1 bg-surface-950-50 text-surface-contrast-950-50 text-sx">
                    <p class="trucante-text">/// Storage ({$storedResults.length}/16)</p>
                </header>
                <section class="grid grid-cols-2 auto-rows-min gap-2 p-2 overflow-x-hidden overflow-y-scroll">
                    {#each $storedResults as result, i }
                        {@const selected = repoResultData?.fullRepoName == result.fullRepoName}
                        <ResultEntry index={i} selected={selected} result={result} onSelected={SelectStoredResult} onRefresh={RefetchStoredResult} onDelete={DeleteStoredResult} class={{"outline-2 outline-secondary-600-400": selected}} />
                    {/each}
                </section>
            </div>
        </aside>
    </section>
</main>
<footer class="grow-0 shrink text-xs flex flex-col items-center py-1 mt-2 bg-surface-200-800">
    <span class="opacity-50 truncate-text">Mabe by Cooli2 with Svelte</span>
</footer>