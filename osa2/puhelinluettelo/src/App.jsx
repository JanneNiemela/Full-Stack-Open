import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phoneNumber: '040-123456' },
    { name: 'Ada Lovelace', phoneNumber: '39-44-5323523' },
    { name: 'Dan Abramov', phoneNumber: '12-43-234345' },
    { name: 'Mary Poppendieck', phoneNumber: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')

  const filteredPersons = filter.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const person = {
      name: newName,
      phoneNumber: newPhoneNumber
    }
    setPersons(persons.concat(person))
    setNewName('')
    setNewPhoneNumber('')
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

  return (
    <div>
      <h2>Phonebook</h2>    
      <div>filter shown with: <input value={filter} onChange={handleFilterChange} /></div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>    
        <div>number: <input value={newPhoneNumber} onChange={handlePhoneNumberChange} /></div>      
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map(person => 
        <p key={person.name}>{person.name} {person.phoneNumber}</p>
      )} 
    </div>
  )
}

export default App
