package api

import (
	"encoding/json"
	"time"
)

type StorageItemType int

const (
	Directory StorageItemType = iota
	File
)

func (s StorageItemType) String() string {
	return [...]string{"Directory", "File"}[s]
}

func (s StorageItemType) JsonString() string {
	return [...]string{"dir", "file"}[s]
}

func (s StorageItemType) MarshalJSON() ([]byte, error) {
	return json.Marshal(s.JsonString())
}

type StorageItem struct {
	Name           string          `json:"name"`
	ItemType       StorageItemType `json:"type"`
	LastModifiedAt time.Time       `json:"lastModifiedAt"`
	Size           *int64          `json:"size"`
}

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
