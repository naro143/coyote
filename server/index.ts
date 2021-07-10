import express, { Request, Response, NextFunction } from 'express'
import {v4 as uuidv4} from 'uuid'
import next from 'next'
import socketio from "socket.io"
import errorHandler, { badRequestException } from './errorException'

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
  name: string
  players: Array<Player>

  constructor(name: string, player: Player) {
    this.name = name
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
    server.use(express.json());

    // global state
    const rooms: Array<Room> = []

    // api
    // ルーム一覧を取得
    server.get('/get-rooms', (req: Request, res: Response) => {
      console.log('body', req.body)

      res.status(200).json({rooms: rooms})
    })

    // ルームを作成
    server.post('/create-room', (req: Request, res: Response, next: NextFunction) => {
      console.log('body', req.body)

      // 同じ名前のルームが既にあるときはエラー
      const room: Room = rooms.find(room => room.name == req.body.roomName)!
      if(room != null) {
        return next( badRequestException('同じ名前のルームが既に存在しています。別の名前でルームを作成してください。') )
      }

      const newPlayer: Player = new Player(req.body.playerName)
      const newRoomName: string = req.body.roomName
      const newRoom: Room = new Room(newRoomName, newPlayer)
      rooms.push(newRoom)

      postIO(rooms)
      res.sendStatus(200)
    })

    // ルームに参加
    server.post('/join-room', (req: Request, res: Response, next: NextFunction) => {
      console.log('body', req.body)
      
      // ルームが見つからないときはエラー
      const room: Room = rooms.find(room => room.name == req.body.roomName)!
      if (room == null) {
        return next( badRequestException('入力した名前のルームが見つかりません。') )
      }

      // ルームに同じ名前のプレイヤーがいるときはエラー
      const player: Player = room.players.find(player => player.name == req.body.playerName)!
      if (player != null) {
        return next( badRequestException('同じ名前のプレイヤーがルーム内に既に存在しています。別のプレイヤー名でルームに参加してください。') )
      }

      const newPlayer: Player = new Player(req.body.playerName)
      room.joinPlayer(newPlayer)
      
      postIO(room)
      res.sendStatus(200)
    })

    server.all('*', async (req: Request, res: Response) => {
      return handle(req, res)
    })

    server.use(errorHandler)

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
