

const mongoose = require('mongoose')

// const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI

console.log('connecting to', url)

const dbCon = mongoose.connect(url) // IMPORTANT! O.W. EMPTY RETURN

dbCon.then(() => {
  console.log('connected to MongoDB')
})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: ((v) => /^\d{2,3}-\d+$/.test(v)),
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Obj -> string just to be safe
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)