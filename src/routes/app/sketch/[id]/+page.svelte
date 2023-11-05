<script>
	import CodeMirror from 'svelte-codemirror-editor';
	import { java } from '@codemirror/lang-java';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { invalidateAll } from '$app/navigation';

	export let data;
	console.log(data);

	let value = atob(data.sketch.code);

	let isPublic = data.sketch.public == 'true' ? true : false;

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';
	let p5;
	let showCanvas = false;

	let settingsOpen = false;
	let editName = false;

	let autoRun = true;
	let darkMode = true;

	let showError = false;
	let errorMessage = '';

	const toggleSettings = () => {
		settingsOpen = !settingsOpen;
	};

	const autoRunProgram = () => {
		if (autoRun) {
			startProgram();
		}
	};

	const compile = () => {
		try {
			var compiled = Processing.compile(value);
			p5 = new Processing(document.getElementById('processing'), compiled);
			showError = false;
			console.log(p5);
		} catch (error) {
			showError = true;
			errorMessage = error.message;
			console.log(error);
		}
	};

	let lastSave = Date.now();

	const startProgram = () => {
		if (showCanvas) {
			stopProgram();
		}
		compile();
		showCanvas = true;

		//if there is more than 60 seconds since last save, save the sketch
		if (Date.now() - lastSave > 60000) {
			saveSketch();
			lastSave = Date.now();
		}
	};

	const stopProgram = () => {
		if (!p5) {
			return;
		}

		p5.exit();
		//clear the canvas
		var canvas = document.getElementById('processing');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		showCanvas = false;
	};

	let success;
	let loading;

	const saveSketch = async () => {
		console.log('save sketch');
		//fetch the api with the code and id as a headers
		success = false;
		loading = true;
		fetch('/api/savesketch', {
			method: 'PUT',
			headers: {
				Authorization: data.sketch.uid,
				Code: btoa(value),
				Sketch: data.sketch.id,
				Name: data.sketch.name
			}
		}).catch((error) => {
			console.log(error);
			success = false;
			loading = false;
		});
		await new Promise((r) => setTimeout(r, 500));
		success = true;

		//wait 2 seconds
		invalidateAll();
		await new Promise((r) => setTimeout(r, 2500));
		loading = false;
	};

	const changeVisibility = async () => {
		await fetch('/api/changesketchvisibility', {
			method: 'PUT',
			headers: {
				Authorization: data.sketch.uid,
				Sketch: data.sketch.id,
				Visibility: !isPublic
			}
		})
			.catch((error) => {
				console.log(error);
			})
			.then(() => {
				isPublic = !isPublic;
			});
	};
</script>

<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.0/processing.js"></script>
</svelte:head>

