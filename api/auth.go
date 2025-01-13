package api

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type Auth interface {
	Authorize(username string, password string) (string, *AuthInfo, error)
	VerifyToken(token string) *AuthInfo
	SignOut(token string) error
}

type AuthInfo struct {
	username  string
	expiresAt time.Time
}

type EnvAuth struct{}

var tokens = map[string]AuthInfo{}

func verify(username string, password string) (bool, error) {
	if len(username) == 0 || len(password) == 0 {
		return false, nil
	}

	salt := os.Getenv("AUTH_SALT")

	pwd := os.Getenv(("AUTH_PASSWORD_" + username))
	if len(pwd) == 0 {
		return false, nil
	}

	// For debug purposes only: generate your password
	// hash, _ := bcrypt.GenerateFromPassword([]byte(password+salt), 14)
	// log.Println(string(hash))

	err := bcrypt.CompareHashAndPassword([]byte(pwd), []byte(password+salt))
	if err == nil {
		return true, nil
	}

	return false, nil
}

func generateToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func (a EnvAuth) Authorize(username string, password string) (string, *AuthInfo, error) {
	valid, err := verify(username, password)
	if err != nil {
		return "", nil, err
	}

	if !valid {
		return "", nil, errors.New("NOT_VALID")
	}

	token, err := generateToken()
	if err != nil {
		return "", nil, err
	}

	authInfo := AuthInfo{
		username:  username,
		expiresAt: time.Now().Add(time.Hour),
	}

	tokens[token] = authInfo

	return token, &authInfo, nil
}

func (a EnvAuth) VerifyToken(token string) *AuthInfo {
	val, ok := tokens[token]

	if !ok {
		return nil
	}

	if val.expiresAt.Before(time.Now()) {
		delete(tokens, token)
		return nil
	}

	return &val
}

func (a EnvAuth) SignOut(token string) error {
	if _, ok := tokens[token]; ok {
		delete(tokens, token)
		return nil
	}

	return errors.New("NOT_VALID_TOKEN")
}
