<script>
    import SubmitButton from "../components/SubmitButton.vue"

    export default {
        name: "Login",
        components: {
            SubmitButton
        }
    }
</script>

<template>
	<main>
		<h1>SE CONNECTER</h1>
		<form>
			<label for="email-sign-in">Email</label>
			<br>
			<input type="email" name="email" id="email-sign-in" placeholder="Tapez votre adresse Email" autofocus required>

			<br>

			<label for="password">Mot-de-passe</label>
			<br>
			<input type="password" id="password" name="passeword" placeholder="Tapez votre mot de passe" required>

			<br>

            <SubmitButton value="Se connecter"/>
		</form>
	</main>
</template>

<style scoped lang="scss">
main{
    margin: 30px;
}

label{
    color: #d1515a;
    font-size: 25px;
}

input{
    color: black;
    border: 3px #fd2d01 solid;
    border-radius: 20px;
    margin-top: 10px;
    margin-bottom: 80px;
    padding: 3px;
    width: 97%;
    height: 75px;
    font-size: 25px;
    &:invalid{
        background-color:red;
    }
}

@media screen and (min-width:1024px){

    main{
            margin: 0 28%;
    }

    input{
        margin-top: 20px;
        margin-bottom: 90px;
        width: 100%;
        height: 55px;
    }

}

</style>