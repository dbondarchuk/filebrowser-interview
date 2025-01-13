package api

import (
	"errors"
	"os"
	"strings"
)

type Storage interface {
	GetContents(path string)
}

type FileStorage struct{}

func (s FileStorage) GetContents(path string) ([]StorageItem, error) {
	if path == "" {
		path = "."
	}

	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	items := make([]StorageItem, 0, len(entries))
	for _, entry := range entries {
		info, err := entry.Info()
		if err != nil {
			return nil, err
		}

		var size *int64
		if !info.IsDir() {
			size = new(int64)
			*size = info.Size()
		} else {
			size = nil
		}

		item := StorageItem{
			Name:           info.Name(),
			LastModifiedAt: info.ModTime(),
			Size:           size,
		}

		if info.IsDir() {
			item.ItemType = Directory
		} else {
			item.ItemType = File
		}

		items = append(items, item)
	}

	return items, nil
}

func checkIsPathAllowed(path string) error {
	index := 0
	for _, part := range strings.Split(path, "/") {
		if part == ".." {
			index--
		} else {
			index++
		}

		if index < 0 {
			return errors.New("OUT_OF_BOUNDS")
		}
	}

	return nil
}
