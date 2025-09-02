require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'));
morgan.token('postReqBodyJson', (req) => JSON.stringify(req.body))
app.use(morgan(':postReqBodyJson', { skip: (req) => req.method !== 'POST' }))

const generateRandomId = () => {
  return String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
}

app.get('/info', (request, response) => {
  Person.collection.countDocuments().then((count) => {
    response.send
    (`
      <p>Phonebook has info for ${count} people.</p>
      <p>${new Date().toLocaleString()}</p>
    `)
  });
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  // TODO: add a delete feature.
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || body.name.length === 0) {
    return response.status(400).json({
      error: `The person's name is missing. Please input a name that is at least one character in length.`
    })
  }
  else if (!body.number || body.number.length === 0) {
    return response.status(400).json({
      error: `The person's number is missing. Please input a name number is at least one character in length.`
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})