export type PlayerType = {
  name: string
}

export class Player implements PlayerType {
  name: string

  constructor(name: string) {
    this.name = name
  }
}
