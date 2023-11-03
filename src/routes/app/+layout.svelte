<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
</script>

<nav>
    <a href="/app/home">Home</a>
    <a href="/app/user/sketches">My Sketches</a>
    <a href="/app/sketch/new" data-sveltekit-preload-data="off" data-sveltekit-reload>New Sketch</a>
    <a href="/logout" data-sveltekit-preload-data="off" >Logout</a>
</nav>

<slot></slot>