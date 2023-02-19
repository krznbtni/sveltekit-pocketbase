<script lang="ts">
	import { HomeDiscover } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full mt-4 space-y-6">
	<h1 class="text-xl font-bold">Recent Projects</h1>

	<HomeDiscover projects={data.projects} />
</div>
