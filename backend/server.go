package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"reflect"
	"log"
	"net/http"
	"regexp"
	"strings"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	_ "github.com/lib/pq"
	"github.com/nu7hatch/gouuid"
)

// User is the Main user
type User struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Score int `json:"score"`
}

// Users is list of users..
type Users []User

var db *sql.DB
var router *chi.Mux

//userExist checks in the database if the username exist
// return the user struct, or empty otherwise
func userExist(name string) User {

	u := User{}
	fmt.Println(name)
	fmt.Println(reflect.TypeOf(name))

	var theQuery = "SELECT * FROM users WHERE name=$1"

	row := db.QueryRow(theQuery, name)
	err := row.Scan(&u.ID, &u.Name, &u.Score);

	if err != nil && err != sql.ErrNoRows {
		fmt.Println(err.Error())	
	}

	return u

}
//ListAllUsers get all users from the database, return a list
func ListAllUsers(w http.ResponseWriter, r *http.Request){

	rows, err:= db.Query("SELECT * FROM users LIMIT 20")

	if err != nil {
		fmt.Println(err.Error())
		panic("failed to connect database")
	}

	listUsers := Users{}
	for rows.Next() {
		p := User{}
		if err := rows.Scan(&p.ID, &p.Name, &p.Score); err != nil {
			log.Fatal(err)
		}
		listUsers = append(listUsers, p)

	}
	defer rows.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(listUsers)
}
//ListBestScores return a list of the 20 best scores
func ListBestScores(w http.ResponseWriter, r *http.Request){
	
	rows, err:= db.Query("SELECT * FROM users ORDER BY score DESC LIMIT 20")

	if err != nil {
		fmt.Println(err.Error())
		panic("failed to connect database")
	}

	listUsers := Users{}
	for rows.Next() {
		p := User {}
		if err := rows.Scan(&p.ID, &p.Name, &p.Score); err != nil {
			log.Fatal(err)
		}
		listUsers = append(listUsers, p)

	}
	defer rows.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(listUsers)
}


//CreateUser creaates and returns a new user, error otherwise
func CreateUser(w http.ResponseWriter, r *http.Request){

		u := User{}

		err:= json.NewDecoder(r.Body).Decode(&u)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Checks if name is Empty
		fmt.Printf("name: [%+v]\n", u.Name)
		if u.Name == "" {
			fmt.Println("Empty string")
			w.Write([]byte(`{"status":"Invalid Name"}`))
			return
		}


		//start validation for username
		var isStringAlphabetic = regexp.MustCompile(`^[A-Za-z][A-Za-z0-9]*$`).MatchString
		if !isStringAlphabetic(u.Name){
			fmt.Println("is not alphanumeric")
			w.Write([]byte(`{"status":"Invalid Name"}`))
			return
		}

		//make the Name Uppercase
		u.Name = strings.ToUpper(u.Name)

		// check if username already exists
		user := userExist(u.Name)
		if user != (User{}) {
			fmt.Println("Name already exists")
			w.Write([]byte(`{"status":"Name Exists"}`))
			return
		}

		//if it does exist create the user with a random ID and score = 0
		uuid, err := uuid.NewV4()
		u.ID = uuid.String()
		u.Score = 0

		query := "INSERT INTO users (id, name, score) VALUES ($1, $2, $3);"
		_, err = db.Exec(query, u.ID, u.Name, u.Score);
		if err != nil {
			log.Fatal(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(u)

}

//getUser return the user struct base on the name from url
func getUser(w http.ResponseWriter, r *http.Request){

		u := User{}
		u.Name = chi.URLParam(r, "name")
	
		//checks if user already exists
		user := userExist(u.Name)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		json.NewEncoder(w).Encode(user)

}
// UpdateScore will update the score base on the user id
func UpdateScore(w http.ResponseWriter, r *http.Request) {

	u := User{}
	id := chi.URLParam(r, "id")


	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		w.Write([]byte(`{"status":"error"}`))
		return
	}
	fmt.Fprintf(w, "Person: %+v", u)
	if _, err = db.Exec("UPDATE users SET score=$1 Where id=$2", u.Score, id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
    }

	w.Write([]byte(`{"status":"Score Updated"}`))

}

// ALl handlers that redirect to all functions
func handleRequests() {
	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
    AllowedOrigins:   []string{"*"},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
    ExposedHeaders:   []string{"Link"},
	AllowCredentials: false,
	}))

	router.Post("/users", CreateUser)
	router.Get("/users", ListAllUsers)
	router.Get("/users/{name}", getUser)
	router.Get("/scores", ListBestScores)
	router.Put("/users/{id}", UpdateScore)

	log.Fatal(http.ListenAndServe(":8081", router))
}

// Init will open the database
func init() {

	var err error
    db, err = sql.Open("postgres","user=snake dbname=snake_game sslmode=disable port=26257")
	
	if err != nil {
		log.Fatal("error connecting to the database: ", err, nil)
	}

    if err != nil {
		log.Fatal("error connecting to the database: ", err, nil)
	}
}

func main() {
	
	fmt.Println("Requesting serving :8081")

	handleRequests()

}