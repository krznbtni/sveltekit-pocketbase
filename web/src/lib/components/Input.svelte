<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let id = '';
	export let label = '';
	export let type = 'text';
	export let disabled = false;
	export let required = false;
</script>

<div class="form-control w-full max-w-lg mb-2">
	<label for={id} class="label font-medium pb-1">
		<span class="label-text">{label}</span>
	</label>

	<input
		{disabled}
		{id}
		{placeholder}
		{required}
		{type}
		{value}
		class="input input-bordered w-full-max-w-lg"
		name={id}
	/>
</div>
