const mongoose = require('mongoose')

const dbUserName = 'jjn90_db_user'

if (process.argv.length < 3) {
  console.log(`Give the password for the user ${dbUserName} as an argument.`)
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://${dbUserName}:${password}@cluster0.g3f492j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const processArgs = () => {
  if (process.argv.length >= 5) {
    addPerson(process.argv[3], process.argv[4])
  }
  else if (process.argv.length === 4) {
    addPerson(process.argv[3])
  }
  else {
    printPersons()
  }
}

const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log('Person saved.')
    mongoose.connection.close()
  })
}

const printPersons = () => {
  console.log('Phonebook:')
  Person.find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}

processArgs()

