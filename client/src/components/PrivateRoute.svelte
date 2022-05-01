<script>
	import { Route } from "svelte-navigator";
	import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

	export let path;
</script>

<Route {path} primary={false} let:params let:location let:navigate>
	<PrivateRouteGuard>
		<slot {params} {location} {navigate} />
	</PrivateRouteGuard>
</Route>