package seed

import (
	"fmt"
	"log"
	"strings"

	"sync"

	"github.com/jgunnink/railway"
	"github.com/jgunnink/railway/avatar"
	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/helpers"
	"github.com/jmoiron/sqlx/types"
	"github.com/manveru/faker"
)

// Seeder contains the methods needed to seed the app
type Seeder struct {
	railway.HTTPService
	dbclient *db.DB
	faker    *faker.Faker
}

// New returns a new Seeder
func New(httpService railway.HTTPService, dbinstance *db.DB) *Seeder {
	f, err := faker.New("en")
	if err != nil {
		panic(err)
	}
	return &Seeder{
		HTTPService: httpService,
		dbclient:    dbinstance,
		faker:       f,
	}
}

// Seed seeds the database with an admin user and runs the seeder function.
func (s *Seeder) Seed() error {
	// Create the orange "client"
	name := "Studio Orange"
	newClient := &railway.Client{
		Name:        name,
		Description: s.faker.Paragraph(2, true),
		Data:        types.JSONText(fmt.Sprintf(`{"avatar":"%s"}`, avatar.Avatar(name))),
	}
	orangeClient := s.dbclient.ClientService().ClientCreate(newClient)

	// Create the admin
	email := "admin@example.com"
	s.dbclient.UserService().UserCreate(&railway.User{
		FirstName: s.faker.FirstName(),
		LastName:  s.faker.LastName(),
		Email:     email,
		Password:  helpers.HashPassword("password"),
		Role:      railway.RoleAdmin,
		Archived:  false,
		Disabled:  false,
		ClientID:  orangeClient.ID,
		Data:      types.JSONText(fmt.Sprintf(`{"avatar":"%s"}`, avatar.Avatar(email))),
	})
	return s.Run()
}

// Run will begin the seeding process. The server must be running.
func (s *Seeder) Run() error {
	// Login first
	err := s.HTTPService.UserSignIn(&railway.UserSignInRequest{
		Email:    "admin@example.com",
		Password: "password",
	})
	if err != nil {
		return err
	}

	err = s.SeedClients()
	if err != nil {
		return err
	}

	err = s.SeedUsers()
	if err != nil {
		return err
	}

	log.Println("Seeding completed without errors.")
	return nil
}

// SeedClients will create some clients
func (s *Seeder) SeedClients() error {
	log.Println("Seeding clients...")

	wg := &sync.WaitGroup{}
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func() {
			name := s.faker.CompanyName()
			newClient := &railway.ClientCreateRequest{
				Name:        name,
				Description: s.faker.Paragraph(2, true),
				Data:        types.JSONText(fmt.Sprintf(`{"avatar":"%s"}`, avatar.Avatar(name))),
			}
			err := s.HTTPService.ClientCreate(newClient)
			if err != nil {
				panic(err)
			}
			log.Println("New client created:", newClient.Name)
			wg.Done()
		}()
	}
	wg.Wait()
	return nil
}

// SeedUsers will create all the users
func (s *Seeder) SeedUsers() error {
	log.Println("Seeding users...")

	// Create some staff users
	wg := &sync.WaitGroup{}
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func() {
			firstName := s.faker.FirstName()
			email := fmt.Sprintf("%s@example.com", strings.ToLower(firstName))
			newUser := &railway.UserCreateRequest{
				FirstName: firstName,
				LastName:  s.faker.LastName(),
				Email:     email,
				Password:  "password",
				Role:      railway.RoleStaff,
				Data:      types.JSONText(fmt.Sprintf(`{"avatar":"%s"}`, avatar.Avatar(email))),
			}
			err := s.HTTPService.UserCreate(newUser)
			if err != nil {
				panic(err)
			}
			log.Println("New user created:", newUser.FirstName)
			wg.Done()
		}()
	}

	allClients, err := s.HTTPService.ClientAll()
	if err != nil {
		panic(err)
	}

	for clientID := range allClients {
		// Create a single client user for each client
		wg.Add(1)
		go func(clientID int) {
			email := fmt.Sprintf("client%d@example.com", clientID)
			newUser := &railway.UserCreateRequest{
				FirstName: s.faker.FirstName(),
				LastName:  s.faker.LastName(),
				Email:     email,
				Password:  "password",
				Role:      railway.RoleClient,
				ClientID:  clientID,
				Data:      types.JSONText(fmt.Sprintf(`{"avatar":"%s"}`, avatar.Avatar(email))),
			}
			err := s.HTTPService.UserCreate(newUser)
			if err != nil {
				panic(err)
			}
			log.Println("New user created:", newUser.FirstName)
			wg.Done()
		}(clientID)
	}
	wg.Wait()
	return nil
}
