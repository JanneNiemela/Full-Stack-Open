import axios from 'axios'
const url = '/api/persons'

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

const put = changedObj => {
  const request = axios.put(`${url}/${changedObj.id}`, changedObj)
  return request.then(response => response.data)
}

export default { getAll, create, del, put }