<script>
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';
	export let data;
	$: message = $form.message;

	// Client API:
	const { form, errors, enhance } = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				//if the redirect url is set in the url e.g. "login?redirect=http%3A%2F%2Flocalhost%3A5173%2Fapp%2Fsketch%2Fnew" go to that url otherwise go to the home page
				const urlParams = new URLSearchParams(window.location.search);
				const redirect = urlParams.get('redirect');
				goto(redirect ? redirect : '/app/home');
				
			}
			message = form.message;
		}
	});
</script>

<h1 class="text-2xl font-bold p-2 bg-base-200 mb-3">Login</h1>

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
	{#if message}
		<p class="text-error">{message}</p>
	{/if}
	<button class="btn btn-info w-full rounded-none" type="submit">Login</button>
</form>

<p class="opacity-50">
	har du ikke en konto? <a class="btn btn-xs" href="/register">Lav en her!</a>
</p>
