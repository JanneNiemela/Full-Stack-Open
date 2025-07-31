const Person = ({name, phoneNumber, id, handleDeletion}) => {
  return (
      <div 
        key={name}>{name} {phoneNumber} 
        <button onClick={()=>handleDeletion(id)}>delete</button>
      </div>
  )
}

const Persons = ({filteredPersons, handleDeletion}) => {
  return (
    <>
      {filteredPersons.map(person => 
        <Person key={person.name} name={person.name} phoneNumber={person.phoneNumber} id={person.id} handleDeletion={handleDeletion}/>
      )} 
    </>
  )
}

export default Persons