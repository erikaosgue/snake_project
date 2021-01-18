<template>
  
  <div class="game">
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
  
</template>

<script>
import test from "@/game";


export default {
  name: 'Game',
  data() {
    return {
      initialize: true,
      game: test.game
    };
  }
};
</script>

<style>

.game {
  text-align: center;
  padding: 120px;
  padding-bottom: 200px;
  background-color: rgb(37, 163, 94);
}

</style>
