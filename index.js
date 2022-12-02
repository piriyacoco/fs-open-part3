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
    	"id": 10,
    	"name": "test",
    	"number": "00-00"
    }
]

// dotenv for password

require('dotenv').config() // MUST COME BEFORE PERSON


// MONGO

const Person = require('./models/person')

// EXPRESS
const express = require('express')
const app = express()
app.use(express.json()) // middleware REQUIRE FOR POSTING, MUST COME VERY FIRST, OW OTHERS BROKE
app.use(express.static('build')) // for serving static files from backend

// CORS
const cors = require('cors')
app.use(cors())

// MORGAN
const morgan = require('morgan')
// app.use(morgan('tiny')) // FOR 3.7
morgan.token('body', function (req, res) { return JSON.stringify(req.body) }) // FOR 3.8 (if [object Object] -> must stringify)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // FOR 3.8

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response, next) => { // next move on to next route or middleware (w/o param) or to error handler (w/ param)
	// const id = Number(request.params.id)

	// const person = persons.find(person => person.id == id)

	// if (person) {
	// 	response.json(person)
	// }
	// else {
	// 	response.status(404).end()
	// }

	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person)
		}
		else {
			response.state(404).end()
		}
	})
	.catch(error => {
		next(error)
		// console.log(error)
		// response.status(400).send({ error: 'malformatted id' })
		// response.status(500).end()
	})

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true }) // event handler call modified doc instead of original
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	// const id = Number(request.params.id)

	// persons = persons.filter(person => person.id != id)

	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
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

	// const person = {
	// 	id: persons.length > 0
	// 		? Math.floor(Math.random() * 10) + Math.max(...persons.map(personHere => personHere.id)) + 1
	// 		: 0,
	// 	name: body.name,
	// 	number: body.number
	// }

	// persons = persons.concat(person)

	// response.json(person)

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.get('/info', (request, response) => {
	const todayDate = new Date()

	Person.find({}).then(persons => {
		response.send(`Phonebook has info for ${persons.length} people<br/>${todayDate}`)
	})
})

// MAKE SERVER

const PORT = process.env.PORT || 3001 // process.env.PORT for deployment, fall back to 3001 if necessary

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint MUST COME PEN-ULTIMATE NEXT TO ERROR
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this HAS TO be the last loaded middleware!!
app.use(errorHandler)
