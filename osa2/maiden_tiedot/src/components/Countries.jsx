const Country = ({country, showFullInfo}) => {
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
    </div>
  )
}

const Countries = ({filteredCountries}) => {
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, please specify another filter.</p>
    )
  }

  return (
    <>
      {filteredCountries.map(country => 
        <Country key={country.name.common} country={country} showFullInfo={filteredCountries.length === 1}/>
      )} 
    </>
  )
}

export default Countries