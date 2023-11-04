<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
	let dropdownFocused = false;
</script>

<div class="relative">
	<nav
		class="view-none w-full h-20 p-4 bg-primary flex items-center justify-between z-50"
		data-sveltekit-preload-data="off"
	>
		<a href="/app/home" class="font-space font-black text-4xl select-none text-white">
			ProcessingWeb
		</a>
		<div class="flex flex-row">
			<a href="/app/explore" class="m-1 btn btn-sm btn-ghost text-white normal-case no-animation"
				>Explore</a
			>
			<div class="dropdown dropdown-end">
				<label tabindex="0" class="m-1 btn btn-sm btn-ghost text-white normal-case no-animation"
					>{data.user.displayName}
					<span class="material-symbols-outlined">arrow_drop_down</span></label
				>
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li><a href="/app/user/sketches">My Sketches</a></li>
					<li><a href="/app/sketch/new">New Sketch</a></li>
					<div class="divider my-1" />
					<li><a href="/logout">Logout</a></li>
				</ul>
			</div>
		</div>
	</nav>

	<div class="z-0">
		<slot />
	</div>
</div>

<style>
	.view-none {
		view-transition-name: test;
	}
</style>
