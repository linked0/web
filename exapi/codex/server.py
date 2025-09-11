#!/usr/bin/env python3
"""
A simple HTTP server that responds to user requests.

Usage:
  python3 server.py [--port PORT]
  curl "http://localhost:8000/?name=Alice"
"""

import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs


class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET request and respond with a simple HTML greeting page."""
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        from html import escape
        raw_name = params.get('name', ['World'])[0] or 'World'
        name = escape(raw_name)

        message = f"Hello, {name}!"

        html_page = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Greeting Server</title>
  </head>
  <body>
    <h1>Greeting Server</h1>
    <form method="get" action="/">
      <label for="name">Your name:</label>
      <input type="text" id="name" name="name" value="{name}" placeholder="World">
      <button type="submit">Greet</button>
    </form>
    <hr>
    <p>{message}</p>
  </body>
</html>"""

        encoded = html_page.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


def main(port: int = 8000):
    """Start HTTP server on specified port."""
    # Allow address reuse to avoid "Address already in use" errors on restart
    HTTPServer.allow_reuse_address = True
    server = HTTPServer(('0.0.0.0', port), SimpleHandler)
    print(f'Serving HTTP on port {port} (http://localhost:{port}/) ...')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down server.')
    finally:
        server.server_close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Simple HTTP server that responds with a greeting.')
    parser.add_argument('-p', '--port', type=int, default=8000,
                        help='Port number to listen on (default: 8000)')
    args = parser.parse_args()
    main(args.port)
