<template>
  <v-app>
    <v-card-title class="mx-auto mt-10">
      <h2 class="display-2">SNAKE GAME</h2>
    </v-card-title>

    <div class="text-center">
    <v-card width="500" class="mx-auto mt-15">
            <v-card-title class="mx-auto mt-3">
                <h2 class="display-0.5"  > {{ getUser }}</h2>
            </v-card-title>
            <v-data-table
                :headers="headers1"
                :items=getItems()
                :items-per-page="5"
                class="elevation-0"
                hide-default-footer
                hide-default-header
                
            ></v-data-table>
    </v-card>
  </div>


    <div class="text-center mt-10">PLAY HERE
      <v-btn
        class="mx-2" fab dark large 
        href="/Game" color="purple">
        <v-icon dark>
          mdi-snake
        </v-icon>
      </v-btn>

    </div>

    <template>
      <v-card-title class="mx-auto mt-15">
        <h3 class="display-0.5">TOP SCORES</h3>
      </v-card-title>
      <v-card width="600" class="mx-auto mt-3">
        <v-data-table
          width="10"
          :headers="headers"
          :items="users"
          item-key="name"
          class="elevation-1"
          hide-default-footer
        ></v-data-table>
      </v-card>
     
     <div class="text-center mt-10 mb-15">
      <v-btn
        class="ma-2"
        color="orange darken-2"
        dark
        @click="$router.push('/')"
        >
        <v-icon
          dark
          left>
          mdi-arrow-left
        </v-icon>
        Exit
      </v-btn>
     </div>
     <div class="text-center mt-10 mb-15">
     </div>

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
        var curr_user = JSON.parse(sessionStorage.user)
        for (var i = 0; i < this.data.length; i++) {
          var user = this.data[i];
          if (user.id == curr_user.id) {
            this.position = i + 1
          }
          console.log(user);
          var object = {
            sortable: false,
            name: user.name,
            score: user.score,
            position: i + 1,
            id: user.id
          };
          this.users.push(object);
        }
      })
      .catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", this.errorMessage);
      });
  },

  computed: {

    getUser() {
      var user = JSON.parse(sessionStorage.user)
      var name = user.name
      return name
    },
  },

  methods: {
    getItems() {
      var user = JSON.parse(sessionStorage.user)
      this.name = user.name
      var items = [
        {name: 'Score', value: user.score},
        {name: 'Position', value: this.position}
      ]
      return items
    },

    snakeGame() {
      console.log("SnakeGame start function")
      // var user = JSON.parse(sessionStorage.user);
      window.location.replace("http://localhost:8082/Game");
    }
  },

  data: () => ({
    errorMessage: null,
    data: null,
    name: "",
    position: null,

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
    headers1: [
            
            { 
            text: '', 
            value: 'name', 
            sortable: false,
            align: 'start'
        },
        { 
            text: '', 
            value: 'value',
            sortable: false,
            align: 'start'
        },
      ],
    users: [],
    items: []
  })
};
</script>

<style></style>
