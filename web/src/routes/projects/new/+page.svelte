<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, TextArea } from '$lib/components';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex justify-center w-full h-full p-2">
	<form
		action="?/create"
		method="POST"
		class="flex flex-col space-y-2 w-full items-center"
		enctype="multipart/form-data"
		use:enhance
	>
		<h3 class="text-3xl font-bold">Tell us more about this project</h3>
		<p class="mt-2 text-lg">We'll need the name, tagline, link, and description</p>

		<Input id="name" label="Project name" value={form?.data?.name} errors={form?.errors?.name} />
		<Input
			id="tagline"
			label="Project tagline"
			value={form?.data?.tagline}
			errors={form?.errors?.tagline}
		/>
		<Input id="url" label="Project URL" value={form?.data?.url} errors={form?.errors?.url} />
		<TextArea
			id="description"
			label="Project description"
			value={form?.data?.description}
			errors={form?.errors?.description}
		/>

		<Input id="thumbnail" label="Thumbnail" type="file" errors={form?.errors?.thumbnail} />
		<div class="w-full max-w-lg pt-3">
			<button type="submit" class="btn btn-primary w-full max-w-lg">Create Project</button>
		</div>
	</form>
</div>
