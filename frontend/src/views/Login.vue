<script>
    const axios = require('axios')
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapState, mapActions } from "vuex"

    export default {
        name: "Login",
        components: {
            SubmitButton

        },
        computed : {
            password:{
                // getter
                get: function () {
                    return this.$store.state.passwordone;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.passwordone = newValue;
                }
            },
            email:{
                // getter
                get: function () {
                    return this.$store.state.email;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.email = newValue;
                }
            },
            ...mapState({
                emailRg:'emailRg',
            })
        },
        methods : {
            ...mapActions(['userPostLogin']),
        },
        beforeCreate(){
            const userStorage = JSON.parse(sessionStorage.getItem('user'))
            let emailRg = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/

            if (userStorage != null) {
                let email_valid = emailRg.test(userStorage.email)

                if (email_valid) {
                    axios.post('http://localhost:3000/api/auth/login', {
                        password: userStorage.password,
                        email: userStorage.email,
                    })
                    .then(response => {
                        sessionStorage.removeItem('user');

                        let user = {
                            id : response.data.userId,
                            token : response.data.token
                        }

                        let userItems = JSON.stringify(user)
                        sessionStorage.setItem('userToken', userItems)
                        window.location.href = 'http://localhost:8080/#/'
                    })
                    .catch(error => {
                        alert(`Le mot de passe ou l'utilisateur n'est pas valide. ${error}`)
                    });
                }
                else {
                    alert("Le formulaire n'est pas valide. Vérifer que l'adresse mail est valide")
                }
            }
        }
    }
</script>

<template>
	<main>
		<h1>SE CONNECTER</h1>
		<form>
			<label for="email-sign-in">Email</label>
			<br>
			<input type="email" name="email" id="email-sign-in" placeholder="Tapez votre adresse Email" autofocus required v-model="email">

			<br>

			<label for="password">Mot-de-passe</label>
			<br>
			<input type="password" id="password" name="passeword" placeholder="Tapez votre mot de passe" required v-model="password">

			<br>

            <SubmitButton @click="userPostLogin" value="Se connecter"/>
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