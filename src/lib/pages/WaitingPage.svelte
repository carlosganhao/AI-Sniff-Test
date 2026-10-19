<script lang="ts">

</script>

<header class="flex justify- items-baseline px-2 py-1 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p class="trucante-text">/// Waiting for input...</p>
</header>
<section class="flex flex-col gap-2 grow-0">
    <div class="px-2">
        <h4 class="h4">What is this?</h4>
        <p>
            This is a little utility that runs fully locally within your browser to catalog a repo's AI usage. 
        </p>
    </div>
    <div class="px-2">
        <h6 class="h6">1. Paste a url and submit!</h6>
        <p>
            Paste a github repo's url above and hit submit. This will send requests to github's api from your browser to fetch the repo's commits.
        </p>
    </div>
    <div class="px-2">
        <h6 class="h6">2. Analyse the data</h6>
        <p>
            After fetching all the commits, the data is displayed for you to see. Because this just looks at commit data, this cannot tell you 100% if AI is used or not. For a more thorough analysis, see <a class="anchor" href="https://github.com/SocksTheWolf/AgenticAlert">AgenticAlert</a>.
        </p>
    </div>
    <div class="px-2">
        <h6 class="h6">3. Rate limiting</h6>
        <p>
            Github rate limits API requets. By default you will make unauthorized requests,
            but if you need more requests you can paste a github personal access token to authenticate.
        </p>
    </div>
</section>
<footer class="flex justify-end items-baseline px-2 bg-surface-950-50 text-surface-contrast-950-50 text-xs">
    <p>///</p>
</footer>