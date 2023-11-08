<script>
    export let data;
    console.log(data);

    let value = atob(data.sketch.code);
    //run the code
    let p5;
    let showCanvas = false;
    const startProgram = () => {
        if (showCanvas) {
            stopProgram();
        }
        compile();
        showCanvas = true;
    };

    const compile = () => {
        try {
            var compiled = Processing.compile(value);
            p5 = new Processing(document.getElementById('processing'), compiled);
            console.log(p5);
        } catch (error) {
            console.log(error);
        }
    };

    const stopProgram = () => {
        p5.exit();
        showCanvas = false;
    };
</script>

<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.0/processing.js"></script>
</svelte:head>

<p></p>

<div class="w-full h-10 bg-secondary text-white flex items-baseline font-space p-1 px-5">
    <h1 class="text-2xl">{data.sketch.name}</h1>
    <div class="divider divider-horizontal"></div>
    <p>By: {data.sketch.maker}</p>
</div>

<button on:click={startProgram}>Run</button>

<canvas id="processing" class="" />