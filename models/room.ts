import { Player, PlayerType } from "./player";

export type RoomType = {
  name: string
  players: Array<PlayerType>
}

export class Room implements RoomType {
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
