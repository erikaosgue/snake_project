<template>
<v-footer height="auto" color="indigo" dark fixed app>
  <v-layout justify-center row wrap>
    <v-flex color="indigo" dark py-3 text-xs-center white--text xs12>
      &copy;2021 — <strong>Snake Game</strong>
    </v-flex>
  </v-layout>
</v-footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
footer {
  padding: 20px;
  text-align: center;
}
</style>