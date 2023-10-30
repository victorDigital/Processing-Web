<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { firebaseAuth } from "../lib/firebase.js";
    import { authStore, authHandlers } from "../stores/authStore.js";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";


    onMount(()=>{
        const unsubscribe = firebaseAuth.onAuthStateChanged((user)=>{
            console.log(user)
            authStore.update((curr)=>{
                return {
                    ...curr,
                    isLoading: false,
                    currentUser: user
                };
            })
        })
    })

    const handleLogout = async () => {
        authHandlers.logout()
        .then(()=>{
            $authStore = undefined;
            goto('/login');
        }).catch((error)=>{
            console.log(error)
        })
    }
                    
</script>

<header class="space-y-4">
    <a href="/" class="font-bold hover:underline">Home</a>
   
    <nav class="flex gap-4">
      {#if $authStore}
        <a
          href="/app/home"
          class="hover:underline"
          class:active={$page.url.pathname === '/app/home'}>Protected</a
        >
        <button class="hover:underline" on:click={handleLogout}>Logout</button>
      {:else}
        <a href="/register" class="hover:underline" class:active={$page.url.pathname === '/register'}
          >Register</a
        >
        <a href="/login" class="hover:underline" class:active={$page.url.pathname === '/login'}
          >Login</a
        >
      {/if}
    </nav>
  </header>

<div class="container mx-auto">
    <slot />
</div>