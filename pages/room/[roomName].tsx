import React, { useState, useEffect } from 'react'
import { InferGetServerSidePropsType } from 'next'
import styled from 'styled-components'
import io from 'socket.io-client'
import { Container, Box, Paper } from '@material-ui/core'
import { getClientRequestInstance } from 'utils/request'
import { useRouter } from 'next/router'
import { PlayerType } from 'models/player'

type ContainerProps = InferGetServerSidePropsType<typeof getServerSideProps>

export async function getServerSideProps({ query }: {query: any}) {
  const roomName = query.roomName
  const request = getClientRequestInstance()
  const response = await request.get(`/rooms/${roomName}/players`)
  const players: Array<PlayerType> = response.data.players

  return {
    props: {
      players,
    },
  }
}

const Room = (props: ContainerProps) => {
  const router = useRouter()
  const { roomName, playerName } = router.query
  const [socket, _] = useState(() => io())
  const [isConnected, setIsConnected] = useState(false)
  const [players, setPlayers] = useState<PlayerType[]>(props.players)

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected!!')
      socket.emit('setSocketId', { roomName: roomName, playerName: playerName })
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected!!')
      setIsConnected(false)
    })
    socket.on('update-data', (newData: Array<PlayerType>) => {
      console.log('Get Updated Data', newData)
      setPlayers(newData)
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <StyledComponent
      {...props}
      isConnected={isConnected}
      roomName={roomName}
      players={players}
    />
  )
}

type Props = ContainerProps & {
  className?: string
  isConnected: boolean
  roomName: string | string[] | undefined
  players: Array<PlayerType>
}

const Component = (props: Props) => (
  <Container maxWidth="sm" className={props.className}>
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flexGrow={1} py={1} overflow="hidden" display="flex" flexDirection="column" justifyContent="center">
        <h1>{props.roomName}の参加者</h1>
        {props.players.map((player, index) => (
          <Paper key={index} variant="outlined">
            <Box display="flex" p={1}>
              <p>{player.name}</p>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  </Container>
)

const StyledComponent = styled(Component)``

export default Room
