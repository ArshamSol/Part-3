import { useState, useEffect } from 'react'
import personService from './services/persons'

//npm run dev
//npm run server
const Filter = ({ searchTerm, handleSearchTermChange }) =>  {
  return (<div>
  Filter shown with: <input
    value={searchTerm}
    onChange={handleSearchTermChange}
  />
</div>)
}

const PersonForm = ({newName, newPhone, handleNameChange, handlePhoneChange, handleSubmit}) =>  {
  return (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input 
      value={newName}
      onChange={handleNameChange}
      />
    </div>
    
    <div>number: <input  
          value={newPhone}
          onChange={handlePhoneChange}/></div>
    <div>
      <button type="submit" >add</button>
    </div>
  </form>
  )
}

const Persons = ({ persons , handleDeletePerson }) => {
  return (
    <ul>
    {persons.map((person, index) => (
      <li key={index}>{person.name} {person.number} 
      <button onClick={() => handleDeletePerson(person.id)}>Delete</button>
      </li>
    ))}
  </ul>
  )
}

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    backgroundColor: '#4CAF50',
    fontSize: 20
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('')
  
  useEffect(() => {
    personService
    .getAll()
    .then(response => {
        setPersons(response.data)
      })
  }, [])
  
  const showNotification = (message) => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }
  const addPerson = (event) => {
    event.preventDefault()

    // Check if the newName already exists in the phonebook
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook. Replace the old number with a new one?`)
        if (confirmUpdate) {
          // Update the existing person's phone number
          const updatedPerson = { ...existingPerson, number: newPhone }
          personService.update(updatedPerson.id, updatedPerson)
          .then(response => {
          setPersons(persons.map((person) => (person.id === existingPerson.id ? updatedPerson : person)))
          console.log(response)
          showNotification( `Updated ${newName}`)
          setNewName('')
          setNewPhone('')
          }).catch(error => {
            alert(
              `Information of '${newName}' was already deleted from server`
            )
            setNotes(notes.filter(n => n.id !== id))
          })
        }
      
    }
     else {
    personService.create({ name: newName , number: newPhone })
    .then(response => {
      setPersons(persons.concat({ name: newName , number: newPhone }))
      showNotification( `Added ${newName}`)
      setNewName('');
      setNewPhone('');
     
      console.log(response)
    })

      
    }
  }
  

  const filteredPersons = persons.filter((person) =>
  person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id)
  
    const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`)
    if (confirmDelete) {
      
      personService.remove(id).then(response =>{
        setPersons(persons.filter((person) => person.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
      />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
        handleSubmit={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons}
        handleDeletePerson={handleDelete} />
     
    </div>
  )
}

export default App