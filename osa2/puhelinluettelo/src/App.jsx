import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorNotification, setErrorNotification] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(serverPersons => {
        setPersons(serverPersons)
      })
      .catch(error => {
        displayNotification(`Failed to load persons from the server.`, 3000, true)
        console.log(error.message)
      })
  }, [])
  
  const filteredPersons = filter.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const displayNotification = (message, durationMs, isError) => {
    setErrorNotification(isError)
    setNotification(message)        
    setTimeout(() => {          
      setNotification(null)        
    }, durationMs)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (newName.length === 0) {
      displayNotification("A name must contain at least one character.", 3000, true)
      return
    } 

    const existingPerson = persons.find(p => p.name === newName)
    
    if (existingPerson) {
      if (!confirm(`${newName} is already in the phonebook. Replace the phone number with a new one?`)) {
        return
      }

      existingPerson.phoneNumber = newPhoneNumber
      personService
        .put(existingPerson)
        .then(serverPerson => {
          setPersons(persons.map(p => p.id === serverPerson.id ? serverPerson : p))
          setNewName('')
          setNewPhoneNumber('')
          displayNotification(`Changed ${serverPerson.name}'s phone number to ${serverPerson.phoneNumber}.`, 3000, false)
        })
        .catch(error => {
          displayNotification(`${existingPerson.name}'s information has been deleted from the server.`, 3000, true)          
          console.log(error.message)          
          const index = persons.findIndex(person => person.id === existingPerson.id)
          if (index !== -1) {
            setPersons(persons.toSpliced(index, 1))
          }      
        })
    } 
    else {
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
          displayNotification(`Added ${serverPerson.name}.`, 3000, false)
        })
        .catch(error => {
          displayNotification(`Failed to add a new user.`, 3000, true)
          console.log(error.message)
        })
    }
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
      displayNotification(`Unable to find a person with the id ${id}`, 3000, true)
      return
    }
    else if (!confirm(`Are you sure you want to delete ${persons[index].name}?`)) {
      return
    }
  
    personService
      .del(id)
      .then((deletedPerson) => {
        setPersons(persons.toSpliced(persons.findIndex(person => person.id === deletedPerson.id), 1))
        displayNotification(`Deleted ${deletedPerson.name}.`, 3000, false)
      })
      .catch(error => {
        displayNotification(`The selected user has been already deleted from the server.`, 3000, true)
        console.log(error.message)
        setPersons(persons.toSpliced(index, 1))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={errorNotification}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newPhoneNumber={newPhoneNumber} handlePhoneNumberChange={handlePhoneNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDeletion={deletePerson} />
    </div>
  )
}

export default App
