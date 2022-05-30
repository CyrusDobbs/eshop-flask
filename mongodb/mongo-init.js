db.createUser({
    user: 'root',
    pwd: 'toor',
    roles: [
        {
            role: 'readWrite',
            db: 'testDB',
        },
    ],
});

db.createCollection('items', {capped: false});
db.createCollection('users', {capped: false});

db.users.insertOne({
    "username": "rthorne",
    "password": "sha256$nL8BB2WKKxb0NhJm$261491b98b97a4514c423ac0d0b5e1a4e8a942d927b46678b32c9b2af7cb62a3"
})

db.items.insertMany([{
    "_id": ObjectId("6284208a98d297d548d76700"),
    "name": "Compressed studs",
    "materials": "Silver",
    "dimensions": "1cm x .6cm",
    "other": "Support butterfly backs to prevent earrings tipping on lobe",
    "collection": "earrings",
    "price": 30,
    "sold": true,
    "hidden": false
}, {
    "_id": ObjectId("628420e5bd56177eafd76700"),
    "name": "Eternal Flower Studs",
    "materials": "Silver",
    "dimensions": "1.2cm square",
    "other": "Support butterflies to prevent earrings tipping on earlobe",
    "collection": "earrings",
    "price": 45,
    "sold": false,
    "hidden": false
}, {
    "_id": ObjectId("62842147bd56177eafd76701"),
    "name": "Stack rings various designs",
    "materials": "1.2 square wire silver ",
    "dimensions": "",
    "other": "Can be made to order. Please stipulate what design you require ",
    "collection": "rings",
    "price": 24,
    "sold": false,
    "hidden": false
}, {
    "_id": ObjectId("628421b5bd56177eafd76702"),
    "name": "Patterned Cufflinks",
    "materials": "Silver ",
    "dimensions": "1.4cm square",
    "other": "",
    "collection": "cufflinks",
    "price": 70,
    "sold": false,
    "hidden": false
}, {
    "_id": ObjectId("628929ce419705f2361f3dbb"),
    "name": "Eternal Flower Studs",
    "materials": "Sterling Silver",
    "dimensions": "1.7 cm square ",
    "other": "Special support butterfly back supplied. Holds earlobe flush with earring. Made of sterling silver. ",
    "collection": "earrings",
    "price": 49,
    "sold": false,
    "hidden": false
}])