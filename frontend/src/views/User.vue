<script>
    export default {
        name: "Login",
        data(){
            return{
                role:"",
                sex : "",
                image : "",
                user : "",
                user_id : "",
                creator_id:"",
            }
        },
        computed : {},
        methods : {},
        beforeCreate(){
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
        },
        beforeMount(){
            const axios = require('axios')
            const moment = require('moment');
            moment().format();
            moment.locale('fr');

            let userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            this.sex = userStorage.sex
            this.user_id = userStorage.id
            this.role = userStorage.roleId
            this.creator_id = this.$route.params.id

            axios.get(`http://localhost:3000/api/post/user/${this.creator_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
            .then(user_posts => {
                this.user = user_posts.data

                this.user.posts.forEach((post) => {
                    let commentsCount = 0

                    post.date = moment(post.date).format('Do MMMM YYYY à HH:mm')

                    post.comments.forEach((comment) => {
                        comment.date = moment(comment.date).format('DD/MM/YY à HH:mm')
                        commentsCount ++
                    })
                    post.commentsNum = commentsCount
                })
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
    <section>
        <div class="posts">
            <div class="post" v-for="item in user.posts" :key="item.id">
                <div class="line1">
                    <div class="user">
                        <img v-if="user.image" :src="user.image" title="Tableau de bord" class="user_img">
                        <img v-else-if="user.sex === 'M'" src="../assets/user_male.svg" title="Tableau de bord" class="user_img">
                        <img v-else src="../assets/user_female.svg" title="Tableau de bord" class="user_img">
                        <div>
                            <h2>{{user.username}}</h2>
                            <p>{{item.date}}</p>
                        </div>
                    </div>
                    <div>
                        <router-link :to="{name: 'Post', params: { id: item.id },}" v-if="user.id === user_id"><i class="fas fa-user-edit" title="Modifier ou supprimer"></i></router-link>
                        <router-link :to="{name: 'Post', params: { id: item.id },}" v-else-if="role === 2"><i class="fas fa-user-edit" title="Modifier ou supprimer"></i></router-link>
                    </div>
                </div>

                <p class="text">{{item.content}}</p>

                <img v-if="item.image" :src="item.image" class="post_img" alt="aucune description disponible">

                <div class="share_comment">
                    <router-link :to="{name: 'Post', params: { id: item.id },}"><p><i class="fas fa-comments" title="Commenter"></i>{{ item.commentsNum }}</p></router-link>
                </div>
                <div class="comments">
                    <div class="comment" v-for="comment in item.comments" :key="comment.id">
                        <div class="user_comment">
                            <div class="user_comment_info">
                                <router-link :to="{name: 'User', params: { id: comment.user.id }}">
                                    <img v-if="comment.user.image" :src="comment.user.image" title="Tableau de bord" class="user_img">
                                    <img v-else-if="comment.user.sex === 'M'" src="../assets/user_male.svg" title="Tableau de bord" class="user_img">
                                    <img v-else src="../assets/user_female.svg" title="Tableau de bord" class="user_img">
                                </router-link>
                                <div>
                                    <h2>{{comment.user.username}}</h2>
                                    <p>{{comment.date}}</p>
                                </div>
                            </div>
                            <p>{{ comment.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <aside class="user_info">
            <h2>{{ user.username }}</h2>
            <img v-if="user.image" :src="user.image" title="Tableau de bord" class="user_img">
            <img v-else-if="user.sex === 'M'" src="../assets/user_male.svg" title="Tableau de bord" class="user_img">
            <img v-else src="../assets/user_female.svg" title="Tableau de bord" class="user_img">
            <p>{{user.biography}}</p>
            <p>{{user.email}}</p>
            <p v-if="user.sex === 'F'" >Femme</p>
            <p v-else>Homme</p>
        </aside>
    </section>
</template>

<style scoped lang="scss">
section{
    display: flex;
    justify-content: space-between;
}

h2{
    color: #fd2d01;
    font-size: 1.5em;
    font-weight: 100;
}

.posts{
    width: 80%;
}

.post{
    background-color: #122542;
    margin-bottom: 40px;
    padding: 10px 20px 10px 20px;
    border-radius: 30px;
    margin: 0 4%;
    display: flex;
    flex-direction: column;
    &_img{
        margin: auto;
        margin-top: 10px;
        width: 50%;
        height: auto;
    }
}

.line1{
    display: flex;
    justify-content: space-between;
}

.user{
    display: flex;
    width: 60%;
    padding-bottom: 10px;
    border-bottom: 3px #d1515a solid;
    div{
        padding-left: 10px;
        padding-top: 2%;
    }
    p{
        color: #ffd7d7;
        font-size: 1em;
        padding-top: 5%; 
    }
    &_img{
        width: 40px;
        height: 40px;
        background-color: #ffd7d7;
        padding: 2px;
        border-radius: 100px;
        border: 2px #d1515a solid;
    }
}

textarea{
    color: #ffd7d7;
    background-color: rgba(2, 7, 13, 0.5);
    border: 2px #fd2d01 solid;
    border-radius: 40px;
    padding: 10px 10px 5px 10px;
    margin-left: 10px;
    width: 100%;
    font-size: 1.2em;
    font-family: Arial;
}

.text{
    padding-top: 2%;
    padding-bottom: 2%;
    color: white;
    font-size: 1.1em;
    line-height: 1.5em;
    letter-spacing: 0.02em;
    border-bottom: 2px rgba(255, 255, 255, 0.1) solid;
}

.share_comment{
    padding: 10px;
    width: 16%;
    display: flex;
    justify-content: space-between;
    p{
        font-size: 1.7em;
        color: #fd2d01;
        display: flex;
        align-items: center;
    }
    .fas{
        color: #d1515a;
        font-size: 1.5em;
        padding-right: 10px;
        &:hover{
            color: #ffd7d7;
        }
    }
}

.line2{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    label{
        display: flex;
        align-items: center;
        font-size: 1.1em;
        color: #fd2d01;
    }
    i{
        margin-right: 10px;
        color: #d1515a;
        font-size: 30px;
    }
}

.btn-post{
    width: 150px;
    height: 40px;
    font-size: 1.2em;
    font-weight: bold;
    color: #ffffff;
    background-color: #d1515a;
    border-radius: 37px;
    border:none;
    box-shadow: -4px 4px 10px black;
    margin: 25px 0 2px 0;
    &:hover{
        margin-bottom: 0px;
        margin-top: 27px;
        color: #d1515a;
        background-color: #ffd7d7;
        border-radius: 37px;
        border:none;
        box-shadow: none;
    }
}

.comments{
    border: 4px #d1515a solid;
    border-radius: 10px;
    margin-top: 10px;
    padding: 1% 2%;
    p{
        font-size: 1.05em;
        width: 80%;
    }
}

.comment{
    padding-bottom: 1%;
    margin-bottom: 5%;
    border-bottom: 2px #ffd7d7 solid;
    a{
        margin-left: 2%;
        color: #ffd7d7;
        &:hover{
            color: #f76a4c;
        }
    }
}

.user_comment{
    display: flex;
    margin-bottom: 5px;
    p{
        margin: 0;
        align-self: center;
    }

}

.user_comment_info{
    display: flex;
    width: 15%;
    margin-right: 1%;
    padding-bottom: 10px;
    border-bottom: 3px #d1515a solid;
    img{
        width: 40px;
        height: 40px;
        background-color: #ffd7d7;
        padding: 2px;
        border-radius: 100px;
        border: 2px #d1515a solid;
    }
    div{
        padding-left: 10px;
        padding-top: 2%;
    }
    p{
        color: #ffd7d7;
        font-size: 1em;
        padding-top: 5%; 
    }
}

.fa-user-edit{
    margin-left: 20px;
    font-size: 1.8em;
    color: #d1515a;
    &:hover{
        color: #ffd7d7;
    }
}

a {
    text-decoration: none;
    cursor: pointer;
}

.user_info{
    background-color: #ffd7d7;
    width: 20%;
}

@media screen and (min-width:1024px){
    .post{
        margin: 0 15%;
    }

    .line1 img{
        width: 60px;
        height: 60px;
    }

    .line2 label{
        font-size: 1.5em;
        i{
            font-size: 40px;
        }   
    }

    textarea{
    border-radius: 40px;
    margin-left: 10px;
    padding-left: 30px;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 15px;
    font-size: 1.5em;
    }

    .btn-post{
        width: 230px;
        height: 50px;
        font-size: 1.5em;
    }
}
</style>