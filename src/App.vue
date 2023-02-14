<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import Background from './components/Background.vue';

export default {
  data() {
    return {}
  },
  methods: {
  },
  components: {
    NavBar,
    Footer,
    Background
  }
}
</script>

<template>
  <NavBar />
  <router-view></router-view>
  <Footer />
  <Background />
</template>


<style scoped>

</style>
