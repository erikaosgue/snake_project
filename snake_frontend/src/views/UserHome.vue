<template>
  <div class="home">
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
