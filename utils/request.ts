import axios from "axios"

const serverSideBaseURL = `http://localhost:3000/server`
const clientSideBaseURL = `http://localhost:3000/api`

const serverRequestInstance = axios.create({
  baseURL: serverSideBaseURL,
  headers: {
    "Content-Type": "application/json"
  }
})
 
const clientRequestInstance = axios.create({
  baseURL: clientSideBaseURL,
  headers: {
    "Content-Type": "application/json"
  }
})

export const getServerRequestInstance = () => {
  return serverRequestInstance
}

export const getClientRequestInstance = () => {
  return clientRequestInstance
}
