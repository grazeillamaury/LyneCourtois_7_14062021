<script>
	const axios = require('axios')
	import { mapActions } from "vuex"
	export default {
		name: 'Navigation',
		data(){
			return{
				sex : "",
				role : "",
				id : "",
				img:""
			}
		},
		methods : {
			...mapActions(['userSignout']),
		},
		beforeMount(){
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
			this.id = userStorage.id

			//récupération des informations de l'utilisateur actif
			axios.get(`http://localhost:3000/api/param/${this.id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
                .then(param => {
                    this.img = param.data.image
                    this.sex = param.data.sex
                    this.role = param.data.roleId

                    this.$store.state.user.username = param.data.username
                    this.$store.state.user.image = param.data.image
                    this.$store.state.user.sex = param.data.sex
                    this.$store.state.user.role = param.data.roleId
                })
                .catch(error => {
                    alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
                });
		}
	}
</script>

<template>
	<div>
		<nav>
			<div>
				<!-- User Img -->
				<router-link :to="{name: 'User', params: { id: id }}" class="user_img">
                    <img v-if="img" :src="img" title="Tableau de bord">
                    <img v-else-if="sex === 'M'" src="../assets/user_male.svg" title="Tableau de bord">
                    <img v-else src="../assets/user_female.svg" title="Tableau de bord">
                </router-link>

                <!-- Log out -->
				<i class="fas fa-sign-out-alt" title="Déconnexion" @click="userSignout"></i>

				<!-- Params -->
                <router-link :to="{name: 'Parametre', params: { id: id }}"><i class="fas fa-tools" title="Paramètres"></i></router-link>
			</div>

			<!-- Activity -->
			<router-link to="/Activity"><i class="fas fa-globe" title="Activité"></i></router-link>

			<!-- All Users only for admin -->
			<router-link to="/User" v-if="role === 2"><i class="fas fa-users" title="Tous les utilisateurs"></i></router-link>
		</nav>
		<main>
			<!-- Header -->
			<div id="bande">
				<img src="../assets/icon-left-font.svg">
				<slot name="user_img"></slot>
			</div>
			<slot name="page"><p>Bonjour</p></slot>
		</main>
	</div>
</template>

<style scoped lang="scss">
/*navbar*/
nav{
	padding: 25px;
	display: flex;
	align-items: center;
	div{
		padding: 4px;
		padding-right: 20px;
		width: 40%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: rgba(253, 45, 1, 0.3);
		border-radius: 50px;
	}
	i{
		font-size: 1.5em;
		color: #ffd7d7;
		cursor: pointer;
		&:hover{
			color: #02070d;
		}
    }
}

.user_img{
	overflow: hidden;
	width: 40px;
	height: 40px;
	border-radius: 100px;
	border: 2px #d1515a solid;
	background-color: #ffd7d7;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px;
	img{
		width: 50px;
		height: auto;
	}
	&:hover{
		border: 2px #ffd7d7 solid;
	}
}

.fa-globe, .fa-users{
	color: #122542;
	font-size: 2.4em;
	margin-left: 20px;
	&:hover{
		color: #d1515a;
	}
}

/*header*/
#bande{
	background-color: #122542;
	display: flex;
	justify-content: center;
	margin-bottom: 40px;
	img{
		width: 85%;
	}
}
@media screen and (min-width:1024px){
	main{
		margin-left: 6.5%;
	}

	/*navbar*/
	nav{
		flex-direction: column;
		width: 5%;
		height: 100%;
		position: fixed;
		padding: 0.7%;
		border-right: 3px #122542 solid;
		div{
			flex-direction: column;
			width: 65%;
			padding: 7px;
			padding-bottom: 30px;
			.fas{
				margin-top: 20px;
			}
		}
    }

    .user_img{
		width: 60px;
		height: 60px;
		img{
			width: 70px;
		}
	}

    .fa-globe, .fa-users{
        font-size: 3em;
        margin: 0;
        margin-top: 20px;
    }

	/*banderelle*/
	#bande{
		margin-bottom: 5%;
		padding: 1%;
		img{
			width: 30%;
		}
	}
}

</style>