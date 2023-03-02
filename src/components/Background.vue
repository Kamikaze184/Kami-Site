<script>
export default {
    data() {
        return {
            width: window.innerWidth
        }
    },
    methods: {
        imagePosition() {
            const width = window.innerWidth - 50

            for (let i = 1; i <= 15; i++) {
                let duration = Math.random() * 40
                if (duration < 10) {
                    duration = 10
                }

                let size = Math.random() * 250
                if (size < 80) {
                    size = 80
                }

                const css = `left: ${Math.random() * width}px; width: ${size}px; height: ${size}px; animation-delay: ${(Math.random() * 40)}s; animation-duration: ${duration}s;`

                this.$refs['image-item'][i - 1].setAttribute('style', css)
            }
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            if(this.width === window.innerWidth) return
            this.imagePosition(window.innerWidth)
        })

        this.imagePosition()
    }
}
</script>

<template>
    <div class="background">
        <ul class="images">
            <li v-for="i in 15" :key="i" ref="image-item"><img src="../assets/img/logo.png" /></li>
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
    margin: 0;
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
    }

    100% {
        transform: translateY(-900px) rotate(720deg);
        opacity: 0;
    }
}
</style>