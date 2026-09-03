from pymongo import MongoClient
from datetime import datetime, timezone


# 로컬 MongoDB에 연결
client = MongoClient("mongodb://127.0.0.1:27017")

# 데이터베이스 선택
database = client["softoasis"]

# 컬렉션 선택
products = database["products"]


product = {
    "name": "삼성 갤럭시 S26 Ultra",
    "price": 1800000,
    "category": "smartphone",
    "brand": "Samsung",
    "product_url": "https://example.com/product/1001",
    "created_at": datetime.now(timezone.utc)
}


# MongoDB에 저장
result = products.insert_one(product)

print("상품 저장 성공")
print("상품 번호:", result.inserted_id)


# 저장한 상품 확인
saved_product = products.find_one({
    "_id": result.inserted_id
})

print(saved_product)


# MongoDB 연결 종료
client.close()