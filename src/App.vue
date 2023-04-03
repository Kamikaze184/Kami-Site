<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import Background from './components/Background.vue';
import { default as config } from './config/publicVars'

export default {
  data() {
    return {}
  },
  components: {
    NavBar,
    Footer,
    Background
  },
  mounted() {
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    const navBar = this.$refs['nav-bar']

    window.addEventListener('touchstart', (event) => {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    })

    window.addEventListener('touchend', (event) => {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;

      const x = touchendX - touchstartX;
      const y = touchendY - touchstartY;

      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0) {
          navBar.toggleMenuMobile('open')
        } else {
          navBar.toggleMenuMobile('close')
        }
      }
    })

    function isDescendant(parent, child) {
      let node = child.parentNode;
      while (node != null) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }

    document.addEventListener('click', function (e) {
      let target = e.target

      if (!isDescendant(navBar.$refs['menu-mobile'], target)) {
        navBar.toggleMenuMobile('close')
      }
    }, false);
  }
}
</script>

<template>
  <NavBar ref="nav-bar" />
  <router-view></router-view>
  <Footer />
  <Background />
</template>


<style scoped>
</style>
