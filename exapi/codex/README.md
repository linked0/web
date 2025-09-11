# Simple HTTP Server

This is a basic Python HTTP server that responds with a greeting message.

## Usage

```bash
python3 server.py [--port PORT]
```

Default port is `8000`. You can specify a different port with `--port` or `-p`.

Example:

```bash
curl "http://localhost:8000/?name=Alice"
```

## Response

Opens a simple HTML page with a form to submit your name, and displays `Hello, <name>!`. If the `name` parameter is omitted or blank, it defaults to `World`.

You can also view the result in a terminal using `curl`, though the response will be HTML:

```bash
curl -s "http://localhost:8000/?name=Alice"
```
