### Development Notes

The Go backend in this repository uses the [`embed`](https://pkg.go.dev/embed)
package to embed the React app inside the Go binary. Running `go build` in the
root will capture whatever is present in the `web/build` subdirectory.

To ensure you have an up to date copy of the web app in your binary, you should:

- `cd web`
- `yarn install`
- `yarn build`
- `cd ..`
- `go build`

The Go app is hardcoded to listen on port 8080.

For a faster feedback loop and more developer friendly process, you can run
the webapp's dev server alongside the Go backend:

```
$ cd web
$ yarn start
```

This will run the webpack dev server on port 3000. Make sure the Go backend is
running and that you're accessing port 3000 in your browser. If you mistakenly
access port 8080 in the browser you will see the version of the UI embedded in
the binary and not the one served by the dev server. The webapp is already
configured to proxy API requests to the Go backend on port 8080.
