<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import Background from './components/Background.vue';

const socket = io('')

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
  },
  props: {
    socket: socket
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
