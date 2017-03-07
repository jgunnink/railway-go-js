package main

import (
	"fmt"
	"os"

	"github.com/jgunnink/railway/db"
)

var helptext = "Welcome to Railway. Server is running."

func main() {
	args := os.Args[1:]
	if len(args) == 0 {
		fmt.Println(helptext)
		os.Exit(1)
	}

	db.Init(dbname, dbuser, dbpass, dbhost, dbport)

	for _, arg := range args {
		fmt.Println("Running command:", arg)
		switch arg {
		case "db:drop":
			db.Drop()
		case "db:migrate":
			db.Migrate()
		default:
			fmt.Printf("%s is not a valid command\n", arg)
			fmt.Println(helptext)
		}
	}
}
