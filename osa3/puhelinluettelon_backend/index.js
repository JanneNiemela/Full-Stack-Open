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

app.get('/info', (request, response, next) => {
  Person.collection.countDocuments()
    .then((count) => {
      response.send
      (`
        <p>Phonebook has info for ${count} people.</p>
        <p>${new Date().toLocaleString()}</p>
      `)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})