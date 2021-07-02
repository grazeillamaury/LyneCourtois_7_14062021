<template>
	<div>
		<nav>
			<div>
				<img src="../assets/user_male.svg">
				<i class="fas fa-sign-out-alt"></i>
				<i class="fas fa-tools"></i>
			</div>
			<i class="fas fa-globe"></i>
		</nav>
		<main>
			<div id="bande">
				<img src="../assets/icon-left-font.svg">
			</div>
			<slot><p>bonjour</p></slot>
		</main>
	</div>
</template>

<script>

	export default {
		name: 'Navigation',
	}
</script>

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
			&:hover{
				border: 2px #ffd7d7 solid;
			}
		}
		.fas{
			font-size: 1.5em;
			color: #ffd7d7;
			&:hover{
				color: #02070d;
			}
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
		height: 875px;
		position: fixed;
		padding: 0.7%;
		border-right: 3px #122542 solid;
		background-color: #02070d;
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