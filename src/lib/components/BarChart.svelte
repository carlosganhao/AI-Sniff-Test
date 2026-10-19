<script lang="ts">
    import { Portal, Tooltip } from "@skeletonlabs/skeleton-svelte";
    import type { ClassValue } from "svelte/elements";
    import type { BarChartData, BarChartOrientation } from "../../App";

    interface BarChartProps {
        data : BarChartData[],
        orientation? : BarChartOrientation,
        includeNames? : boolean,
        includeTooltips? : boolean,
        labelTransform? : (label : string) => string,
        class? : ClassValue | undefined,
    }

    let { data, orientation = "horizontal", includeNames = true, includeTooltips = true, labelTransform = undefined, ...props } : BarChartProps = $props()
</script>

<div {...props} class={["w-full flex flex-col", props["class"]]}>
    {#if includeNames}
    <div class={{"w-full flex": true, "flex-col": orientation == "vertical"}}>
        {#each data as item }
            {#if item.values > 0}
                <div class="flex border-s-2" style:width={orientation == "horizontal" ? `${item.percent}%` : "auto"} style:height={orientation == "vertical" ? `${item.percent}%` : "auto"} style:border-color={item.color}>
                    <!-- <div style:background-color={item.color} class="w-2 h-6"></div> -->
                    <span class="ps-1 truncate-text">{labelTransform?.(item.label) ?? item.label}</span>
                </div>
            {/if}
        {/each}
    </div>
    {/if}
    <div class={{"w-full h-10 flex": true, "flex-col-reverse": orientation == "vertical"}}>
        {#each data as item }
            {#if item.values > 0}
                {#if includeTooltips}
                    <Tooltip>
                        <Tooltip.Trigger style={(`background-color: ${item.color}; width: ${orientation == "horizontal" ? `${item.percent}%` : "auto"}; height:${orientation == "vertical" ? `${item.percent}%` : "auto"}`)}>
                        </Tooltip.Trigger>
                        <Portal>
                            <Tooltip.Positioner>
                                <Tooltip.Content class="card max-w-40 bg-surface-50-950 p-2 border-2 border-surface-950-50 text-surface-950-50">
                                    <p class="border-b-2 text-center">{labelTransform?.(item.label) ?? item.label}</p>
                                    <p class="text-center">{item.values}</p>
                                    <Tooltip.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-950-50)]">
                                        <Tooltip.ArrowTip />
                                    </Tooltip.Arrow>
                                </Tooltip.Content>
                            </Tooltip.Positioner>
                        </Portal>
                    </Tooltip>
                {:else}
                    <div style={(`background-color: ${item.color}; width: ${orientation == "horizontal" ? `${item.percent}%` : "auto"}; height:${orientation == "vertical" ? `${item.percent}%` : "auto"}`)}></div>
                {/if}
            {/if}
        {/each}
    </div>
</div>