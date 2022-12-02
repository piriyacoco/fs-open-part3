const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = `mongodb+srv://ppiriyata:${password}@cluster0.lqugthc.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const dbCon = mongoose.connect(url) // IMPORTANT! O.W. EMPTY RETURN

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // mongoose.connect(url) // IMPORTANT! O.W. EMPTY RETURN
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

// if (process.argv.length < 4) {
//   console.log('Please provide the name as an argument: node mongo.js <password> <name> <number>')
//   process.exit(1)
// }

// if (process.argv.length < 5) {
//   console.log('Please provide the number as an argument: node mongo.js <password> <name> <number>')
//   process.exit(1)
// }

if (process.argv.length === 5) {
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  dbCon
  // mongoose
    // .connect(url)
    .then(() => {
      console.log('connected')

      const person = new Person({
        name: personName,
        number: personNumber,
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${personName} number ${personNumber} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}