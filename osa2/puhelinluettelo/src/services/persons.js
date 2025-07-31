import axios from 'axios'
const url = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(url)
  return request.then(response => response.data)
}

const create = newObj => {
  const request = axios.post(url, newObj)
  return request.then(response => response.data)
}
const del = id => {
  const request = axios.delete(`${url}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, del }