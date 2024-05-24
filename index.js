const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/', (req, resp) => {
  resp.send('Hello, world!')
})

app.get('/api/persons', (req, resp) => {
  resp.json(persons)
})

app.get('/info', (req, resp) => {
  const date = new Date()
  const numbOPersons = persons.length
  resp.send(`Phonebook has info for ${numbOPersons} people on ${date}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((person) => person.id === id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0
  return maxId + 1
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  const names = persons.map((person) => person.name)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing',
    })
  } else if (names.find((name) => body.name === name)) {
    return res.status(400).json({
      error: 'name already in the list',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  console.log(person)
  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
