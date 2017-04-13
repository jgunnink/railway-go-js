package passwords

import "golang.org/x/crypto/bcrypt"

// HashPassword encrypts a plaintext string and returns the hashed version
func HashPassword(password string) string {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	return string(hashed)
}
