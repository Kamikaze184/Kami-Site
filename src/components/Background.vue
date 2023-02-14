<script>
const imagePosition = () => {
    let duration = Math.random() * 40
    if(duration < 10){
        duration = 10
    }

    let size = Math.random() * 250
    if(size < 80){
        size = 80
    }

    return `left: ${Math.random() * window.innerWidth}px; width: ${size}px; height: ${size}px; animation-delay: ${(Math.random() * 40)}s; animation-duration: ${duration}s;`
}

export default {
    data() {
        return {}
    },
    methods: {
        imagePosition
    }
}
</script>

<template>
    <div class="background">
        <ul class="images">
            <li v-for="i in 15" :key="i" :style="imagePosition()"><img src="../assets/img/logo.png" /></li>
        </ul>
    </div>
</template>

<style>
.background {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-bottom: 0px;
    z-index: -1;
    width: 100%;
    height: 100%;
}

.images {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.images li {
    position: absolute;
    display: block;
    list-style: none;
    animation: animate 25s linear infinite;
    bottom: -250px;
    z-index: -2;
}

.images li img {
    width: 60%;
}

@keyframes animate {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }

    100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }
}
</style>