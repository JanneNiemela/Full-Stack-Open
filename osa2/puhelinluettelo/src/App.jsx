import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(serverPersons => {
        setPersons(serverPersons)
      })
  }, [])

  const filteredPersons = filter.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()

    if (newName.length === 0) {
      alert("a name must contain at least one character")
      return
    }
    else if (persons.find(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const person = {
      name: newName,
      phoneNumber: newPhoneNumber
    }

    personService
      .create(person)
      .then(serverPerson => {
        setPersons(persons.concat(serverPerson))
        setNewName('')
        setNewPhoneNumber('')
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const deletePerson = (id) => {
    const index = persons.findIndex(person => person.id === id)
    if (index === -1) {
      console.log(`Unable to find a person with the id ${id}`)
      return
    }
    else if (!confirm(`Are you sure you want to delete ${persons[index].name}?`)) {
      return
    }
  
    personService
      .del(id)
      .then(() => {
        setPersons(persons.toSpliced(index, 1))
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>    
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newPhoneNumber={newPhoneNumber} handlePhoneNumberChange={handlePhoneNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDeletion={deletePerson} />
    </div>
  )
}

export default App
