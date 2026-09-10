import os
import threading
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

# 1. خادم الويب الخفيف لإبقاء الخدمة نشطة على Railway
class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
       self.send_response(200)
       self.send_header("Content-Type", "text/plain; charset=utf-8")
       self.end_headers()
       self.wfile.write(b"Wahran Agency Bot is active and running!")

    def log_message(self, format, *args):
       return

def run_server():
    port = int(os.environ.get("PORT", 8080))
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, SimpleHandler)
    print(f"Web server started on port {port} to keep Railway active.")
    httpd.serve_forever()

# 2. مهام الوكالة أو البوت التي تعمل في الخلفية
def run_agency_tasks():
    print("Agency automation background loop started...")
    while True:
# ضع هنا مهام الوكالة الخاصة بك (جلب العملاء، معالجة الرسائل، إلخ)
       time.sleep(30)

if __name__ == '__main__':
# تشغيل السيرفر في خلفية النظام لكي تستقر المنصة
    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()

# تشغيل مهام الوكالة الأساسية
    run_agency_tasks()
