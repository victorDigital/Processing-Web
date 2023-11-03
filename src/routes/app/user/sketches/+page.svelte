<script>
    export let data;
    let sketches = data.sketches ?? [];
</script>

<h1>My Sketches</h1>

<table>
    <thead>
        <tr>
            <th>name</th>
            <th>actions</th>
        </tr>
    </thead>
    <tbody>
        {#each sketches as sketch}
        <tr>
            <td>{sketch.name}</td>
            <td data-sveltekit-preload-data="tap">
                <a href="/app/sketch/{sketch.id}">edit</a>
                <a href="/app/sketch/{sketch.id}/delete">delete</a>
            </td>
        </tr>
        {/each}
    </tbody>
</table>