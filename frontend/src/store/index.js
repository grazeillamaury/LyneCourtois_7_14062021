const axios = require('axios')
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		webSiteName :'Groupomania',
		username : "",
		passwordone : "",
		passwordtwo : "",
		sex : "",
		email : "",
		lettersRg : /^[-'a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/,
		emailRg : /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
	},
	getters:{
		copyright: (state) => {
			const currentYear = new Date().getFullYear()

			return `© ${state.webSiteName} ${currentYear}`
		}
	},
	mutations: {
		USER_MAN (state){
			state.sex = "M"
		},
		USER_WOMAN (state){
			state.sex = "F"
		}
	},
	actions: {
		userPostSignup(context){
			let lettersRg = context.state.lettersRg
			let emailRg = context.state.emailRg

			let username_valid = lettersRg.test(context.state.username)
			let email_valid = emailRg.test(context.state.email)

			if (context.state.passwordone === context.state.passwordtwo) {
				let password_valid = true
				let password = context.state.passwordone

				if (username_valid && email_valid && password_valid) {
					axios.post('http://localhost:3000/api/auth/signup', {
						username: context.state.username,
						password: password,
						email: context.state.email,
						sex : context.state.sex
					})
					.then(response => {
						console.log(response);
						sessionStorage.removeItem('user');

						let user = {
							email : context.state.email,
							password : password
						}

						let userItems = JSON.stringify(user)
						sessionStorage.setItem('user', userItems)
						window.location.href = 'http://localhost:8080/#/Login';
					})
					.catch(error => {
						console.log(error);
						alert(`Quelque chose c'est mal passé. Essayez à nouveau et vérifiez que la sécurité du mot de passe ne soit pas faible. ${error}`)
					});
				}
				else {
					alert("Le formulaire n'est pas valide. Les nombres sont interdis pour le username. Vérifer que l'adresse mail est valide")
				}
			}
			else {
				alert("Les mots de passe ne sont pas identiques")
			}
		},
		userPostLogin(context){
			let emailRg = context.state.emailRg
			let password = context.state.passwordone

			let email_valid = emailRg.test(context.state.email)

			if (email_valid) {
                axios.post('http://localhost:3000/api/auth/login', {
                    password: password,
                    email: context.state.email,
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
	},
	modules: {
	}
})
