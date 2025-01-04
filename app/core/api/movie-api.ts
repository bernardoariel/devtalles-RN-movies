import axios from 'axios'

export const movieApi = axios.create({
    baseURL: 'https://abril.arielbernardo.com/api'
})