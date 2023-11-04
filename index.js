const express = require('express')
const morgan = require('morgan')
//npm start 
//node index.js
//npm run build
const app = express()
app.use(express.json())

app.use(express.static('dist'))

//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

const cors = require('cors')
app.use(cors())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

//app.get('/', (req, res) => {
//  res.send('<h1>Phonebook</h1>')
//})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})


const generateRandomId = () => {
    const min = 10; 
    const max = 999999; 
    return Math.floor(Math.random() * (max - min)+ min);
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("post")

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name and number are required' 
    })
  }

  const duplicatePerson = persons.find(person => person.name === body.name);
  if (duplicatePerson) {
    return response.status(400).json({ error: 'Name must be unique' });
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  console.log("get")
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/delete/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log("delete")
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/info', (request, response) => {
  const currentTime = new Date().toUTCString()
  const numberOfEntries = persons.length

  const content = `
    <p>Phonebook has info for ${numberOfEntries} people</p>
    <p>${currentTime}</p>
  `

  response.send(content)
})

morgan.token('req-body', (request) => {
  if (request.method === 'POST' && request.body) {
    return JSON.stringify(request.body)
  }
  return '-'
})