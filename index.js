const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Jenna",
        "number": "+358405412241",
        "id": 1
    },
    {
        "name": "Valtteri",
        "number": "+358456312129",
        "id": 2
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})


const generateId = () => {
    return Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER))
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    
    persons = persons.concat(person)
    
    response.json(person)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
