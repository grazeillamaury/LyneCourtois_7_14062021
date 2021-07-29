<script>
    import SubmitButton from "../components/SubmitButton.vue"
    import { mapActions } from "vuex"
    export default {
        name: "Login",
        data(){
            return{
                role:"",
                sex : "",
                post : "",
                user_id : "",
                editMode: 0,
            }
        },
        components: {
            SubmitButton
        },
        computed : {
            commentText:{
                // getter
                get: function () {
                    return this.$store.state.commentText;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.commentText = newValue;
                }
            },
            postText:{
                // getter
                get: function () {
                    return this.post.content;
                },
                // setter
                set: function (newValue) {
                    this.$store.state.postText = newValue;
                }
            }
        },
        methods : {
            ...mapActions(['postCommentCreate', 'putPostEdit']),
            getPostId() {
                this.$store.state.postId = this.$route.params.id
            },
            changeToEditMode(){
                this.editMode = 1
            },
            changeToNormalMode(){
                this.editMode = 0
                this.$store.state.postText = ""
                this.$store.state.imagePost = ""
            },
            addImage(event) {
                this.$store.state.imagePost = event.target.files[0]
            }
        },
        beforeCreate(){
            const userStorage = JSON.parse(sessionStorage.getItem('userToken'))
            if (userStorage === null) {
                window.location.href = 'http://localhost:8080';
            }
            this.$store.state.postId = this.$route.params.id
            this.$store.state.commentText = ""
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
            let post_id = this.$route.params.id

            axios.get(`http://localhost:3000/api/post/${post_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
                .then(post => {
                    let commentCount =  0
                    this.post = post.data

                    this.post.date = moment(this.post.date).format('Do MMMM YYYY à HH:mm')
                    this.post.comments.forEach((comment) => {
                        comment.date = moment(comment.date).format('DD/MM/YY à HH:mm')
                        commentCount ++
                    })
                    this.post.commentsNum = commentCount

                })
                .catch(error => {
                    console.log(error);
                    alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
                });
        },
        mounted(){
            document.title = `Répondre à un post`
        }
    }
</script>

<template>
    <section>
        <div class="post">
            <div v-if="editMode === 0">
                <div class="line1">
                    <div class="user">
                        <router-link to="/User/" v-if="post.user.sex === 'M'"><img src="../assets/user_male.svg" title="Tableau de bord" class="user_img"></router-link>
                        <router-link to="/User/" v-else><img src="../assets/user_female.svg" title="Tableau de bord" class="user_img"></router-link>
                        <div>
                            <h2>{{post.user.username}}</h2>
                            <p>{{post.date}}</p>
                        </div>
                    </div>
                    <div>
                        <i v-if="post.user.id === user_id" @click="changeToEditMode" class="fas fa-edit" title="Modifier"></i>
                        <i v-if="post.user.id === user_id" class="fas fa-trash" title="Supprimer"></i>
                        <i v-else-if="role === 2" class="fas fa-trash" title="Supprimer"></i>
                    </div>
                </div>

                <p class="text">{{post.content}}</p>

                <img v-if="post.image" :src="post.image" class="post_img" alt="aucune description disponible">

                <div class="share_comment">
                    <p><i class="fas fa-comments" title="Commenter"></i>{{ post.commentsNum }}</p>
                    <p><i class="fas fa-share" title="Partager"></i>0</p>
                </div>
                <div class="comments">
                    <div class="comment" v-for="comment in post.comments" :key="comment.id">
                        <div class="user_comment">
                            <div class="user_comment_info">
                                <router-link to="/User/" v-if="comment.user.sex === 'M'"><img src="../assets/user_male.svg" title="Tableau de bord" class="user_img"></router-link>
                                <router-link to="/User/" v-else><img src="../assets/user_female.svg" title="Tableau de bord" class="user_img"></router-link>
                                <div>
                                    <h2>{{comment.user.username}}</h2>
                                    <p>{{comment.date}}</p>
                                </div>
                            </div>
                            <p>{{ comment.content }}</p>
                            <div>
                                <router-link :to="{name: 'Comment', params: { id: comment.id },}" v-if="comment.user.id === user_id">
                                    <i class="fas fa-user-edit" title="Modifier ou supprimer"></i>
                                </router-link>
                                <router-link :to="{name: 'Comment', params: { id: comment.id },}" v-else-if="role === 2">
                                    <i class="fas fa-user-edit" title="Modifier ou supprimer"></i>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <form class="form_comment">
                        <div class="line1">
                            <router-link to="/User/" v-if="sex === 'M'">
                                <img src="../assets/user_male.svg" title="Tableau de bord" class="user_img">
                            </router-link>
                            <router-link to="/User/" v-else>
                                <img src="../assets/user_female.svg" title="Tableau de bord" class="user_img">
                            </router-link>

                            <textarea name="post" placeholder="Écrivez quelque chose ici ..." rows="1" v-model="commentText" @change="getPostId"></textarea>
                        </div>
                        <SubmitButton class="btn-post" @click="postCommentCreate" value="Publier"/>
                    </form>
                </div>
            </div>
            <form class="post" v-else-if="editMode === 1">
                <div class="line1">
                    <router-link to="/User/" v-if="sex === 'M'"><img src="../assets/user_male.svg" title="Tableau de bord" class="user_img"></router-link>
                    <router-link to="/User/" v-else><img src="../assets/user_female.svg" title="Tableau de bord" class="user_img"></router-link>
                    <textarea name="post" rows="1" v-model="postText"></textarea>
                </div>
                <br>

                <div class="line2">
                    <div>
                        <label for="myfile"><i class="fas fa-photo-video"></i> Photo / Vidéo</label>
                        <br>
                        <input @change="addImage" type="file" id="myfile" name="myfile" accept= "image/*">
                    </div>
                    <SubmitButton class="btn-post" @click="putPostEdit" value="Changer"/>
                    <SubmitButton class="btn-post" @click="changeToNormalMode" value="Annuler"/>
                </div>
            </form>
        </div>
    </section>
</template>

<style scoped lang="scss">
h2{
    color: #fd2d01;
    font-size: 1.5em;
    font-weight: 100;
}

.post{
    background-color: #122542;
    margin-bottom: 40px;
    padding: 10px 20px 10px 20px;
    border-radius: 30px;
    margin-left: 4%;
    margin-right: 4%;
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

.fa-edit, .fa-trash{
    margin-left: 20px;
    font-size: 1.8em;
    color: #d1515a;
    &:hover{
        color: #ffd7d7;
    }
}

form a {
    cursor: pointer;
}

@media screen and (min-width:1024px){
    .post{
        margin-right: 20%;
        margin-left: 20%;
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