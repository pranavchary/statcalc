import axios from 'axios';

var request = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000
});

export const getStatList = async () => {
  return request.get('/StatNames')
  .then(res => res.data)
  .catch(err => null);
}

export const getNatureList = async () => {
  return request.get('/Natures')
  .then(res => res.data)
  .catch(err => null);
}

export const getPokemonList = async () => {
  return request.get('/Pokemon')
  .then(res => res.data)
  .catch(err => null);
}
