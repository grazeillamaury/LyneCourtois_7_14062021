<template>
	<footer>
		<h3>{{copyright}}</h3>
	</footer>
</template>

<script>
	import {mapGetters} from 'vuex'

	export default {
		name: 'Footer',
		computed:{
			...mapGetters(['copyright'])
		}
	}
</script>

<style scoped lang="scss">

</style>
