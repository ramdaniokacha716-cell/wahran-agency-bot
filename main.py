mport os
from http.server import HTTPServer, BaseHTTPRequestHandler

# كود خفيف وبسيط جداً لضمان استمرار عمل السيرفر على Railway دون أخطاء أو تبعات معقدة
class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
       self.send_response(200)
       self.send_header("Content-type", "text/plain; charset=utf-8")
       self.end_headers()
       self.wfile.write(b"Agency Bot is active and running successfully!")

    def log_message(self, format, *args):
# منع ازدحام السجلات بالطلبات غير الضرورية
       return

def run():
# الحصول على المنفذ المخصص من المنصة أو استخدام المنفذ 8080 افتراضياً
    port = int(os.environ.get("PORT", 8080))
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, SimpleHandler)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
