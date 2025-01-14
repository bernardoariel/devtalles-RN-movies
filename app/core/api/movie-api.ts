import axios from 'axios'

export const abrilApi = axios.create({
    baseURL: 'https://abril.arielbernardo.com/api'
})