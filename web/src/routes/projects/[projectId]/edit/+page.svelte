<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { getImageURL } from '$lib/utils';
	import { Icon, Trash } from 'svelte-hero-icons';
	import { Input, TextArea } from '$lib/components';
	import { invalidateAll } from '$app/navigation';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;

	const submitUpdateProject = (() => {
		loading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await update();
			}

			loading = false;
		};
	}) satisfies SubmitFunction;
</script>

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full">
		<form
			action="?/updateProject"
			method="POST"
			enctype="multipart/form-data"
			class="flex flex-col space-y-2 w-full item-center"
			use:enhance={submitUpdateProject}
		>
			<h3 class="text-3xl font-bold">Edit {data.project?.name}</h3>
			<Input
				id="name"
				label="Project Name"
				value={form?.data?.name ?? data.project?.name}
				errors={form?.errors?.name}
			/>
			<Input
				id="tagline"
				label="Project tagline"
				value={form?.data?.tagline ?? data.project?.tagline}
				errors={form?.errors?.tagline}
			/>
			<Input
				id="url"
				label="Project URL"
				value={form?.data?.url ?? data.project?.url}
				errors={form?.errors?.url}
			/>
			<TextArea
				id="description"
				label="Project description"
				value={form?.data?.description ?? data?.project?.description}
				errors={form?.errors?.description}
			/>

			<div class="form-control w-full max-w-lg">
				<label for="thumbnail" class="label font-medium pb-1">
					<span class="label-text">Thumbnail</span>
				</label>

				{#if data.project?.thumbnail}
					<label for="thumbnail" class="avatar w-20 hover:cursor">
						<label for="thumbnail" class="absolute -top-1.5 -right-1.5 hover:cursor-pointer">
							<button formaction="?/deleteThumbnail" class="btn btn-error btn-sm btn-circle">
								<Icon src={Trash} class="w-5 h-5 text-white" />
							</button>
						</label>

						<div class="w-20 rounded">
							<img
								src={getImageURL(
									data.project.collectionId,
									data.project.id,
									data.project.thumbnail,
									'80x80',
								)}
								alt="project thumbnail"
							/>
						</div>
					</label>
				{/if}

				<input
					type="file"
					name="thumbnail"
					id="thumbnail"
					class="file-input file-input-bordered w-full max-w-lg mt-2"
				/>

				{#if form?.errors?.thumbnail}
					{#each form?.errors?.thumbnail as error}
						<label for="thumbnail" class="label py-0 pt-1">
							<span class="label-text-alt text-error">{error}</span>
						</label>
					{/each}
				{/if}
			</div>

			<div class="w-full max-w-lg pt-3">
				<button type="submit" class="btn btn-primary w-full max-w-lg">Save Changes</button>
			</div>
		</form>
	</div>
</div>
