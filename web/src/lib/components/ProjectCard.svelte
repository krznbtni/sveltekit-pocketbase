<script lang="ts">
	import type { Project } from '$lib/types';
	import { getImageURL } from '$lib/utils';

	export let project: Project;
</script>

<div class="card card-compact bg-base-100 shadow-lg">
	<figure class="h-48">
		<img
			class="object-cover object-center w-full h-full"
			src={project.thumbnail
				? getImageURL(project.collectionId, project.id, project.thumbnail, '80x80')
				: `https://via.placeholder.com/500/4506CB/FFFFFF/?text=${project.name}`}
			alt="project thumbnail"
		/>
	</figure>

	<div class="card-body gap-0">
		<a href="/projects/{project.id}" class="card-title">
			{project.name}
		</a>

		<p>{project.tagline}</p>

		<div class="card-actions justify-end space-x-2">
			<a href="/projects/{project.id}" class="btn btn-primary">View Project</a>
		</div>
	</div>
</div>
