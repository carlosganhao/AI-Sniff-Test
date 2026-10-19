<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    interface PropsType {
        leftTitle : string,
        rightTitle? :string,
        class? : ClassValue | undefined,
    }

    const {leftTitle, rightTitle, ...props} : PropsType = $props()
</script>

<div class="flex gap-2 items-baseline">
    <h6 class="h6 truncate-text">{leftTitle}</h6>
    <div class={{"grow h-2 border-t-2": true, "border-e-2": rightTitle == null}}></div>
    {#if rightTitle != null}
        <h6 class="h6 truncate-text">{rightTitle}</h6>
    {/if}
</div>