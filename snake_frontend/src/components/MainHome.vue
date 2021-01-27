<template>
  <v-app>
    <v-card-title class="mx-auto mt-10">
      <h1 class="display-2">SNAKE GAME</h1>
    </v-card-title>

    <v-card width="400" class="mx-auto mt-5">
      <v-card-title>
        <h4 class="display-1">Login</h4>
      </v-card-title>

      <!-- Here where the form will be -->
      <v-card-text>
        <v-form class="px-3">
          <v-text-field
            label="Username"
            prepend-icon="mdi-account-circle"
            v-model="name"
            :rules="nameRules"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="info" type="submit" @click="postUser">
          Register
        </v-btn>
        <v-btn color="info" type="submit" @click="singIn">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>

    <template>
      <v-card-title class="mx-auto mt-3">
        <h3 class="display-0.5">TOP SCORES</h3>
      </v-card-title>
      <v-card width="400" class="mx-auto mt-3">
        <v-data-table

          width="10"
          :headers="headers"
          :items="users"
          item-key="name"
          class="elevation-1"
        ><template v-slot:no-data>
          <v-alert :value="true" color="grey" class="mb-4 mt-4">
              {{ errorMessage }}
          </v-alert>
        </template>
        </v-data-table>
          <!-- hide-default-footer -->
      </v-card>
    </template>
     <div class="text-center mt-10 mb-15">
     </div>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  
  name: "MainHome",
  
  data: () => ({
    errorMessage: null,
    name: "",
    users: [],
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 20) || "Name must be less than 20 characters"
    ],
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
  }),

  mounted: function() {
    sessionStorage.removeItem("user")
    
    // Get all users info to display in Top Scores Table
    axios
      .get("http://localhost:8081/scores")
      .then(response => {
        let users = response.data;
        for (let i = 0; i < users.length; i++) {
          let user = users[i];

          let object = {
            sortable: false,
            name: user.name,
            score: user.score,
            position: i + 1
          };
          this.users.push(object);
        }
      })
      .catch(error => {
        this.errorMessage = "Internal Error! Request Fail";
        console.log(error)
      });
  },

  methods: {
    
    // Pushes posts to the server when called.
    postUser() {
      const params = {
        name: this.name
      };
      axios
        .post("http://localhost:8081/users", params)
        .then(response => {
          if (response.data.status == "Invalid Name")
            alert("Name: " + this.name + " is invalid!");

          if (response.data.status == "Name Exists")
            alert("Name " + this.name + " already exists !");
          
          if (response.status == 201) {
            sessionStorage.setItem("user", JSON.stringify(response.data));
            this.$router.push("/UserHome")
          }
        })
        .catch(e => {
          alert("Internal Error! We can't create new Username, Try later")
          localStorage.removeItem("user")
          console.log(e)
        });
    },

    singIn() {
      
      let url = "http://localhost:8081/users/" + this.name.toUpperCase()
      
      axios.get(url)
      .then(response => {
        let user = response.data
        
        if (user.id != "") {
          sessionStorage.setItem("user", JSON.stringify(user));
          this.$router.push("UserHome");
          return
        }
        alert("User does not exits");
      })
      .catch(e => {
        alert("Internal Error! Try later")
        sessionStorage.removeItem("user")
        console.log(e)
      })
      }
  },
};
</script>


<style>
</style>
