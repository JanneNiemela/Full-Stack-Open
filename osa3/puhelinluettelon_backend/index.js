const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

const generateRandomId = () => {
  return String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
}

app.get('/info', (request, response) => {
  response.send
  (`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date().toLocaleString()}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(p => p.id === request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(p => p.id !== request.params.id)
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
  else if (persons.find(({ name }) => name === body.name)) {
    return response.status(400).json({
      error: `${body.name} is already on the list. The person's name must be unique.`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId()
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})