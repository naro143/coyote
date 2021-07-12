import axios from "axios"

const serverSideBaseURL = `${process.env.NEXT_PUBLIC_HOST}/server`
const clientSideBaseURL = `${process.env.NEXT_PUBLIC_HOST}/api`

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
