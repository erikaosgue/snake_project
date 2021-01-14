<template>
  <v-app>
    <v-card-title class="mx-auto mt-10">
      <h1 class="display-2">SNAKE GAME</h1>
    </v-card-title>
    <div class="text-center mt-10">
      <v-btn
        class="mx-2"
        fab
        dark
        large
        @click="snakeGame"
        color="purple"
      >
        <v-icon dark>
          mdi-snake
        </v-icon>
      </v-btn>
    </div>

    <template>
      <v-card-title class="mx-auto mt-15">
        <h3 class="display-0.5">TOP SCORES</h3>
      </v-card-title>
      <v-card width="400" class="mx-auto mt-3">
        <v-data-table
          width="10"
          :headers="headers"
          :items="users"
          item-key="name"
          class="elevation-1"
          hide-default-footer
        ></v-data-table>
      </v-card>
    </template>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "MainUser",

  mounted: function() {
    axios
      .get("http://localhost:8081/scores")
      .then(response => {
        this.data = response.data;
        for (var i = 0; i < this.data.length; i++) {
          var user = this.data[i];
          console.log(user)
          var object = {
            sortable: false,
            name: user.name,
            score: user.score,
            position: i + 1
          };
          this.users.push(object);
        }
      })
      .catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", this.errorMessage);
      });
  },
  methods: {
    snakeGame () {
      window.location.href = "http://localhost:8000/snake.html"
    }
  },

  

  data: () => ({
    errorMessage: null,
    data: null,
    // name: "",
    
    headers: [
      { text: "Position", value: "position", align: "center" },
      {
        text: "Username",
        align: "start",
        value: "name",
        sortable: false
      },
      { text: "Score", value: "score" }
    ],
    users: []
  })
};
</script>

<style></style>

  
