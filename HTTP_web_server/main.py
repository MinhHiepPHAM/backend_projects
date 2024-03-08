import socket
import os
import mimetypes

from flask import Flask, redirect
 
 
app = Flask(__name__)


class TCPServer:
    def __init__(self, host='127.0.0.1', port=8888):
        self.host = host
        self.port = port

    def start(self):
        # create socket
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

        s.bind((self.host,self.port))

        s.listen(5) # 5: The number of connections that can be queued up

        print("Listening at", s.getsockname())
        while True:
            conn, addr = s.accept()
            print('Connected by', addr)

            # read data from client
            data = conn.recv(1024) # read only 1024 first bytes

            print(data)

            response = self.handle_request(data)

            # print(response)

            conn.sendall(response) # send back to the client

            conn.close()
    
    def handle_request(self,data):
        return data


class HttpServer(TCPServer):
    headers = {
        'Server': 'CrudeServer',
        'Content-Type': 'text/html',
    }

    status_codes = {
        200: 'OK',
        404: 'Not Found',
        501: 'Not Implemented',
    }

    def handle_request(self,data):
        http_request = HttpRequest(data)
        print(http_request.method)
        try:
            handler = getattr(self,'do_%s'%http_request.method)
        except AttributeError:
            handler = self.HTTP_501_handler
        
        response = handler(http_request)

        return response

    def HTTP_501_handler(self, request):
        response_line = self.response_line(status_code=501)

        response_headers = self.response_headers()

        blank_line = b"\r\n"

        response_body = b"<h1>501 Not Implemented</h1>"

        return b"".join([response_line, response_headers, blank_line, response_body])
    
    def response_line(self, status_code):
        status = self.status_codes[status_code]
        response = "HTTP/1.1 %d %s\r\n"%(status_code,status)
        return response.encode()
    
    def response_headers(self,extra_header=None):
        headers = self.headers.copy()
        if extra_header:
            headers.update(extra_header)

        byte_headers = ""

        for header, context in headers.items():
            byte_headers += '%s: %s\r\n'%(header,context)
        return byte_headers.encode()
    
    """
        GET    /index.html      HTTP/1.1           \r\n
        |          |               |                |
     Method       URI        HTTP version       Line break
    """
    
    def do_GET(self, request):
        filename = request.uri.strip('/') # remove the slash from the request uri (ie. /index.html -> index.html)
        print(filename)
        if os.path.exists(filename):
            status_code=200
            content_type = mimetypes.guess_type(filename)[0] or 'text/html'
            # print(filename, content_type)
            extra_headers = {'Content-Type': content_type}
            with open(filename, 'rb') as f:
                response_body = f.read()
        else:
            status_code = 404
            response_body = b"<h1>404 Not Found</h1>"
            extra_headers = None
        
        response_line = self.response_line(status_code)
        response_headers = self.response_headers(extra_headers)
        
        blank_line = b"\r\n"
        
        return b"".join([response_line, response_headers, blank_line, response_body])

    def do_POST(self, request):
        status_code=200
        content_type = 'text/html'
        filename = 'login.html'
        extra_headers = {'Content-Type': content_type}
        with open(filename, 'rb') as f:
            response_body = f.read()
        
        response_line = self.response_line(status_code)
        response_headers = self.response_headers(extra_headers)
        blank_line = b"\r\n"
        
        return b"".join([response_line, response_headers, blank_line, response_body])

class HttpRequest:
    def __init__(self, data):
        self.method = None
        self.uri = None
        self.http_version = "1.1" # default to HTTP/1.1 if request doesn't provide a version

        self.parse_request(data)    

    def parse_request(self, data):
        header_line = data.split(b"\r\n")[0].decode()
        request_info = header_line.split(" ")
        # print(request_info)
        self.method, self.uri, self.http_version = request_info

if __name__ == '__main__':
    server = HttpServer()
    server.start()
