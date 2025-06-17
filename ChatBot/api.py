from flask import Flask, request, jsonify
import openai
import json
import os
import mysql.connector
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

# Đặt API key (nên dùng biến môi trường thay vì hardcode)
openai.api_key = os.getenv("OPENAI_API_KEY")

# Prompt hệ thống
def get_system_prompt():
    products = fetch_products_from_db()
    product_text = format_products(products)
    return (
        "Bạn là một trợ lý AI cho một cửa hàng quần áo.\n"
        "- Trả lời như một nhân viên thân thiện, ngắn gọn và tự nhiên.\n"
        "- Nếu được hỏi chung kiểu 'shop bán gì?', chỉ nên liệt kê tổng quát như: đồ ngủ, đồ mặc nhà, đồ bộ nữ...\n"
        "- Khi trả lời về sản phẩm, hãy trả về JSON gồm:\n"
        "  - 'reply': phần trả lời tự nhiên\n"
        "  - 'data': danh sách sản phẩm, mỗi sản phẩm là một object với các trường:\n"
        "    - id\n"
        "    - name\n"
        "    - description\n"
        "    - price\n"
        "    - image\n"
        "=> Ví dụ: { \"reply\": \"Shop mình có các mẫu sau\", \"data\": [ { \"id\": 123, \"name\": \"Bộ pijama...\", ... } ] }\n\n"
        "Dưới đây là danh sách sản phẩm:\n\n" + product_text
    )

# Hàm lấy dữ liệu từ DB
def fetch_products_from_db():
    conn = mysql.connector.connect(
        host="localhost", user="root", password="", database="btl_tmdt"
    )
    cursor = conn.cursor(dictionary=True)
    query = """
    SELECT 
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.images,
        c.name AS category_name,
        s.name AS size_name,
        ps.stock
    FROM product p
    LEFT JOIN category c ON p.categoryId = c.id
    LEFT JOIN productSize ps ON p.id = ps.productId 
    LEFT JOIN size s ON ps.sizeId = s.id;
    """
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

# Định dạng lại dữ liệu để đẩy vào prompt
def format_products(products):
    formatted = ""
    for item in products:
        image = item['images'].split(',')[0] if item.get('images') else "Không có ảnh"
        formatted += (
            f"Tên: {item['name']}\n"
            f"Mô tả: {item['description']}\n"
            f"Giá: {item['price']} VND\n"
            f"Ảnh: {image}\n"
            f"id: {item['product_id']}\n\n"
        )
    return formatted

# Hàm hỏi GPT
def ask_chat(messages):
    response = openai.ChatCompletion.create(
    model="gpt-4o",
    messages=messages,
    max_tokens=800
    )
    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {"reply": content, "data": []}

# API POST /chat
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "Thiếu nội dung tin nhắn"}), 400

    messages = [
        {"role": "system", "content": get_system_prompt()},
        {"role": "user", "content": user_message}
    ]

    reply = ask_chat(messages)
    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)