const Country = ({country, showFullInfo, handleShowInfo, weather}) => {
  if (showFullInfo) {
    const languages = Object.values(country.languages).map((v, k) => <li key={k}>{v}</li>)
    return (
      <div key={country.name.common}>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h1>Languages</h1>
        <ul>{languages}</ul>
        <img src={country.flags['png']} alt={country.flags['alt']} width="320" height="196" />
        <Weather country={country} weather={weather}></Weather>
      </div>
    )
  }

  return (
    <div 
      key={country.name.common}>{country.name.common} 
      <button onClick={()=>handleShowInfo(country)}>Show</button>
    </div>
  )
}

const Weather = ({country, weather}) => {
  if (!country || !weather) {
    return (
      <></>
    )
  }

  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  return (
    <>
      <h1>Weather in {country.capital}</h1>
      <p>Temperature: {weather.main.temp} Celsius</p>
      <img src={weatherIconUrl} alt={'A weather icon.'} width="100" height="100" />  
      <p>Wind: {weather.wind.speed} m/s</p>
    </>
  )
}

const Countries = ({filteredCountries, handleShowInfo, selectedCountry, weather}) => {
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, please specify another filter.</p>
    )
  }
  else if (selectedCountry) {
    return (    
      <Country key={selectedCountry.name.common} country={selectedCountry} showFullInfo={true} handleShowInfo={handleShowInfo} weather={weather} />
    )
  }
  else {
    return (
      <>
        {filteredCountries.map(country => 
          <Country key={country.name.common} country={country} showFullInfo={false} handleShowInfo={handleShowInfo} weather={weather} />
        )} 
      </>
    )
  }
}

export default Countries