<script>


export default {
    data: () => {
        return {
            teste: ""
        }
    },
    methods: {
        onKeyup() {
            console.log(this.teste)
        }
    }
}
</script>

<template>
    <input type="text" v-model="teste" v-on:keyup="onKeyup()" placeholder="Search fruits..." />
</template>

<style>
input {
    display: block;
    width: 350px;
    margin: 20px auto;
    padding: 10px 45px;
    background: rgb(0, 0, 0) url("../assets/img/search.svg") no-repeat 15px center;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.item {
    width: 350px;
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.fruit {
    background-color: rgb(97, 62, 252);
    cursor: pointer;
}

.error {
    background-color: tomato;
}
</style>