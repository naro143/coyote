import express, { Request, Response } from 'express'
import {v4 as uuidv4} from 'uuid'
import bodyParser from 'body-parser'
import next from 'next'
import socketio from "socket.io"

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

class Player {
  name: string
  
  constructor(name: string) {
    this.name = name
  }
}

class Room {
  id: string
  players: Array<Player>

  constructor(id: string, player: Player) {
    this.id = id
    this.players = [player]
  }

  joinPlayer(player: Player) {
    this.players.push(player)
  }
}

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(bodyParser())

    // global state
    const rooms: Array<Room> = []

    // api
    // ルーム一覧を取得
    server.get('/get-rooms', (req: Request, res: Response) => {
      console.log('body', req.body)
      
      res.status(200).json({rooms: rooms})
    })

    // ルームを作成
    server.post('/create-room', (req: Request, res: Response) => {
      console.log('body', req.body)

      const newPlayer: Player = new Player(req.body.playerName)
      const newRoomId: string = uuidv4()
      const newRoom: Room = new Room(newRoomId, newPlayer)
      
      postIO(rooms)
      res.sendStatus(200)
    })

    // ルームに参加
    server.post('/join-room', (req: Request, res: Response) => {
      console.log('body', req.body)
      
      const room: Room = rooms.find(room => room.id == req.body.roomId)!

      if (room == null) res.sendStatus(400)

      const newPlayer: Player = new Player(req.body.playerName)
      room.joinPlayer(newPlayer)
      
      postIO(room)
      res.sendStatus(200)
    })

    server.all('*', async (req: Request, res: Response) => {
      return handle(req, res)
    })

    const httpServer = server.listen(port, (err?: any) => {
      if (err) throw err
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`)
    })

    const io = new socketio.Server(httpServer)

    io.on('connection', (socket: socketio.Socket) => {
      console.log('id: ' + socket.id + ' is connected')
    })

    // クライアントにデータを送信
    const postIO = (data: any) => {
      io.emit('update-data', data)
    }
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
