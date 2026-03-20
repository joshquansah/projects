import axios from 'axios'
const baseUrl = "http://127.0.0.1:8000/stats/39"
const getTable = (season) => {
    return axios.get(`${baseUrl}/${season}/table`)
    .then(response => response.data) 
}
const getGoals = (season) => {
    return axios.get(`${baseUrl}/${season}/goals`)
    .then(response => response.data) 
}
const getHomeAway = (season) => {
    return axios.get(`${baseUrl}/${season}/homevsaway`)
    .then(response => response.data) 
}
const getForm = (season) => {
    return axios.get(`${baseUrl}/${season}/form`)
    .then(response => response.data) 
}
const getPatterns = (season) => {
    return axios.get(`${baseUrl}/${season}/patterns`)
    .then(response => response.data) 
}

export default {
    getTable,
    getGoals,
    getHomeAway,
    getForm,
    getPatterns
}