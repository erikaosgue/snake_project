<template>
  <div class="game">
    <Navigation />
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" class="phaserGame"/>
    <Footer />
  </div>
  
</template>

<script>
import phaser from "@/game";
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";


export default {
  name: 'Game',
  components: {
    Navigation,
    Footer
  },
  data() {
    return {
      initialize: true,
      game: phaser.game
    };
  },
  mounted: function() {
    if (sessionStorage.user == undefined) {
      this.$router.push('/')
      return
    }
  }
};
</script>

<style>

.phaserGame {
  text-align: center;
  padding-top: 100px;
  padding-bottom: 200px;
  background-color: rgb(144, 196, 231);
}

</style>
