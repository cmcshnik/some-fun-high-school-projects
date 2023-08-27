from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3


conn = sqlite3.connect('messages.db')
cursor = conn.cursor()
cursor.execute("""CREATE TABLE IF NOT EXISTS messages(
   id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
   text TEXT);
""")
conn.commit()


def get_last_messges(first_id, count):
    if first_id == None:
        cursor.execute("""
        SELECT id, text FROM messages ORDER BY id DESC LIMIT ?
        """, [count])
    else:
        cursor.execute("""
        SELECT id, text FROM messages WHERE id < ? ORDER BY id DESC LIMIT ?
        """, [first_id, count])

    return list(reversed(cursor.fetchall()))

def get_messages_starting_from(number):
    cursor.execute("""
    SELECT id, text FROM messages WHERE id >= ? ORDER BY id
    """, [number])

    return cursor.fetchall()

def post_message(message):
    cursor.execute("""
    INSERT INTO messages(text) VALUES(?)
    """, [message])
    conn.commit()


def send_message(handler, status, message):
    message = bytes(message, 'utf-8')
    handler.send_response(status)
    handler.send_header('Content-Length', str(len(message)))
    handler.end_headers()
    handler.wfile.write(message)



class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        print("PATH:", self.path)
        print("HEADERS:", self.headers)
        send_message(self, 200, '')

    def do_POST(self):
        if 'content-length' not in self.headers:
            return send_message(self, 400, 'No content-length')

        try:
            content_length = int(self.headers['content-length'])
            assert content_length >= 0
        except:
            return send_message(self, 400, 'Wrong content-length')

        try:
            req = json.loads(self.rfile.read(content_length))
        except:
            return send_message(self, 400, 'Not json')

        try:
            assert type(req) == dict
            assert 'action' in req
        except:
            return send_message(self, 400, 'Wrong json')

        if req['action'] == 'get_notes':
            return handle_get_notes(self, req)

        if req['action'] == 'post_note':
            return handle_post_note(self, req)

        if req['action'] == 'get_updates':
            return handle_get_updates(self, req)

        return send_message(self, 400, 'Wrong action')


# messages = [
#     (0, "Вася ел грибы 1"),
#     (1, "Вася не ел грибы 2"),
#     (2, "Вася -- гриб 0"),
#     (3, "Вася ел грибы 1"),
#     (4, "Вася не ел грибы 2"),
#     (5, "Вася -- гриб 0"),
#     (6, "Вася ел грибы 1"),
#     (7, "Вася не ел грибы 2"),
#     (8, "Вася -- гриб 0"),
#     (9, "Вася ел грибы 1"),
#     (10, "Вася не ел грибы 2"),
#     (11, "Вася -- гриб 0"),
#     (12, "Вася ел грибы 1"),
#     (13, "Вася не ел грибы 2"),
#     (14, "Вася -- гриб 0"),
#     (15, "Вася ел грибы 1"),
#     (16, "Вася не ел грибы 2"),
# ]



def handle_get_notes(self, req):
    if 'count' in req and type(req['count']) == int and req['count'] > 0:
        count = req['count']
    else:
        count = 5

    if 'first_id' in req and type(req['first_id']) == int and req['first_id'] >= 0:
        first_id = req['first_id']
    else:
        first_id = None

    if first_id == None:
        to_give = get_last_messges(None, count)
    else:
        if first_id - count < 0: count = first_id
        to_give = get_last_messges(first_id, count)

    return send_message(self, 200, json.dumps(to_give, ensure_ascii=False))


def handle_post_note(self, req):
    if 'message' in req and type(req['message']) == str and len(req['message']) > 0:
        post_message(req['message'])
        return send_message(self, 200, 'Done')
    else:
        return send_message(self, 400, 'Empty message')


def handle_get_updates(self, req):
    if 'number_of_max_message' in req and type(req['number_of_max_message']) == int and req[
        'number_of_max_message'] >= 0:
        number = req['number_of_max_message']
    else:
        return send_message(self, 400, 'Bad count')

    answer = get_messages_starting_from(number + 1)
    return send_message(self, 200, json.dumps(answer, ensure_ascii=False))


HTTPServer(('', 8000), MyHandler).serve_forever()

