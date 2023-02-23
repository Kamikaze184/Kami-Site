<script>
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    data() {
        return {
            count: 0
        }
    },
    async mounted() {
        let value = parseInt(this.$refs.counter.getAttribute('end-value'))
        var speed = Math.ceil(((value * 0.0001) + ((value * 1.4) / 400)))
        let count = 0;

        while (count < value) {
            this.count = count
            count += speed
            await sleep(10)
        }

        if (count >= value) {
            this.count = value;
        }
    }
}
</script>
<template>
    <h1 ref="counter" end-value="0">{{ count }}</h1>
</template>