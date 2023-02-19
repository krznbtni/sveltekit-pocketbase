<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '$app/forms';

	import { Icon, Pencil } from 'svelte-hero-icons';

	import { Input } from '$lib/components';
	import { getImageURL } from '$lib/utils';
	import type { LayoutData } from '../../../$types';
	import type { ActionData } from './$types';

	type OnChangeEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

	export let data: LayoutData;
	export let form: ActionData;

	let loading = false;

	function showPreview(event: OnChangeEvent) {
		const target = event.target;

		if (target instanceof HTMLInputElement) {
			const files = target?.files;

			if (files && files.length > 0) {
				const src = URL.createObjectURL(files[0]);
				const preview = document.getElementById('avatar-preview');

				if (preview instanceof HTMLImageElement && preview) {
					preview.src = src;
				}
			}
		}
	}

	const submitUpdateProfile = (() => {
		loading = true;

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
					break;
			}

			loading = false;
		};
	}) satisfies SubmitFunction;
</script>

<div class="flex flex-col w-full-h-full">
	<form
		method="POST"
		action="?/updateProfile"
		enctype="multipart/form-data"
		class="flex flex-col space-y-2 w-full"
		use:enhance={submitUpdateProfile}
	>
		<h3 class="text-2xl font-medium">Update Profile</h3>

		<div class="form-control w-full max-w-lg">
			<label for="avatar" class="label font-medium pb-1">
				<span class="label-text">Profile Picture</span></label
			>

			<label for="avatar" class="avatar w-32 rounded-full hover:cursor-pointer">
				<label for="avatar" class="absolute -bottom-0.5 -right-0.5 hover:cursor-pointer">
					<span class="btn btn-circle btn-sm btn-secondary">
						<Icon src={Pencil} class="w-4 h-4" />
					</span>
				</label>

				<div class="w-32 rounded-full">
					<img
						src={data?.user?.avatar
							? getImageURL(data?.user?.collectionId, data?.user?.id, data?.user?.avatar)
							: `https://ui-avatars.com/api/?name=${data?.user?.name}`}
						alt="user avatar"
						id="avatar-preview"
					/>
				</div>
			</label>

			<input
				accept="image/*"
				hidden
				id="avatar"
				name="avatar"
				type="file"
				value=""
				on:change={showPreview}
				disabled={loading}
			/>
			{#if form?.errors?.avatar}
				{#each form?.errors?.avatar as error}
					<label for="avatar" class="label py-0 pt-1">
						<span class="label-text-alt text-error">{error}</span>
					</label>
				{/each}
			{/if}
		</div>

		<Input
			id="name"
			label="Name"
			value={form?.data?.name ?? data?.user?.name}
			disabled={loading}
			errors={form?.errors?.name}
		/>
		<div class="w-full max-w-lg pt-3">
			<button class="btn btn-primary w-full max-w-lgh" disabled={loading}>Update Profile</button>
		</div>
	</form>
</div>