<div class="flex flex-col justify-between shadow-lg items-start w-full">
	<div class="p-2 w-full h-16 px-3 flex flex-col justify-center">
		<div class="flex flex-row group">
			{#if editName}
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					class="bg-transparent font-mono text-lg"
					value={data.sketch.name}
					on:input={(e) => (data.sketch.name = e.target.value)}
					on:blur={() => {
						editName = false;
						saveSketch();
					}}
					autofocus
				/>
			{:else}
				<p class=" font-mono text-lg">{data.sketch.name}</p>
				<button
					class="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-all duration-75"
					on:click={() => {
						editName = true;
					}}
				>
					<span class="material-symbols-outlined"> edit </span>
				</button>
			{/if}
		</div>
		<div class="flex flex-row">
			<p class="opacity-60 font-mono text-sm">Made by {data.sketch.maker}</p>
			<div class="divider divider-horizontal"></div>
			<p class="opacity-60 font-mono text-sm">Last edited {new Date(data.sketch.updated).toDateString()}</p>
		</div>
	</div>
	<div class="flex flex-row justify-end bg-base-200 p-2 w-full">
		<div class="relative px-3 h-6 w-6">
			{#if !showCanvas}
				<button
					class="flex -translate-x-3 absolute items-center tooltip" data-tip="Run program"
					on:click={startProgram}
					in:fly={{ delay: 300, y: 16, duration: 300, easing: quintOut }}
					out:fly={{ y: -16, duration: 300, easing: quintIn }}
					><span class="material-symbols-outlined"> play_arrow </span></button
				>
			{:else}
				<button
					class="flex -translate-x-3 absolute items-center tooltip" data-tip="Stop program"
					on:click={stopProgram}
					in:fly={{ delay: 300, y: 16, duration: 300, easing: quintOut }}
					out:fly={{ y: -16, duration: 300, easing: quintIn }}
					><span class="material-symbols-outlined"> pause </span></button
				>
			{/if}
		</div>
	
		<div class="relative px-3 ml-3 h-6 w-6">
			{#if isPublic}
				<button
					class="flex -translate-x-3 absolute items-center tooltip" data-tip="Make sketch private"
					on:click={changeVisibility}
					in:fly={{ delay: 300, y: 16, duration: 300, easing: quintOut }}
					out:fly={{ y: -16, duration: 300, easing: quintIn }}
					><span class="material-symbols-outlined"> public </span></button
				>
			{:else}
				<button
					class="flex -translate-x-3 absolute items-center tooltip" data-tip="Make sketch public"
					on:click={changeVisibility}
					in:fly={{ delay: 300, y: 16, duration: 300, easing: quintOut }}
					out:fly={{ y: -16, duration: 300, easing: quintIn }}
					><span class="material-symbols-outlined"> public_off </span></button
				>
			{/if}
		</div>
	
		<div class="relative px-3 ml-3 h-6 w-6">
			{#if !loading}
				<button
					class="flex -translate-x-3 absolute items-center tooltip" data-tip="Save sketch"
					on:click={saveSketch}
					in:fly={{ delay: 300, y: 16, duration: 300, easing: quintOut }}
					out:fly={{ y: -16, duration: 300, easing: quintIn }}
					><span class="material-symbols-outlined"> save </span></button
				>
			{:else if loading && !success}
				<div
					class="flex -translate-x-3 absolute items-center"
					in:fly={{ delay: 300, y: 16, duration: 300, easing: quintOut }}
					out:fly={{ y: -16, duration: 300, easing: quintIn }}
				>
					<span class="material-symbols-outlined animate-spin"> sync </span>
				</div>
			{:else}
				<div
					class="flex -translate-x-3 absolute items-center"
					in:fly={{ delay: 300, y: 16, duration: 300, easing: quintOut }}
					out:fly={{ y: -16, duration: 300, easing: quintIn }}
				>
					<span class="material-symbols-outlined text-green-700 animate-pulse"> cloud_done </span>
				</div>
			{/if}
		</div>
		<button class="flex px-3 items-center tooltip tooltip-left" data-tip="Open settings" on:click={toggleSettings}
			><span class="material-symbols-outlined"> settings </span></button
		>
	</div>
</div>

<div class="overflow-hidden w-full trans">
	{#if darkMode}
		<CodeMirror bind:value lang={java()} theme={oneDark} on:change={autoRunProgram} />
	{:else}
		<CodeMirror bind:value lang={java()} on:change={autoRunProgram} />
	{/if}
</div>

{#if showError}
	<div class="bg-red-500 p-2 rounded-lg m-2">
		<p>{errorMessage}</p>
	</div>
{/if}

<div class="p-2 overflow-hidden w-full">
	<canvas id="processing" class="rounded-lg" />
</div>

{#if settingsOpen}
	<div
		class="relative z-10"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
		in:fade={{ easing: quintOut, duration: 300 }}
		out:fade={{ easing: quintIn, duration: 200 }}
	>
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

		<div class="fixed inset-0 z-10 w-screen overflow-hidden">
			<div
				class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 overflow-hidden"
				in:fly={{ y: 16, duration: 300, easing: quintOut }}
				out:fly={{ y: -16, duration: 200, easing: quintIn }}
			>
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
				>
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
							>
								<span class="material-symbols-outlined text-blue-600"> settings </span>
							</div>
							<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left sm:w-full">
								<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
									Indstillinger
								</h3>
								<div class="mt-2">
									<div class="flex flex-row justify-between">
										<p class="text-sm font-semibold my-1">Automatisk kompilering</p>
										<input
											type="checkbox"
											name="autoRun"
											id="autoRun"
											checked={autoRun}
											on:change={() => (autoRun = !autoRun)}
										/>
									</div>
									<div class="flex flex-row justify-between">
										<p class="text-sm font-semibold my-1">Dark mode i editor</p>
										<input
											type="checkbox"
											name="darkMode"
											id="darkMode"
											checked={darkMode}
											on:change={() => (darkMode = !darkMode)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
							on:click={toggleSettings}>Ok</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}