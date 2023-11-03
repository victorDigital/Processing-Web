<script>
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';
	export let data;
	$: message = $form.message;

	// Client API:
	const { form, errors, enhance } = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				goto('/app/home');
			}
			message = form.message;
		}
	});
</script>

<h1 class="text-2xl font-bold p-2 bg-base-200 mb-3">Register</h1>

<form method="post" use:enhance on:submit|preventDefault={form.submit}>
	<div class="pt-2" />
	<label class="label-text" for="email">Email</label>
	<input
		type="text"
		name="email"
		id="email"
		placeholder="Email"
		class="input bg-base-200 rounded-none w-full"
		bind:value={$form.email}
	/>
	{#if $errors.email}
		<span class="text-error">{$errors.email}</span>
	{/if}
	<div class="pt-2" />
	<label class="label-text" for="password">Password</label>
	<input
		type="password"
		name="password"
		id="password"
		placeholder="Password"
		class="input bg-base-200 rounded-none w-full"
		bind:value={$form.password}
	/>
	{#if $errors.password}
		<span class="text-error">{$errors.password}</span>
	{/if}
	<div class="pt-2" />

	<label class="label-text" for="password2">Repeat Password</label>
	<input
		type="password"
		name="password2"
		id="password2"
		placeholder="Repeat Password"
		class="input bg-base-200 rounded-none w-full"
		bind:value={$form.password2}
	/>
	{#if $errors.password2}
		<span class="text-error">{$errors.password2}</span>
	{/if}
	<div class="pt-2" />
	{#if message}
		<p class="text-error">{message}</p>
	{/if}
	<button class="btn btn-info w-full rounded-none" type="submit">Tilmeld</button>
</form>

<p class="opacity-50">
	har du allerede en konto? <a class="btn btn-xs" href="/login">Log ind her</a>
</p>
