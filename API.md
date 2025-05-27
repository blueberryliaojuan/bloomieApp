### get all:

GET http://localhost:3000/flowers

### filter like

GET http://localhost:3000/flowers?name_like=rose

### get favorite

GET http://localhost:3000/flowers?favorite=true

### get detail by id

GET http://localhost:3000/flowers?id:1

### add flower

POST http://localhost:3000/flowers
{
"id": "bloomie01",
"name": "Whispers of the Rose",
"description": "Beautiful roses, whispering love and passion in every petal.",
"imageUrl": "/src/assets/img/flowerBouquet01.jpeg",
"img": "img1",
"price": 25.0,
"tags": ["flowerBouquet", "romantic", "rose", "spring"],
"favorite": true,
"reviews": [
{
"user": "Alice",
"rating": 5,
"comment": "Absolutely stunning roses!"
},
{
"user": "Bob",
"rating": 4,
"comment": "Loved the colors, but some petals were a bit dry."
}
]
},

### revise the flower id=1

PUT http://localhost:3000/flowers/1

### change the favorit of id=1

PATCH http://localhost:3000/flowers/1
Content-Type: application/json
{
"favorite": false
}

### delete the id=1

DELETE http://localhost:3000/flowers/1
