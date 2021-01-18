<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <Navigation />
    <MainUser />
    <Footer />
    
  </div>
</template>

<script>
// @ is an alias to /src
import MainUser from "@/components/MainUser.vue";
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "UserHome",
  components: {
    MainUser,
    Navigation,
    Footer
  }
};
</script>
