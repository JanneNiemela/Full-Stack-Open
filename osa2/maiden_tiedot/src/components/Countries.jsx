const Country = ({country, showFullInfo, handleShowInfo}) => {
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

const Countries = ({filteredCountries, handleShowInfo, selectedCountry}) => {
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, please specify another filter.</p>
    )
  }
  else if (selectedCountry) {
    return (    
      <Country key={selectedCountry.name.common} country={selectedCountry} showFullInfo={true} handleShowInfo={handleShowInfo}/>
    )
  }
  else {
    return (
      <>
        {filteredCountries.map(country => 
          <Country key={country.name.common} country={country} showFullInfo={false} handleShowInfo={handleShowInfo}/>
        )} 
      </>
    )
  }
}

export default Countries