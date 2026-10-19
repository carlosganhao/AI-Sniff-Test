<script lang="ts">
    import { Avatar, Portal, Tooltip } from "@skeletonlabs/skeleton-svelte";
    import type { CommitType, RepoResultData } from "../../App";
    import BarChart from "../components/BarChart.svelte";
    import SectionHeader from "../components/SectionHeader.svelte";
    import { GetAIProfile } from "../logic/aiVerificationLogic";
    import { GetNameplate, GetSectionColor, GetSectionName } from "../logic/processingLogic";

    interface PropTypes {
        repoResultData : RepoResultData,
    }
    
    let { repoResultData } : PropTypes = $props()
</script>

<header class="flex justify-between items-baseline px-2 py-1 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p class="trucante-text">/// {repoResultData.fullRepoName}</p>
    <p class="trucante-text">{repoResultData.totalCommitNumber} commits in total</p>
</header>
<section class="flex justify-between items-baseline px-2 py-1 border-b-2 border-surface-950-50 text-surface-contrast-50-950 text-lg">
    <h4 class="h4 truncate-text">{repoResultData.aiPercent}% AI Detected</h4>
    <h4 class="h4 truncate-text">{GetNameplate(repoResultData.aiPercent)}</h4>
</section>
<section class="flex flex-col gap-2 grow-0">
    <div class="px-2">
        <SectionHeader leftTitle="Commit share" />
        <BarChart data={repoResultData.barData} labelTransform={(label) => GetSectionName(label as CommitType)} />
    </div>
    <div class="px-2">
        <SectionHeader leftTitle="Commit share over time" />
        <div class="flex gap-2">
            {#each Object.entries(repoResultData.barDataByYear) as entry}
                <div class="flex flex-col grow gap-1 items-stretch">
                    <BarChart data={entry[1]} orientation="vertical" includeNames={false} />
                    <p class="border-t-2 text-center truncate-text">{entry[0]}</p>
                </div>
            {/each}
        </div>
    </div>
    <div class="px-2">
        <SectionHeader leftTitle="Commit velocity" rightTitle={"All time: " + repoResultData.totalCommitVelocity + " c/week"} />
        <div class="flex gap-2">
            {#each Object.entries(repoResultData.velocyBarDataByYear) as entry}
                <div class="flex flex-col grow gap-1 items-stretch">
                    <BarChart data={[entry[1]]} orientation="vertical" includeNames={false} />
                    <p class="border-t-2 text-center truncate-text">{entry[0]}</p>
                </div>
            {/each}
        </div>
    </div>
    {#if Object.keys(repoResultData.aisUsed).length != 0}
        <div class="px-2">
            <SectionHeader leftTitle="Top 5 AIs Used" />
            <div class="flex flex-wrap gap-2 justify-center">
                {#each Object.entries(repoResultData.aisUsed).sort((a, b) => b[1] - a[1]).slice(0, 5) as aiEntry, i }
                    <Tooltip>
                        <Tooltip.Trigger class="flex self-center gap-1  items-center">
                            <div class="relative flex flex-col items-center justify-center hover:bg-surface-950-50 size-24">
                                <Avatar class="outline-2 outline-surface-950-50">
                                    <Avatar.Image src={GetAIProfile(aiEntry[0])?.avatarSrc ?? ""} />
                                    <Avatar.Fallback>{aiEntry[0]}</Avatar.Fallback>
                                </Avatar>
                                <span class="absolute inset-be-2 inset-s-2 border-surface-50-950 bg-surface-950-50 text-surface-50-950 px-1 border-2 ">#{i+1}</span>
                            </div>
                        </Tooltip.Trigger>
                        <Portal>
                            <Tooltip.Positioner>
                                <Tooltip.Content class="card max-w-40 bg-surface-50-950 p-2 border-2 border-surface-950-50 text-surface-950-50">
                                    <p class="border-b-2 text-center trucante-text">{aiEntry[0]}</p>
                                    <p class="trucante-text">{aiEntry[1]} commits in total (coauthored or pushed)</p>
                                    <Tooltip.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-950-50)]">
                                        <Tooltip.ArrowTip />
                                    </Tooltip.Arrow>
                                </Tooltip.Content>
                            </Tooltip.Positioner>
                        </Portal>
                    </Tooltip>
                {/each}
            </div>
        </div>
    {/if}
    <div class="grid grid-cols-5 gap-2 px-2 py-1 border-t-2 text-xs">
        {#each Object.keys({"ai":0,"aicoop":0,"bot":0,"user":0,"unknown":0}) as category}
            <div class="flex border-b-2" style:border-color={GetSectionColor(category as CommitType)}>
                <div style:background-color={GetSectionColor(category as CommitType)} class="w-5 aspect-square"></div>
                <span style:border-color={GetSectionColor(category as CommitType)} class="px-1 truncate-text">{GetSectionName(category as CommitType)}</span>
            </div>
        {/each}
    </div>
</section>
<footer class="flex justify-end items-baseline px-2 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p>Taken on {repoResultData.dateTaken.toLocaleTimeString(undefined, {year: "2-digit", month: "2-digit", day: "2-digit", hour12: false})}</p>
</footer>


