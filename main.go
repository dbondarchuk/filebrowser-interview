package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"

	"github.com/dbondarchuk/filebrowser-interview/api"
	"github.com/joho/godotenv"
)

const listenPort = 8080

//go:embed web/dist
var assets embed.FS

func main() {
	webassets, err := fs.Sub(assets, "web/dist")
	if err != nil {
		log.Fatalln("could not embed webassets", err)
	}

	err = godotenv.Load()
	if err != nil {
		log.Fatalln("could not load env variables", err)
	}

	s, err := api.NewServer(webassets)
	if err != nil {
		log.Fatalln(err)
	}

	log.Fatalln(s.ListenAndServe(fmt.Sprintf("localhost:%d", listenPort)))
}
