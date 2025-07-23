const Person = ({name, phoneNumber}) => {
  return (
    <p key={name}>{name} {phoneNumber}</p>
  )
}

const Persons = ({filteredPersons}) => {
  return (
    <>
      {filteredPersons.map(person => 
        <Person key={person.name} name={person.name} phoneNumber={person.phoneNumber} />
      )} 
    </>
  )
}

export default Persons