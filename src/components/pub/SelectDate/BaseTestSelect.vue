<template>
	<v-touch class="" @tap="close($event)">
    测试test {{hello}}--{{ type }}
	</v-touch>
</template>
<script>
	export default{
		data(){
			return{
			  hello: new Date,
        type: ''
      };
		},
		methods:{
      close(e){
        console.log('e:::::' + e);
        this.$emit('self-close');
        e.preventDefault();
      }
    },
    mounted(){
    }
	};
</script>
<style lang="scss">
</style>
