<script>
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapActions } from "vuex"

    export default {
        name: "Login",
        components: {
            SubmitButton,
        },
        computed : {
            username:{
                // getter
                get: function () {
                    return this.$store.state.username;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.username = newValue;
                }
            },
            passwordone:{
                // getter
                get: function () {
                    return this.$store.state.passwordone;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.passwordone = newValue;
                }
            },
            passwordtwo:{
                // getter
                get: function () {
                    return this.$store.state.passwordtwo;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.passwordtwo = newValue;
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
            }
        },
        methods : {
            user_is_a_man(){
                this.$store.commit("USER_MAN")
            },
            user_is_a_woman(){
                this.$store.commit("USER_WOMAN")
            },
            ...mapActions(['userPostSignup']),
        },
        mounted(){
            document.title = 'Inscription'
        }
    }
</script>

<template>
    <main>
        <h1>S'INSCRIRE</h1>
        <form>
            <label for="username">Nom d'utilisateur*</label>
            <input type="text" id="username" name="username" placeholder="Tapez votre nom d'utilisateur" autofocus required v-model="username">

            <label for="email-sign-up">Email*</label>
            <input type="email" id="email-sign-up" name="email" placeholder="Taper votre adresse Email" required v-model="email">

            <label for="password-one">Mot de passe*</label>
            <input type="password" id="password-one" placeholder="Tapez votre mot de passe" name="password_one" required v-model="passwordone">

            <label for="password-two">Confirmation du mot de passe*</label>
            <input type="password" id="password-two" name="password_two" placeholder="Confirmer le mot de passe" required v-model="passwordtwo">

            <label for="genre">Genre*</label><br/>
            <div class="genre">
                <input type="radio" name="genre" value="homme" id="genre" required @click="user_is_a_man"/> <label for="homme" class="genre-label">Homme</label> 
                <input type="radio" name="genre" value="femme" id="genre" required @click="user_is_a_woman"/> <label for="femme" class="genre-label">Femme</label>
            </div>

            <SubmitButton @click="userPostSignup" value="S'inscrire"/>
        </form>
    </main>
</template>

<style scoped lang="scss">
main{
    margin: 30px;
}

h1{
    color:#ffffff;
    margin-top: 60px;
    margin-bottom: 70px;
}

#genre{
    width: 10%;
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
    &:invalid {
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
    
    #genre{
        width: 5%;
        margin: 50px;
    }

}

</style>