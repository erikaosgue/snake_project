<template>
  <v-app>
    <v-card-title class="mx-auto mt-10">
      <h2 class="display-2">SNAKE GAME</h2>
    </v-card-title>

    <div class="text-center">
    <v-card width="600" class="mx-auto mt-15">
            <v-card-title class="mx-auto mt-3">
                <h2 class="display-0.5"  > {{ getUser }}</h2>
            </v-card-title>
            <v-data-table
                :headers="headers1"
                :items=getCurrUser()
                :items-per-page="5"
                class="elevation-0"
                hide-default-footer
                hide-default-header
                
            ><template v-slot:no-data>
                <v-alert :value="true" color="grey" class="mb-4 mt-4">
                     There is a problem displaying current user
                </v-alert>
              </template>
            </v-data-table>
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
        >
        <template v-slot:no-data>
          <v-alert :value="true" color="grey" class="mb-4 mt-4">
              {{ errorMessage }}
          </v-alert>
        </template>
        </v-data-table>
          <!-- hide-default-footer -->
      </v-card>
     
     <div class="text-center mt-10 mb-15">
      <v-btn
        class="ma-2"
        color="orange darken-2"
        dark
        @click="goHome"
        >
        <!-- @click="$router.push('/')" -->
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
  
  data: () => ({
    errorMessage: null,
    position: null,
    users: [],

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
    
  }),

  mounted: function() {

    if (sessionStorage.user == undefined) {
      this.$router.push('/')
      return
    }

    // Get all users info to display in Top Scores Table
    axios
      .get("http://localhost:8081/scores")
      .then(response => {
        let users = response.data;
        let curr_user = JSON.parse(sessionStorage.user)
        
        for (let i = 0; i < users.length; i++) {
          
          let user = users[i];
          
          //Update information such the score everytime refresh or come back from
          // loosing the game
          if (user.id == curr_user.id) {
            this.position = i + 1
            sessionStorage.setItem("user", JSON.stringify(user));
          }
          
          let object = {
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
        sessionStorage.removeItem("user")
        this.errorMessage = "Internal Error! There is a problem displaying Top Users";
        console.log(error)
      });
  },

  computed: {

    // getUser Return the name of the Current User
    getUser() {

      let name
      if (sessionStorage.user != undefined) {
        let user = JSON.parse(sessionStorage.user)
        name = user.name
      }
      return name
    },
  },

  methods: {

    // getItems return Score and Posiiton of current User
    getCurrUser() {
      let items
      if (sessionStorage.user != undefined) {
        let user = JSON.parse(sessionStorage.user)
        items = [
        {name: 'Score', value: user.score},
        {name: 'Position', value: this.position}
      ]
      }
      return items
    },

    goHome() {
      // sessionStorage.removeItem("user")
      console.log(localStorage.user)
      this.$router.push('/')
    }

  },

};
</script>

<style></style>
