<template>
  <v-app>
    <v-card-title class="mx-auto mt-10">
      <h1 class="display-2">SNAKE GAME</h1>
    </v-card-title>

    <v-card width="400" class="mx-auto mt-5">
      <v-card-title>
        <h4 class="display-1">Login</h4>
      </v-card-title>

      <!-- Here where the for will be -->
      <v-card-text>
        <v-form class="px-3">
          <!-- v-text-field v-model represents input -->
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
          hide-default-footer
        ></v-data-table>
      </v-card>
    </template>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "MainHome",

  mounted: function() {
    axios
      .get("http://localhost:8081/scores")
      .then(response => {
        this.data = response.data;
        for (var i = 0; i < this.data.length; i++) {
          var user = this.data[i];
         
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

  // Pushes posts to the server when called.
  methods: {
    postUser() {
      const params = {
         name: this.name
      };
      axios.post("http://localhost:8081/users", params)
        .then(response => {
          if (response.data.status == "Invalid Name")
            alert("Name: " + this.name + " is invalid!");

          if (response.data.status == "Name Exists")
            alert("Name " + this.name + " already exists !");

          if (response.data.status == "User Created") 
            console.log("success");
        })
        .catch(e => {
          console.log("error: =>", e.message);
        });
    },

    singIn() {
      for (var i = 0; i < this.data.length; i++) {
        var user = this.data[i];
        if (user.name == this.name.toUpperCase()) {
          sessionStorage.setItem('user', JSON.stringify(user));
          console.log(sessionStorage.user)
          this.$router.push('UserHome')
          return
        }
      }
      alert("User does not exits");
    }
  },

  data: () => ({
    errorMessage: null,
    data: null,
    name: "",
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
    users: []
  })
};
</script>

<style></style>
