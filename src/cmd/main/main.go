package main

import "github.com/joho/godotenv"

func main() {
	godotenv.Load()
	server := InitServer()
	server.Start()
}
