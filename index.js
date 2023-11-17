require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Phonebook = require('./models/person')
//npm start
//node index.js
//npm run build

const app = express()
app.use(express.json())

//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

const cors = require('cors')
app.use(cors())


app.use('/',express.static('dist'))


app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(persons => {
    response.json(persons)
  })
})

/*const generateRandomId = () => {
    const min = 10;
    const max = 999999;
    return Math.floor(Math.random() * (max - min)+ min);
}*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log("post")

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name and number are required'
    })
  }

  //const duplicatePerson = persons.find(person => person.name === body.name);
  //if (duplicatePerson) {
  //  return response.status(400).json({ error: 'Name must be unique' });}

  const person = new Phonebook({
    //id: generateRandomId(),
    name: body.name,
    number: body.number,
  })

  //persons = persons.concat(person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
  //response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  console.log("findbyid")
  Phonebook.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
  //const id = Number(request.params.id)
  //const person = persons.find(person => person.id === id)
  //console.log("get")
})

app.delete('/api/persons/delete/:id', (request, response, next) => {
  console.log("delet req "+request.params.id)
  Phonebook.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/update/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.get('/info', (request, response) => {
  const currentTime = new Date().toUTCString()
  console.log("info")
  Phonebook.countDocuments({}).then(numberOfEntries => {
    console.log(numberOfEntries);
    const content = `
      <p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${currentTime}</p>
    `
    response.send(content)}

  )})


morgan.token('req-body', (request) => {
  if (request.method === 'POST' && request.body) {
    return JSON.stringify(request.body)
  }
  return '-'
})


const unknownEndpoint = (request, response) => {
  console.log('Unknown endpoint')
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log('ValidationError')
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})