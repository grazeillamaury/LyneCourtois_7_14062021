<template>
	<div id="app">
		<Header/>
		<router-view/>
		<Footer/>
	</div>
</template>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}

body{
    font-family: arial;
	background-color: #02070d;
    font-size: 15px;
}

p{
    font-size: 20px;
    color: #fd2d01;
}

h1{
	color:#ffffff;
    margin-top: 60px;
    margin-bottom: 70px;
}

h3{
   color:#122542;
   font-size:20px;
}
</style>

<script>
import Header from "./components/Header"
import Footer from "./components/Footer"
export default {
	name: "Login",
	components: {
		Header,
		Footer,
	}
}
</script>