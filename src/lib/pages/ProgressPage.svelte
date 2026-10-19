<script lang="ts">
    import { Progress } from "@skeletonlabs/skeleton-svelte";
    import type { ProgressState } from "../../App";

    interface PropTypes {
        progressState : ProgressState,
        onCancel : () => void,
    }

    const { progressState, onCancel } : PropTypes = $props()
</script>

<header class="flex justify- items-baseline px-2 py-1 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p class="trucante-text">/// Processing in progress</p>
</header>
<section class="flex flex-col gap-2 grow-0">
    <Progress class="px-2 py-2 items-center w-full" value={(progressState.total > 0 ? progressState.current : null)} max={progressState.total}>
        <Progress.Label class="text-surface-950-50 truncate-text">
            {progressState.label}
        </Progress.Label>
        <Progress.Track class="h-10 bg-surface-50-950">
            <Progress.Range class="rounded-none bg-surface-950-50" />
        </Progress.Track>
    </Progress>
    <button class="btn btn-sm preset-filled-surface-950-50 ms-auto mb-2 me-2" onclick={() => onCancel()}>
        Cancel
    </button>
</section>
<footer class="flex justify-end items-baseline px-2 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p class="overflow-hidden">///</p>
</footer>