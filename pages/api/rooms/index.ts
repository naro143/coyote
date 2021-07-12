import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerRequestInstance } from 'utils/request'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const request = getServerRequestInstance()
  const endpoint: string = '/rooms'
  if (req.method === 'GET') {
    await request.get(endpoint).then(({status, data})=>{
      res.status(status).json(data)
    }).catch((error) => {
      res.status(error.response.status).json(error.response.data)
    })
  } else if (req.method === 'POST') {
    await request.post(endpoint, req.body).then(({status, data})=>{
      res.status(status).json(data)
    }).catch((error) => {
      res.status(error.response.status).json(error.response.data)
    })
  }
}
