<script lang="ts">
    interface PropTypes {
        typeOfError : "notEnoughRequests" | "failedToParse" | "other"
    }

    const { typeOfError } : PropTypes = $props()
</script>

<header class="flex justify- items-baseline px-2 py-1 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p class="trucante-text">/// Error encountered</p>
</header>
<section class="flex flex-col items-center py-2 gap-2 grow-0">
    {#if typeOfError == "notEnoughRequests"}
        <h4 class="h4">!!! Not enough requests left !!!</h4>
        <p>Authenticate with a github token or wait for the rate limit to refresh</p>
    {:else if typeOfError == "failedToParse"}
        <h4 class="h4">!!! Failed to parse url !!!</h4>
        <p>Couldn't parse the github url. Please try inserting the repo's home url.</p>
    {:else}
        <h4 class="h4">!!! Unexpected Error !!!</h4>
        <p>Some error happened I guess, oh well... Try again I guess</p>
    {/if}
</section>
<footer class="flex justify-end items-baseline px-2 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p class="overflow-hidden">///</p>
</footer>