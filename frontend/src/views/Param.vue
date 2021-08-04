<script>
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapActions } from "vuex"
    export default {
        name: "Login",
        data(){
            return{
                param : "",
                user_pointer_id :"",
                user_id : ""
            }
        },
        components: {
            SubmitButton
        },
        computed : {
            username:{
                // getter
                get: function () {
                    return this.$store.state.param.username;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.username = newValue;
                }
            },
            email:{
                // getter
                get: function () {
                    return this.$store.state.param.email;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.email = newValue;
                }
            },
            oldpassword:{
                // getter
                get: function () {
                    return this.$store.state.param.oldpassword;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.oldpassword = newValue;
                }
            },
            newpasswordone:{
                // getter
                get: function () {
                    return this.$store.state.param.newpasswordone;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.newpasswordone = newValue;
                }
            },
            newpasswordtwo:{
                // getter
                get: function () {
                    return this.$store.state.param.newpasswordtwo;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.param.newpasswordtwo = newValue;
                }
            }
        },
        methods : {
            ...mapActions(['putParamEdit', 'putPassWordEdit', 'deleteUserDelete']),
            addImage(event) {
                this.$store.state.param.imageUser = event.target.files[0]
            }
        },
        beforeCreate(){
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
        },
        beforeMount(){
            const axios = require('axios')

            let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            this.user_id = userStorage.id
            this.user_pointer_id = this.$route.params.id

            axios.get(`http://localhost:3000/api/param/${this.user_pointer_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
            .then(param => {
                this.param = param.data

                this.$store.state.param.username = this.param.username
                this.$store.state.param.email = this.param.email

                this.$store.state.user_id_delete = this.param.id
            })
            .catch(error => {
                console.log(error);
                alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
            });
        },
        mounted(){
            document.title = 'Activité'
        }
    }
</script>

<template>
    <div class="container">
        <aside class="param-profil">
            <img v-if="param.image" :src="param.image" title="Tableau de bord" class="profil">
            <img v-else-if="param.sex === 'M'" src="../assets/user_male.svg" title="Tableau de bord" class="profil">
            <img v-else src="../assets/user_female.svg" title="Tableau de bord" class="profil">
            <p>{{param.username}}</p>
        </aside>
        <section>
            <form v-if="user_id === user_pointer_id">
                <h1>MON COMPTE</h1>
                <aside>
                    <div>
                        <label for="text">Nom d'utilisateur</label>
                        <br>
                        <input type="text" name="nom_d'utilisateur" id="nom_d'utilisateur" placeholder="Nom d'utilisateur" required v-model="username">
                    </div>

                    <div>
                        <label for="email-sign-in">Email</label>
                        <br>
                        <input type="email" name="email" id="email-sign-in" placeholder="Adresse Email" required v-model="email">
                    </div>

                </aside>

                <input @change="addImage" type="file" id="myfile" name="myfile" accept= "image/*">

                <SubmitButton class="btn" @click="putParamEdit" value="Enregistrer"/>
            </form>

            <br>
            <form v-if="user_id === user_pointer_id">
                <h1>MOT DE PASSE</h1>
                    <div>
                        <label for="oldpasseword">Ancien mot-de-passe</label>
                        <br>
                        <input type="password" id="oldpassword" name="oldpasseword" placeholder="Ancien mot de passe" required v-model="oldpassword">
                    </div>

                    <aside>
                        <div>
                            <label for="newpassewordone">Nouveau mot-de-passe</label>
                            <br>
                            <input type="password" id="newpasswordone" name="newpasswordone" placeholder="Nouveau mot de passe" required v-model="newpasswordone">
                        </div>
                        
                        <div>
                            <label for="newpassewordtwo">Confirmation du mot-de-passe</label>
                            <br>
                            <input type="password" id="newpasswordtwo" name="newpasswordtwo" placeholder="Confirmer le mot de passe" required v-model="newpasswordtwo">
                        </div>
                    </aside>

                <SubmitButton class="btn" @click="putPassWordEdit" value="Enregistrer"/>
            </form>

            <SubmitButton class="btn" @click="deleteUserDelete" value="Supprimer le compte"/>
        </section>
    </div>
</template>

<style scoped lang="scss">
.container{
    display: flex;
    justify-content: space-around;
}

p{
    font-size: 2em;
    color: #fd2d01;
    margin: 10px;
}

h1{
    color: #ffffff;
    display: flex;
    justify-content: center;
    font-size: 2em;
    margin: 1em;
}

h3{
   color:#122542;
   font-size:20px;
}

main{
    margin: 1em;
}


section{
}

header{
    background-color: #122542;
}

body{
    font-family: arial;
    background-color:#02070d;
    font-size: 15px;

}

form{
    background-color: rgba(18, 37, 66, 0.6);
    padding: 30px;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    margin-bottom: 50px;
    padding-left: 10px;
    width: 100%;
    height: 75px;
    font-size: 23px;
}

.profil{
    width: 100px;
    height: 100px;
    background-color: #ffd7d7;
    padding: 2px;
    border-radius: 100px;
    border: 2px #d1515a solid;
}

.btn {
    margin: auto;
    width: 300px;
    height: 80px;
    font-size: 28px;
    font-family: arial;
    color: #ffffff;
    background-color: #fd2d01;
    border-radius: 37px;
    border:none;
}

.param-profil{
    background-color: rgba(18, 37, 66, 0.6);
    padding: 30px;
    border-radius: 30px;  
    margin-bottom: 1em;
    display: flex;
    align-items: center;
}

/*navbar*/

nav{
    padding: 4%;
    display: flex;
    align-items: center;
}

.param-user{
    padding: 4px;
    padding-right: 20px;
    width: 40%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(253, 45, 1, 0.3);
    border-radius: 50px;
}

.param-user .fas{
    font-size: 1.5em;
    color: #ffd7d7;
}

.param-user .fas:hover{
    color: #02070d;
}

.param-user .profil{
    width: 40px;
    height: 40px;
    background-color: #ffd7d7;
    padding: 2px;
    border-radius: 100px;
    border: 2px #d1515a solid;
}

.param-user .profil:hover{
    border: 2px #ffd7d7 solid;

}

@media screen and (min-width:1024px){
    main{
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .profil{
        width: 140px;
        height: 140px; 
    }

    .param-profil{
        width: 60%;
        background-color: #02070d;
        height: 20em;
        flex-direction: column;
        margin-top: 2%;
    }

    section{
        padding: 70px;
        width: 100%;
    }

    aside{
        display: flex;
        justify-content: space-between;
    }

    input{
        width: 100%;
    }

     /*navbar*/

    nav{
        flex-direction: column;
        align-items: flex-start;
        vertical-align: center;
        width: 3%;
        height: 875px;
        position: fixed;
        padding: 0.7%;
        border-right: 3px #122542 solid;
        background-color: #02070d;
    }

    .param-user{
        flex-direction: column;
        width: auto;
        padding: 4px;
        padding-bottom: 30px;
    }

    .param-user .fas{
        padding-top: 20px;
    }
}
</style>