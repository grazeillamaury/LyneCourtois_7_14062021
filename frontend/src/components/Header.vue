<script>
export default {
    name: "Header",
}
</script>

<template>
    <header>
        <nav>
            <div>
                <img src="../assets/icon.svg" class="icon"> 
                <p>Groupomania</p>
            </div>
            <div id="lien">
                <router-link to="/Login">Se connecter</router-link>
                <router-link to="/Signup">S'inscrire</router-link>
            </div>
        </nav>
    </header>
</template>

<style scoped lang="scss">
p{
    font-size: 20px;
    color: #fd2d01;
}

header{
    background-color: #122542;
}

nav {
    padding: 30px;
    a{
        font-size: 25px;
        color: white;
        height: 80px;
        text-decoration: none;
        margin: 20px;
        &:hover {
            color: #d1515a;
            border-bottom: 5px black solid;
        }
    }
    div:first-child{
        display: flex;
        align-items: center;
    }
}

.icon{
    width:50px;
}

#lien {
    text-align: right;
}
</style>