export type PlayerType = {
  name: string
  socketId: string | null
}

export class Player implements PlayerType {
  name: string
  socketId: string | null

  constructor(name: string, socketId: string | null) {
    this.name = name
    this.socketId = socketId
  }
}
