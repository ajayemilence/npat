App     : npat(Game)
Version :
Author  : Ajay Singh Koranga
email   : ajay.emilence@gmail.com


baseUrl = http://139.59.18.239:4012/v1




=========================== FOR add animal ================================
baseUrl/animal/addAnimal

send in RAW

 ->   REQUEST TYPE: POSTs
 ->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response : -

{
    "success": 1,
    "msg": "animal info added",
    "data": {
        "__v": 0,
        "name": "Bear",
        "word": "B",
        "createdAt": "2018-05-17T07:41:45.147Z",
        "updatedAt": "2018-05-17T07:41:45.148Z",
        "upVote": 2,
        "downVote": 3,
        "createdBy" : "Admin",
        "language" : "English",
        "_id": "5afd32397fa21f2da2ba2f1f"
    }
}

for second time 

->   PARAMETERS:-

 ->   name 
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response :-

{
    "success": 1,
    "msg": " animal word info added upvoted",
    "data": {
        "_id": "5afd32397fa21f2da2ba2f1f",
        "name": "Bear",
        "word": "B",
        "createdAt": "2018-05-17T07:41:45.147Z",
        "updatedAt": "2018-05-17T07:41:45.148Z",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "language" : "English",
        "__v": 0
    }
}

=========================== FOR add plant ================================
baseUrl/plant/addPlant

send in RAW

 ->   REQUEST TYPE: POSTs
 ->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response : -

{
    "success": 1,
    "msg": "plant info added",
    "data": {
        "__v": 0,
        "name": "Garlic",
        "word": "G",
        "createdAt": "2018-05-17T07:48:41.447Z",
        "updatedAt": "2018-05-17T07:48:41.447Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd33d97fa21f2da2ba2f20"
    }
}

for second time 

->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response :-

{
    "success": 1,
    "msg": "plant info added",
    "data": {
        "__v": 0,
        "name": "Garlic",
        "word": "G",
        "createdAt": "2018-05-17T07:48:41.447Z",
        "updatedAt": "2018-05-17T07:48:41.447Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd33d97fa21f2da2ba2f20"
    }
}

=========================== FOR add thing ================================
baseUrl/thing/addThing

send in RAW

 ->   REQUEST TYPE: POSTs
 ->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response : -

{
    "success": 1,
    "msg": "thing info added",
    "data": {
        "__v": 0,
        "name": "Case",
        "word": "C",
        "createdAt": "2018-05-17T07:50:56.098Z",
        "updatedAt": "2018-05-17T07:50:56.098Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd34607fa21f2da2ba2f21"
    }
}

for second time 

->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response :-

{
    "success": 1,
    "msg": "thing info added",
    "data": {
        "__v": 0,
        "name": "Case",
        "word": "C",
        "createdAt": "2018-05-17T07:50:56.098Z",
        "updatedAt": "2018-05-17T07:50:56.098Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd34607fa21f2da2ba2f21"
    }
}

=========================== FOR add place================================
baseUrl/place/addPlace

send in RAW

 ->   REQUEST TYPE: POSTs
 ->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response : -

{
    "success": 1,
    "msg": "place info added",
    "data": {
        "__v": 0,
        "name": "England",
        "word": "E",
        "createdAt": "2018-05-17T07:53:29.947Z",
        "updatedAt": "2018-05-17T07:53:29.947Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd34f97fa21f2da2ba2f22"
    }
}

for second time 

->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response :-

{
    "success": 1,
    "msg": "place info added",
    "data": {
        "__v": 0,
        "name": "England",
        "word": "E",
        "createdAt": "2018-05-17T07:53:29.947Z",
        "updatedAt": "2018-05-17T07:53:29.947Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd34f97fa21f2da2ba2f22"
    }
}


=========================== FOR add Human================================
baseUrl/human/addHuman

send in RAW

 ->   REQUEST TYPE: POSTs
 ->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy
 ->   gender
 

response : -

{
    "success": 1,
    "msg": "human info added",
    "data": {
        "__v": 0,
        "name": "Chris",
        "word": "C",
        "gender": "male",
        "createdAt": "2018-05-17T08:06:01.367Z",
        "updatedAt": "2018-05-17T08:06:01.367Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd37e97fa21f2da2ba2f23"
    }
}

for second time 

->   PARAMETERS:-

 ->   name
 ->   word
 ->   upVote
 ->   downVote
 ->   language
 ->   createdBy

response :-

{
    "success": 1,
    "msg": "human info added",
    "data": {
        "__v": 0,
        "name": "Chris",
        "word": "C",
        "gender": "male",
        "createdAt": "2018-05-17T08:06:01.367Z",
        "updatedAt": "2018-05-17T08:06:01.367Z",
        "language": "English",
        "upVote": 3,
        "downVote": 2,
        "createdBy" : "Admin",
        "_id": "5afd37e97fa21f2da2ba2f23"
    }
}



http://localhost:4012/v1/npat/main?word=P&round=d&language=0



=========================== FOR get words================================
baseUrl/npat/main
 
**send word and round in query

ex =>   baseUrl/npat/main?word=P&round=d&language=0

                    word can be A to Z
                    round can be A to E
                    language can be 0 or 1   0 means English 1 means Arabic

response : -

        if name of given letter can not be found or there is no name 
        than it will be "nullWord" as shown in example below
{
    "success": 1,
    "msg": "words shown of given letter",
    "data": {
        "humanName": "nullWord",
        "placeName": "nullWord",
        "animalName": "nullWord",
        "thingName": "nullWord",
        "plantName": "nullWord"
    }
}
    if everything goes well than the example note below example is of round E or 5
    
{
    "success": 1,
    "msg": "words shown of given letter",
    "data": {
        "humanName": "Paras",
        "placeName": "Poland",
        "animalName": "Parrot",
        "thingName": "Pen",
        "plantName": "PAPAVER"
    }
}


=========================== FOR testing================================
     baseUrl/npat/testing
 
{
    "success": 1,
    "msg": "user is online"
}