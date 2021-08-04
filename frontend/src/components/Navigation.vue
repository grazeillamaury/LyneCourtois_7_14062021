<script>
	import { mapActions } from "vuex"
	export default {
		name: 'Navigation',
		data(){
			return{
				sex : "",
				user_id : "",
				user:""
			}
		},
		methods : {
			...mapActions(['userSignout']),
		},
		beforeMount(){
			const axios = require('axios')
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
			this.sex = userStorage.sex
			this.user_id = userStorage.id

			axios.get(`http://localhost:3000/api/param/${this.user_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
                .then(param => {
                    console.log
                    this.user = param.data

                })
                .catch(error => {
                    console.log(error);
                    alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
                });
		}
	}
</script>

<template>
	<div>
		<nav>
			<div>
				<router-link :to="{name: 'User', params: { id: user_id }}">
                    <img v-if="user.image" :src="user.image" title="Tableau de bord" class="user_img">
                    <img v-else-if="user.sex === 'M'" src="../assets/user_male.svg" title="Tableau de bord" class="user_img">
                    <img v-else src="../assets/user_female.svg" title="Tableau de bord" class="user_img">
                </router-link>
				<i class="fas fa-sign-out-alt" title="Déconnexion" @click="userSignout"></i>

                <router-link :to="{name: 'Parametre', params: { id: user_id }}"><i class="fas fa-tools" title="Paramètres"></i></router-link>
			</div>
			<router-link to="/Activity"><i class="fas fa-globe" title="Activité"></i></router-link>
		</nav>
		<main>
			<div id="bande">
				<img src="../assets/icon-left-font.svg">
			</div>
			<slot><p>Bonjour</p></slot>
		</main>
	</div>
</template>

<style scoped lang="scss">
h2{
    color: #fd2d01;
    font-size: 1.5em;
    font-weight: 100;
}

/*banderelle*/
#bande{
	background-color: #122542;
	display: flex;
	justify-content: center;
	margin-bottom: 40px;
	img{
		width: 450px;
	}
}

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
		img{
			width: 40px;
			height: auto;
			background-color: #ffd7d7;
			padding: 2px;
			border-radius: 100px;
			border: 2px #d1515a solid;
			cursor: pointer;
			&:hover{
				border: 2px #ffd7d7 solid;
			}
		}
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

.fa-globe{
    color: #122542;
    font-size: 2.4em;
    padding-left: 20px;
}

.fa-globe:hover{
    color: #d1515a;
}
@media screen and (min-width:1024px){
	main{
		margin-left: 6.5%;
	}

	/*banderelle*/
	#bande{
		margin-bottom: 5%;
		img{
			padding: 1%;
			width: 30%;
		}
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
			img{
				width: 90%;
			}
			.fas{
				padding-top: 20px;
			}
		}
    }

    .fa-globe{
        font-size: 3em;
        padding: 7px;
        padding-top: 20px;
    }
}

</style>