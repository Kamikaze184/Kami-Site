<script>
import router from '../router'

export default {
    setup() {
        localStorage.removeItem('token')

        router.push({ name: 'Home' })
    }
}
</script>

<template></template>

<style></style>