const mongoose = require('mongoose')
//node mongo.js pass Anna 040-1234556

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]


const url =
  `mongodb+srv://phonebook:${password}@phonebook.fqtxno6.mongodb.net/`
 
mongoose.set('strictQuery',false)
mongoose.connect(url)

//console.log(process.argv[3])
//console.log(process.argv[4])
const phonebookSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const generateRandomId = () => {
    const min = 10; 
    const max = 999999; 
    return Math.floor(Math.random() * (max - min)+ min);
}


if (process.argv[3]!== undefined && process.argv[4]!== undefined) {
    
    const givenName = process.argv[3]
    const givenNumber = process.argv[4]

    const phonebook = new Phonebook({
        id: generateRandomId(),
        name: givenName, 
        number: givenNumber
    })


    phonebook.save().then(result => {
        console.log('added '+phonebook.name +" number "+ phonebook.number+" to phonebook")
        mongoose.connection.close()
      })
  }
  else
  {
    Phonebook.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  }


