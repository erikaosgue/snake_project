<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <!-- <Navigation /> -->
    <MainHome />
    <!-- <Footer /> -->
  </div>
</template>

<script>
// @ is an alias to /src
import MainHome from "@/components/MainHome.vue";

export default {
  name: "Home",
  components: {
    MainHome
    // HelloWorld
  }
};
</script>
