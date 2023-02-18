<script lang="ts">
	import { enhance, applyAction, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionData } from './$types';
	import type { PageData } from '../../../$types';

	import { Input, Modal } from '$lib/components';

	export let form: ActionData;
	export let data: PageData;

	let emailModalOpen: boolean;
	$: emailModalOpen = false;

	let usernameModalOpen: boolean;
	$: usernameModalOpen = false;

	let loading: boolean;
	$: loading = false;

	const submitUpdateEmail = (() => {
		loading = true;
		emailModalOpen = true;

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					emailModalOpen = false;
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

	const submitUpdateUsername = (() => {
		loading = true;
		usernameModalOpen = true;

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					usernameModalOpen = false;
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

<div class="flex flex-col w-full h-full space-y-12">
	<div class="w-full">
		<h3 class="text-2xl font-medium">Change Email</h3>

		<div class="divider" />

		<Modal label="change-email" checked={emailModalOpen}>
			<span slot="trigger" class="btn btn-primary">Change Email</span>
			<h3 slot="heading">Change Your Email</h3>

			<form action="?/updateEmail" method="POST" use:enhance={submitUpdateEmail} class="space-y-2">
				<Input
					id="email"
					type="email"
					label="Enter your new email address"
					required={true}
					value={form?.data?.email}
					disabled={loading}
				/>

				<button type="submit" class="btn btn-primary w-full" disabled={loading}
					>Change my email</button
				>
			</form>
		</Modal>
	</div>

	<div class="w-full">
		<h3 class="text-2xl font-medium">Change Username</h3>
		<div class="divider mb-0.5" />
		<Input id="username" label="Username" value={data?.user?.username} disabled />

		<Modal label="change-username" checked={usernameModalOpen}>
			<span slot="trigger" class="btn btn-primary">Change Username</span>
			<h3 slot="heading">Change Your Username</h3>

			<form
				action="?/updateUsername"
				method="POST"
				use:enhance={submitUpdateUsername}
				class="space-y-2"
			>
				<Input
					id="username"
					type="text"
					label="Enter your new username"
					required={true}
					value={form?.data?.username}
					disabled={loading}
				/>

				<button type="submit" class="btn btn-primary w-full" disabled={loading}
					>Change my username</button
				>
			</form>
		</Modal>
	</div>
</div>
