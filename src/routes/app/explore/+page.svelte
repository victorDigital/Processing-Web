<script>
	import { invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;
	console.log(data);

	let disableButtons = [];
	data.sketches.forEach((sketch) => {
		disableButtons.push(false);
	});

	import { quintInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 20,
				easing: quintInOut
			};
		}
	});

	let lastUpdate = Date.now();

	const likeSketch = (id, i) => {
		/* let sketch = data.sketches.find((sketch) => sketch.id === id);
		sketch.likes = sketch.likes + 1; */

		// this is to update the UI immediately then re-update it when the fetch is done
		if (Object.keys(data.sketches[i].usersLiked).includes(data.user.uid)) {
			data.sketches[i].likes = data.sketches[i].likes - 1;
			delete data.sketches[i].usersLiked[data.user.uid];
		} else {
			data.sketches[i].likes = data.sketches[i].likes + 1;
			data.sketches[i].usersLiked[data.user.uid] = true;
		}

		disableButtons[i] = true;
		fetch('/api/likesketch', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: data.user.uid,
				Sketch: id
			}
		}).finally(() => {
			invalidateAll().finally(() => {
				disableButtons[i] = false;
			});
			lastUpdate = Date.now();
		});
	};
</script>

<div class="container mx-auto">
	<h1 class="mt-6 font-space font-semibold text-3xl">Explore Trending Sketches</h1>
	<div class="mt-3">
		<div class="grid gap-2 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
			{#key lastUpdate}
				{#each data.sketches as sketch, i (sketch.id)}
					<div
						in:receive={{ key: sketch.id, duration: 400 }}
						out:send={{ key: sketch.id, duration: 400 }}
						animate:flip={{ duration: 400 }}
					>
						<a
							class="w-full h-fit bg-base-200 text-left"
							href="/app/sketch/{sketch.id}/view"
							data-sveltekit-preload-data="off"
						>
							<div class="p-2 bg-base-200 rounded-t-lg">
								<h2 class="font-bold text-lg line-clamp-1">{sketch.name}</h2>
								<p class="line-clamp-1">By: {sketch.maker}</p>
							</div>
						</a>
						<div
							class="w-full flex flex-row h-8 items-center justify-start bg-base-300 p-2 rounded-b-lg pl-4"
						>
							<button class="flex items-center">
								<span class="material-symbols-outlined"> visibility </span>
								<span class="font-space text-xl pl-1">{sketch.views}</span>
							</button>
							<div class="divider divider-horizontal" />
							<button class="flex items-center">
								<span class="material-symbols-outlined"> chat_bubble </span>
								<span class="font-space text-xl pl-1">{sketch.comments.length}</span>
							</button>
							<div class="divider divider-horizontal" />
							{#if !disableButtons[i]}
								 <button class="flex items-center" on:click={likeSketch(sketch.id, i)}>
									 {#if Object.keys(sketch.usersLiked).includes(data.user.uid)}
										 <span class="material-symbols-outlined text-red-500"> favorite </span>
									 {:else}
										 <span class="material-symbols-outlined "> favorite </span>
									 {/if}
									 <span class="font-space text-xl pl-1">{sketch.likes}</span>
								 </button>
							{:else}
								 <div class="flex items-center cursor-wait select-none">
									<span class="material-symbols-outlined animate-pulse"> favorite </span>
									<span class="font-space text-xl pl-1">{sketch.likes}</span>
								 </div>
							{/if}
						</div>
					</div>
				{/each}
			{/key}
		</div>
	</div>
</div>
