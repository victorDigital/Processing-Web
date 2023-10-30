<script>
	let email;
	let password;

	import { firebaseAuth } from '../../lib/firebase.js';
	import { authStore, authHandlers } from '../../stores/authStore.js';
	import { goto } from '$app/navigation';

	let success = undefined;

	const register = async () => {
		authHandlers
			.signup(email, password)
			.then(() => {
				success = true;
                authStore.update((curr)=>{
                    return {
                        ...curr,
                        uid: firebaseAuth.currentUser.uid,
                        isLoading: false,
                        currentUser: firebaseAuth.currentUser
                    }
                })
				goto('/app/home');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);

				success = false;
			});
	};
</script>

<form
	class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
	on:submit|preventDefault={register}
>
	{#if !success && success !== undefined}
		<div class="p-8 text-red-500 bg-red-100">There was an error registering. Please try again.</div>
	{/if}
	<input
		type="email"
		placeholder="Email"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={email}
	/>
	<input
		type="password"
		placeholder="Password"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={password}
	/>

	<button type="submit" class="default-action">Register</button>
</form>
