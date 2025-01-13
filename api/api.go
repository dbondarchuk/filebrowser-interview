package api

import (
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"time"
)

// Server serves the directory browser API and webapp.
type Server struct {
	handler http.Handler
	auth    Auth
}

const authTokenCookie = "authToken"
const authUsernameCookie = "authUsername"

// NewServer creates a directory browser server.
// It serves webassets from the provided filesystem.
func NewServer(webassets fs.FS) (*Server, error) {
	mux := http.NewServeMux()
	s := &Server{handler: mux, auth: EnvAuth{}}

	// API routes
	mux.Handle("/api/contents/{path...}", http.HandlerFunc(s.contents))
	mux.Handle("/api/auth/signin", http.HandlerFunc(s.authorize))
	mux.Handle("/api/auth/signout", http.HandlerFunc(s.signOut))

	// web assets
	hfs := http.FS(webassets)
	files := http.FileServer(hfs)
	mux.Handle("/assets/", files)
	mux.Handle("/favicon.ico", files)

	// fall back to index.html for all unknown routes
	index, err := extractIndexHTML(hfs)
	if err != nil {
		return nil, err
	}
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := w.Write(index); err != nil {
			log.Println("failed to serve index.html", err)
		}
	}))

	return s, nil
}

func (s *Server) ListenAndServe(addr string) error {
	return http.ListenAndServe(addr, s.handler)
}

func (s *Server) contents(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(405)
		return
	}

	fmt.Printf("Requested path is %s\n", r.PathValue("path"))

	authInfo := s.checkAuth(r)
	if authInfo == nil {
		w.WriteHeader(401)
		w.Write([]byte("Unauthorized"))

		return
	}

	storage := FileStorage{}
	path := r.PathValue("path")

	err := checkIsPathAllowed(path)
	if err != nil {
		status := 400

		w.WriteHeader(status)
		w.Write([]byte(err.Error()))

		return
	}

	items, err := storage.GetContents(r.PathValue(("path")))

	if err != nil {
		status := 400
		if os.IsNotExist(err) {
			status = 404
		}

		w.WriteHeader(status)
		w.Write([]byte(err.Error()))
	} else {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(items)
	}
}

func (s *Server) authorize(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(405)
		return
	}

	decoder := json.NewDecoder(r.Body)
	var authRequest AuthRequest
	err := decoder.Decode(&authRequest)
	if err != nil {
		panic(err)
	}

	token, info, err := s.auth.Authorize(authRequest.Username, authRequest.Password)
	if err != nil {
		w.WriteHeader(401)
		w.Write([]byte(err.Error()))

		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     authTokenCookie,
		Value:    token,
		HttpOnly: true,
		Expires:  info.expiresAt,
		Path:     "/",
	})

	http.SetCookie(w, &http.Cookie{
		Name:    authUsernameCookie,
		Value:   info.username,
		Expires: info.expiresAt,
		Path:    "/",
	})

	w.WriteHeader(200)
}

func (s *Server) signOut(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(405)
		return
	}

	authInfo := s.checkAuth(r)
	if authInfo == nil {
		w.WriteHeader(401)
		w.Write([]byte("Unauthorized"))

		return
	}

	token, err := s.getToken(r)

	if err != nil {
		w.WriteHeader(401)
		w.Write([]byte("Unauthorized"))

		return
	}

	err = s.auth.SignOut(token)
	if err != nil {
		w.WriteHeader(401)
		w.Write([]byte(err.Error()))

		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     authTokenCookie,
		Value:    "",
		HttpOnly: true,
		Expires:  time.Unix(0, 0),
		Path:     "/",
	})

	http.SetCookie(w, &http.Cookie{
		Name:    authUsernameCookie,
		Value:   "",
		Expires: time.Unix(0, 0),
		Path:    "/",
	})

	w.WriteHeader(200)
}

func extractIndexHTML(fs http.FileSystem) ([]byte, error) {
	f, err := fs.Open("index.html")
	if err != nil {
		return nil, fmt.Errorf("could not open index.html: %w", err)
	}
	defer f.Close()

	b, err := io.ReadAll(f)
	if err != nil {
		return nil, fmt.Errorf("could not read index.html: %w", err)
	}

	return b, nil
}

func (s *Server) getToken(r *http.Request) (string, error) {
	tokenCookie, err := r.Cookie(authTokenCookie)
	if err != nil {
		return "", err
	}

	return tokenCookie.Value, nil
}

func (s *Server) checkAuth(r *http.Request) *AuthInfo {
	token, err := s.getToken(r)
	if err != nil {
		return nil
	}

	return s.auth.VerifyToken(token)
}
