<script>
    import SubmitButton from "../components/SubmitButton.vue"

    export default {
        name: "Login",
        components: {
            SubmitButton,
        }
    }
</script>

<template>
    <main>
        <h1>S'INSCRIRE</h1>
        <form>
            <label for="username">Nom d'utilisateur*</label>
            <input type="text" id="username" name="username" placeholder="Tapez votre nom d'utilisateur" autofocus required>

            <label for="email-sign-up">Email*</label>
            <input type="email" id="email-sign-up" name="email" placeholder="Taper votre adresse Email" required>

            <label for="password-one">Mot de passe*</label>
            <input type="password" id="password-one" placeholder="Tapez votre mot de passe" name="password_one" required>

            <label for="password-two">Confirmation du mot de passe*</label>
            <input type="password" id="password-two" name="password_two" placeholder="Confirmer le mot de passe" required>

            <label for="genre">Genre*</label><br/>
            <div class="genre">
                <input type="radio" name="genre" value="homme" id="genre" required/> <label for="homme" class="genre-label">Homme</label> 
                <input type="radio" name="genre" value="femme" id="genre" required/> <label for="femme" class="genre-label">Femme</label>
            </div>

            <SubmitButton value="S'inscrire"/>
        </form>
    </main>
</template>

<style scoped lang="scss">
main{
    margin: 30px;
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