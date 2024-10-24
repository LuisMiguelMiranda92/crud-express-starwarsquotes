const express = require("express")
const app = express()
const MongoClient = require("mongodb").MongoClient
const connectionString = "mongodb+srv://lmbasmiranda:UoCc4lKz7sbmdV4B@cluster0.x3ve8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



MongoClient.connect(connectionString).then(client => {
    console.log('Connected to Database')
    const db = client.db("star-wars2-quotes")
    const quotesCollection = db.collection('quotes')

    app.set("view engine", "ejs")
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(express.json())
    
    //READ
    app.get('/', (req, res) => {
        db.collection('quotes')
          .find()
          .toArray()
          .then(results => {
            res.render("index.ejs", {quotes: results})          })
          .catch(error => console.error(error))
        
      })
    
    //CREATE
    app.post('/quotes', (req, res) => {
        quotesCollection
          .insertOne(req.body)
          .then(result => {
            res.redirect("/")
          })
          .catch(error => console.error(error))
      })
    
    //UPDATE
    app.put('/quotes', (req, res) => {
        quotesCollection
        .findOneAndUpdate(
          { name: 'yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))        
    })

    //DELETE
    app.delete('/quotes', (req, res) => {
        quotesCollection
          .deleteOne({ name: req.body.name })
          .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
              }
            res.json(`Deleted Darth Vader's quote`)
          })
          .catch(error => console.error(error))
      })
    
     
      
      
    
    
    app.listen(8000, function () {
        console.log("listening on 8000")
    })

})
.catch(error => console.error(error))



