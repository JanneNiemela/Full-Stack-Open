import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
const api_key = import.meta.env.VITE_WEATHER_KEY

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

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

  useEffect(() => {
    if (!selectedCountry) {
      setWeather(null)
      return
    }
    const place = `${selectedCountry.capital},${selectedCountry.cca2}`    
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {        
        console.log(error.message)
      })
  }, [selectedCountry])

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
      <Countries filteredCountries={filteredCountries} handleShowInfo={handleShowInfo} selectedCountry={selectedCountry} weather={weather}></Countries>
    </div>
  )
}

export default App
