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
    },
    {
    	"id": 5,
    	"name": "test",
    	"number": "00-00-0000000"
    }
]

// EXPRESS
const express = require('express')
const app = express()
app.use(express.json()) // middleware REQUIRE FOR POSTING

// MORGAN
const morgan = require('morgan')
// app.use(morgan('tiny')) // FOR 3.7
morgan.token('body', function (req, res) { return JSON.stringify(req.body) }) // FOR 3.8 (if [object Object] -> must stringify)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // FOR 3.8

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	
	const person = persons.find(person => person.id == id)

	if (person) {
		response.json(person)
	}
	else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)

	persons = persons.filter(person => person.id != id)

	response.status(204).end()
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name) {
		response.status(400).json({
			error: 'name missing'
		})
	}

	if (!body.number) {
		response.status(400).json({
			error: 'number missing'
		})
	}

	if (persons.map(person => person.name).includes(body.name)) {
		response.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		id: persons.length > 0
			? Math.floor(Math.random() * 10) + Math.max(...persons.map(personHere => personHere.id)) + 1
			: 0,
		name: body.name,
		number: body.number
	}

	persons = persons.concat(person)

	response.json(person)
})

app.get('/info', (request, response) => {
	const todayDate = new Date()

	response.send(`Phonebook has info for ${persons.length} people<br/>${todayDate}`)
})

// MAKE SERVER

const PORT = 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
