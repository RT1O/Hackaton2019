import axios from 'axios'

export const HTTP = axios.create({
  baseUrl: 'http://192.168.2.147:8081',
  proxy: false,
  headers: {
    'content-type': 'application/json'
  }
})
