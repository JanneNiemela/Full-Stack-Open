import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries//api/all`)
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {        
        console.log(error.message)
      })
  }, [])

  const filteredCountries = filter.length === 0 ? countries : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (filteredCountries.length === 1 && (!selectedCountry || (selectedCountry && selectedCountry.name.common !== filteredCountries[0].name.common))) {
    setSelectedCountry(filteredCountries[0])
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowInfo = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <form>
        Find countries: <input value={filter} onChange={handleFilterChange} />        
      </form>
      <Countries filteredCountries={filteredCountries} handleShowInfo={handleShowInfo} selectedCountry={selectedCountry}></Countries>
    </div>
  )
}

export default App
