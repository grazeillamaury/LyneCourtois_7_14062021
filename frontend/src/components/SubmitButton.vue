<script>
export default {
  name: 'SubmitButton'
}
</script>

<template>
	<input class="btn" v-on="$listeners" type="button" value="">
</template>

<style scoped lang="scss">
.btn {
    margin: 10px auto 80px;
    padding: 3px;
    width: 300px;
    height: 80px;
    font-size: 28px;
    color: #ffffff;
	background-color: #122542;
    border-radius: 37px;
    border: none;
    &:hover{
        background-color : #1f447c;
    }
}

@media screen and (min-width:1024px){
    .btn {
        margin: 100px auto 80px;
        width: 250px;
        font-size: 25px;
    }
}

</style>