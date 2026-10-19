<script lang="ts">
    import { RefreshCw, Trash } from "@lucide/svelte";
    import type { ClassValue } from "svelte/elements";
    import type { RepoResultData } from "../../App";
    import { GetNameplate } from "../logic/processingLogic";
    import BarChart from "./BarChart.svelte";

    interface PropTypes {
        index : number,
        selected : boolean,
        result : RepoResultData,
        onSelected : (i : number) => void
        onRefresh : (i : number) => void
        onDelete : (i : number) => void
        class : ClassValue
    }

    const { index, selected, result, onSelected, onRefresh, onDelete, ...props } : PropTypes = $props()
</script>

<article {...props} class={["flex flex-col card preset-outlined-surface-950-50 border-2! hover:outline-2 outline-primary-600-400", props["class"]]} onclick={() => onSelected(index)}>
    <header class="flex justify-between items-baseline px-2 py-1 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
        <p class="truncate-text">/// {result?.fullRepoName}</p>
        {#if selected}
            <p class="truncate-text md:inline hidden trucante-text">-selected-</p>
        {/if}
    </header>
    <section class="flex justify-between gap-1 grow-0 px-2 py-1 border-b-2 border-surface-950-50 text-surface-contrast-50-950 text-md">
        <p class="truncate-text trucante-text">{result.aiPercent}% AI Detected</p>
        <p class="truncate-text md:inline hidden">{GetNameplate(result.aiPercent)}</p>
    </section>
    <section class="flex flex-col gap-1 grow-0 px-2 py-1 text-sm">
        <p class="truncate-text">{result.totalCommitNumber} total Commits</p>
        <BarChart data={result.barData} includeNames={false} includeTooltips={false} class="h-4" />
    </section>
    <footer class="flex justify-start items-baseline px-2 border-t-2 gap-1 border-surface-950-50 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
        <p class="me-auto truncate-text">{result.dateTaken.toLocaleTimeString(undefined, {year: "2-digit", month: "2-digit", day: "2-digit", hour12: false})}</p>
        <button class="btn btn-xs preset-filled-surface-50-950 flex self-center size-4.5 p-0!" onclick={(e) => {e.stopPropagation(); onRefresh(index)}}>
            <RefreshCw class="size-elem-xs m-auto"></RefreshCw>
        </button>
        <button class="btn btn-xs preset-filled-surface-50-950 flex self-center size-4.5 p-0!" onclick={(e) => {e.stopPropagation(); onDelete(index)}}>
            <Trash class="size-elem-xs m-auto"></Trash>
        </button>
    </footer>
</article>