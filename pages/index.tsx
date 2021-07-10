import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Container, Box, InputBase, Button } from '@material-ui/core'
import { Pets, MeetingRoom, PlusOne } from '@material-ui/icons'
import { grey, red } from '@material-ui/core/colors'

type ContainerProps = {}

const Home = (props: ContainerProps) => {
  const router = useRouter()
  const [roomName, setRoomName] = useState<string>('')
  const [playerName, setPlayerName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (action: string) => {
    const res = await fetch(location.href + `${action}-room`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomName,
        playerName,
      })
    })
    
    if (res.ok) {
      console.log('ok')
      setErrorMessage('')
    } else {
      console.log('error!')
      const res_json = await res.json()
      setErrorMessage(res_json.message)
    }
  }

  return (
    <StyledComponent
      {...props}
      roomName={roomName}
      setRoomName={setRoomName}
      playerName={playerName}
      setPlayerName={setPlayerName}
      handleSubmit={handleSubmit}
      errorMessage={errorMessage}
    />
  )
}

type Props = ContainerProps & {
  className?: string
  roomName: string
  setRoomName: (value: string) => void
  playerName: string
  setPlayerName: (value: string) => void
  handleSubmit: (action: string) => void
  errorMessage: string
}

const Component = (props: Props) => (
  <Container maxWidth="sm" className={props.className}>
    <Box height="100vh" display="flex">
      <Box flexGrow={1} overflow="hidden" display="flex" flexDirection="column" justifyContent="center">
        <h1><Pets/>コヨーテ<Pets/></h1>
        <Box display="flex" marginBottom={2} p={1} border={1} borderRadius={5} borderColor={grey[500]}>
          <InputBase
            required
            placeholder="プレイヤー名を入力してください。"
            value={props.playerName}
            onChange={(e) => props.setPlayerName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box display="flex" marginBottom={2} p={1} border={1} borderRadius={5} borderColor={grey[500]}>
          <InputBase
            required
            placeholder="ルーム名を入力してください。"
            value={props.roomName}
            onChange={(e) => props.setRoomName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box flex={1} marginRight={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              disabled={!(props.playerName && props.roomName)}
              endIcon={<MeetingRoom/>}
              onClick={() => props.handleSubmit('join')}
              fullWidth
            >
              ルームに参加する
            </Button>
          </Box>
          <Box flex={1} marginLeft={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              disabled={!(props.playerName && props.roomName)}
              endIcon={<PlusOne/>}
              onClick={() => props.handleSubmit('create')}
              fullWidth
            >
              ルームを作成する
            </Button>
          </Box>
        </Box>
        <Box display={props.errorMessage.length == 0 ? 'none' : 'block'} p={1} marginTop={2} color={red} bgcolor={red[100]} border={1} borderRadius={5} borderColor={red}>
          {props.errorMessage}
        </Box>
      </Box>
    </Box>
  </Container>
)

const StyledComponent = styled(Component)``

export default Home
