<script>
export default {
    data() {
        return {}
    },
    methods: {
        imagePosition() {
            const width = window.innerWidth

            for (let i = 1; i <= 15; i++) {
                let duration = Math.random() * 40
                if (duration < 10) {
                    duration = 10
                }

                let size = Math.random() * 250
                if (size < 80) {
                    size = 80
                }

                const css = {
                    left: `${Math.random() * width}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${Math.random() * 40}s`,
                    animationDuration: `${duration}s`
                }

                console.log(this.$refs[`image-${i}`])

                this.$refs[`image-${i}`].style.left = css.left
                this.$refs[`image-${i}`].style.width = css.width
                this.$refs[`image-${i}`].style.height = css.height
                this.$refs[`image-${i}`].style.animationDelay = css.animationDelay
                this.$refs[`image-${i}`].style.animationDuration = css.animationDuration
            }
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.imagePosition(window.innerWidth)
        })

    }
}
</script>

<template>
    <div class="background">
        <ul class="images">
            <li v-for="i in 15" :key="i" v-bind:ref="`image-${i}`"><img src="../assets/img/logo.png" /></li>
            {{ dfsdfsd }}
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