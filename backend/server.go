package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "reflect"

	// "go/printer"
	_ "io/ioutil"
	"log"
	"net/http"

	"regexp"
	"strings"

	"github.com/go-chi/chi"
	_ "github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	_ "github.com/lib/pq"
	"github.com/nu7hatch/gouuid"
	_ "github.com/sqs/goreturns/returns"
)

// User is the ...
type User struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Score int `json:"score"`
}

// Users is ..
type Users []User

var db *sql.DB
var router *chi.Mux

func userExist(name string) User {
	
	rows, err:= db.Query("SELECT * FROM users")
	
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
	
	for _, user := range listUsers {
		if user.Name == name{
			fmt.Println("here=>", name)
			return user
		}
	}
	return User{}
	
}
//ListAllUsers ...
func ListAllUsers(w http.ResponseWriter, r *http.Request){
	
	// rows, err:= db.Query("SELECT * FROM Users ORDER BY User DESC LIMIT 10")
	rows, err:= db.Query("SELECT * FROM users")
	
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
	json.NewEncoder(w).Encode(listUsers)
}
//ListBestScores ..
func ListBestScores(w http.ResponseWriter, r *http.Request){
	fmt.Println("Listbest scores")
	// rows, err:= db.Query("SELECT * FROM Users ORDER BY User DESC LIMIT 10")
	rows, err:= db.Query("SELECT * FROM users ORDER BY score DESC")
	
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
	json.NewEncoder(w).Encode(listUsers)
}


//CreateUser ...
func CreateUser(w http.ResponseWriter, r *http.Request){

		u := User{}
		
		// if err := json.Unmarshal(r.Body, &u); err != nil {
		// // handle error
		// }
		err:= json.NewDecoder(r.Body).Decode(&u)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			// http.Error(w, fmt.Sprintf("Contact with phonenumber: %s not found", phoneNumber), 404)
			return
		}
		// fmt.Fprintf(w, "%+v", u)
		// fmt.Fprintf(w, "u: %+v", u)

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
		
		fmt.Printf("Valid User Name: [%+v]\n", u.Name)
		//make the Name Uppercase
		name := strings.ToUpper(u.Name)
		
		// check if username already exists
		user := userExist(name)
		if user != (User{}) {
			fmt.Println("Name already exists")
			w.Write([]byte(`{"status":"Name Exists"}`))
			// retornar el usuario
			// json.NewEncoder(w).Encode(user)
			return
		}
		
		//if it does exist create the user with a random ID and score = 0
		uuid, err := uuid.NewV4()
		id := uuid.String()
		fmt.Println("Entering to database id and name ==>", id, name )
		query := "INSERT INTO users (id, name, score) VALUES ($1, $2, $3);"
		_, err = db.Exec(query, id, name, 0); 
		if err != nil {
			log.Fatal(err)
		}
		w.Write([]byte(`{"status":"User Created"}`))

}
// UpdateScore ...
func UpdateScore(w http.ResponseWriter, r *http.Request) {
	
	u := User{}
	id := chi.URLParam(r, "id")

	
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		// http.Error(w, fmt.Sprintf("Contact with phonenumber: %s not found", phoneNumber), 404)
		return
	}
	fmt.Fprintf(w, "Person: %+v", u)
	if _, err = db.Exec("UPDATE users SET score=$1 Where id=$2", u.Score, id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
    }

	w.Write([]byte(`{"status":"Score Updated"}`))

}

func handleRequests() {
	fmt.Println("Start here 2")
	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
    // AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
    AllowedOrigins:   []string{"*"},
    // AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
    ExposedHeaders:   []string{"Link"},
	AllowCredentials: false,
	}))

	router.Post("/users", CreateUser)
	router.Get("/users", ListAllUsers)
	router.Get("/scores", ListBestScores)
	router.Put("/users/{id}", UpdateScore)

	log.Fatal(http.ListenAndServe(":8081", router))
}
func init() { 

	
	fmt.Println("Start here 1")
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