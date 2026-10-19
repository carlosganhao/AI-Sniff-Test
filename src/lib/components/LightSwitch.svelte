<script lang="ts">
    import { Moon, Sun } from "@lucide/svelte";
    import { colorMode } from "../Storage";

    function ToggleColorMode()
    {
        if($colorMode == "dark")
        {
            colorMode.set("light")
            return;
        }
        colorMode.set("dark")
    }

    $effect(() => {
        document.documentElement.dataset["mode"] = $colorMode;
    })
</script>

<button class="" onclick={(e) => ToggleColorMode()} >
    {#if $colorMode == "dark"}
        <Sun class="h-elem-sm" />
    {:else}
        <Moon class="h-elem-sm" />
    {/if}
</button>