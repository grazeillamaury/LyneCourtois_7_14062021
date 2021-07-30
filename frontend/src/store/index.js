const axios = require('axios')
const moment = require('moment');
moment().format();
moment.locale('fr');

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		webSiteName :'Groupomania',
		login_signup:{
			username : "",
			passwordone : "",
			passwordtwo : "",
			sex : "",
			email : ""
		},
		imagePost : "",
		postId : "",
		commentId : "",
		postText : "",
		commentText : "",
		lettersRg : /^[-'a-zA-ZÀ-ÖØ-öø-ÿœ\s]+$/,
		postsRg : /^[-'a-zA-Z0-9À-ÖØ-öø-ÿœ\s#!^$()?+*.:,|]+$/,
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
			state.login_signup.sex = "M"
		},
		USER_WOMAN (state){
			state.login_signup.sex = "F"
		},
	},
	actions: {
		userPostSignup(context){
			let lettersRg = context.state.lettersRg
			let emailRg = context.state.emailRg

			let username_valid = lettersRg.test(context.state.login_signup.username)
			let email_valid = emailRg.test(context.state.login_signup.email)

			if (context.state.login_signup.passwordone === context.state.login_signup.passwordtwo) {
				let password_valid = true
				let password = context.state.login_signup.passwordone

				if (username_valid && email_valid && password_valid) {
					axios.post('http://localhost:3000/api/auth/signup', {
						username: context.state.login_signup.username,
						password: password,
						email: context.state.login_signup.email,
						sex : context.state.login_signup.sex
					})
					.then(response => {
						console.log(response);
						sessionStorage.removeItem('user');

						let user = {
							email : context.state.login_signup.email,
							password : password
						}

						let userItems = JSON.stringify(user)
						sessionStorage.setItem('user', userItems)
						window.location.href = 'http://localhost:8080/Login';
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
			let password = context.state.login_signup.passwordone

			let email_valid = emailRg.test(context.state.login_signup.email)

			if (email_valid) {
                axios.post('http://localhost:3000/api/auth/login', {
                    password: password,
                    email: context.state.login_signup.email,
                })
                .then(response => {
                    sessionStorage.removeItem('user');

                    let user = {
                        id : response.data.userId,
                        roleId : response.data.roleId,
                        sex: response.data.sex,
                        token : response.data.token
                    }

                    let userItems = JSON.stringify(user)
                    sessionStorage.setItem('userToken', userItems)
                    window.location.href = 'http://localhost:8080/Activity'
                })
                .catch(error => {
                    alert(`Le mot de passe ou l'utilisateur n'est pas valide. ${error}`)
                });
            }
            else {
                alert("Le formulaire n'est pas valide. Vérifer que l'adresse mail est valide")
            }
		},
		userSignout(){
			sessionStorage.removeItem('userToken');
			window.location.href = 'http://localhost:8080/'
		},


		postPostCreate(context){
			let rg = context.state.postsRg
			let image = context.state.imagePost
			let content = context.state.postText
			let content_valid = rg.test(content)

			if (content_valid) {
				let formData = new FormData()
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

				let post = {
					text : content,
					userid : userStorage.id
				}

				formData.append('content', JSON.stringify(post));
				if (image) {
					formData.append('image', image);
				}

				axios.post('http://localhost:3000/api/post', formData, {
					headers:{
						'Content-Type': 'multipart/form-data',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(response => {
					console.log(response);
					window.location.reload();
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}else {
				alert("Le contenu du post n'est pas valide ou est inexistant")
			}
		},
		putPostEdit(context){
			let rg = context.state.postsRg
			let post_id = context.state.postId
			let image = context.state.imagePost
			let content = context.state.postText
			let content_valid = rg.test(content)

			let formData = new FormData()
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

			if (image) {
				formData.append('image', image);
			}

			if(content){
				let post = {
					text : content
				}
				formData.append('content', JSON.stringify(post));
				if (content_valid) {
					axios.put(`http://localhost:3000/api/post/${post_id}`, formData, {
						headers:{
							'Content-Type': 'multipart/form-data',
							'Authorization' : `Token ${userStorage.token}`
						}
					})
					.then(response => {
						console.log(response);
						window.location.reload();
					})
					.catch(error => {
						console.log(`Quelque chose c'est mal passé.${error}`)
					})
				}else {
					alert("Le contenu du post n'est pas valide")
				}
			}else{
				axios.put(`http://localhost:3000/api/post/${post_id}`, formData, {
					headers:{
						'Content-Type': 'multipart/form-data',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(response => {
					console.log(response);
					window.location.reload();
				})
				.catch(error => {
					console.log(`Quelque chose c'est mal passé.${error}`)
				})
			}
		},
		deletePostDelete(context){
			let post_id = context.state.postId
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

			axios.delete(`http://localhost:3000/api/post/${post_id}`,{
				headers:{
					'Authorization' : `Token ${userStorage.token}`
				}
			})
			.then(response => {
				console.log(response);
				window.location.href = 'http://localhost:8080/Activity';
			})
			.catch(error => {
				console.log(`Quelque chose c'est mal passé.${error}`)
			})
		},

		postCommentCreate(context){
			let rg = context.state.postsRg
			let post_id = context.state.postId
			let content = context.state.commentText
			let content_valid = rg.test(content)

			console.log(post_id)

			if (content_valid) {
				let formData = new FormData()
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

				let comment = {
					text : content,
					userid : userStorage.id
				}

				formData.append('content', JSON.stringify(comment));

				axios.post(`http://localhost:3000/api/comment/${post_id}`, formData, {
					headers:{
						'Content-Type': 'multipart/form-data',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(response => {
					console.log(response);
					window.location.reload();
				})
				.catch(error => {
					alert(`Quelque chose c'est mal passé.${error}`)
				})
			}else {
				alert("Le contenu du post n'est pas valide ou est inexistant")
			}
		},
		putCommentEdit(context){
			let rg = context.state.postsRg
			let comment_id = context.state.commentId
			let content = context.state.commentText
			let content_valid = rg.test(content)

			if (content_valid) {

				let formData = new FormData()
				let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

				let comment = {
					text : content
				}

				formData.append('content', JSON.stringify(comment));
				axios.put(`http://localhost:3000/api/comment/${comment_id}`, formData, {
					headers:{
						'Content-Type': 'multipart/form-data',
						'Authorization' : `Token ${userStorage.token}`
					}
				})
				.then(response => {
					console.log(response);
					window.location.href = 'http://localhost:8080/Activity';
				})
				.catch(error => {
					console.log(`Quelque chose c'est mal passé.${error}`)
				})
			}else {
				alert("Le contenu du post n'est pas valide ou est inexistant. Si aucune modification a été faite appuyer sur Annuler")
			}
		},
		deleteCommentDelete(context){
			let comment_id = context.state.commentId
			let userStorage = JSON.parse(sessionStorage.getItem('userToken'))

			axios.delete(`http://localhost:3000/api/comment/${comment_id}`,{
				headers:{
					'Authorization' : `Token ${userStorage.token}`
				}
			})
			.then(response => {
				console.log(response);
				window.location.href = 'http://localhost:8080/Activity';
			})
			.catch(error => {
				console.log(`Quelque chose c'est mal passé.${error}`)
			})
		},
	},
	modules: {
	}
})
