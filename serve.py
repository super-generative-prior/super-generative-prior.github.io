#!/usr/bin/env python3
"""Tiny static server for local preview:  python3 serve.py  →  http://localhost:4321"""
import functools
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "4321"))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), functools.partial(Handler, directory=ROOT)) as httpd:
    sys.stderr.write("serving %s at http://localhost:%d\n" % (ROOT, PORT))
    httpd.serve_forever()
