"use client"

import { Edit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material'
import { child, get, push, ref, remove, set } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { db } from '../../firebase-config'
import State from '../../stateInterface'

export const getServerSideProps = async () => {
  return {
    props: {}
  }
}

export default function PresentationsList() {
  const user = useSelector((state: State) => state.home.user)
  const [isPresentationsLoading, setIsPresentationsLoading] = useState(false)
  const [presentations, setPresentations] = useState({})
  const router = useRouter()

  const handleNewPresentation = async () => {
    if(!user) return
    const newPresKey = push(child(ref(db), 'presentations')).key
    set(ref(db, `/presentations/${newPresKey}`), {user_id: user.uid, title: 'New Presentation'})
    set(ref(db, `/user-presentations/${user.uid}/${newPresKey}`), {title: 'New Presentation'})
    router.push(`/presentations/${newPresKey}`)
  }

  useEffect(() => {
    setIsPresentationsLoading(true)
    const getData = async () => {
      try {
        if (!user) {
          setPresentations({})
          return
        }
        const res = await get(child(ref(db), `/user-presentations/${user.uid}`))
        setPresentations(res.val() || {})
      } catch(err) {
        console.error(err)
      } finally {
        setIsPresentationsLoading(false)
      }
    }
    getData()
  }, [user])

  const deletePresentation = async (presId: string) => {
    if (!user) return
    await remove(ref(db, `/presentations/${presId}`))
    await remove(ref(db, `/user-presentations/${user.uid}/${presId}`))
    const res = await get(child(ref(db), `/user-presentations/${user.uid}`))
    setPresentations(res.val() || {})
  }

  return (
    <Container maxWidth={false} sx={{mt: 3}}>
      {isPresentationsLoading && <CircularProgress /> }
      <Typography variant="h5" sx={{mb: 2}}>My Presentations</Typography>
      {Object.entries(presentations).length > 0 && (
        <Grid container spacing={2}>
          {Object.entries(presentations).map(([id, val]: any) => (
            <Grid item key={id} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5"><b>{val.title}</b></Typography>
                  <Typography variant="body2" color="GrayText">{id}</Typography>
                </CardContent>
                <CardActions>
                  <Stack direction="row-reverse" spacing={2} width="100%">
                    <Button variant="contained" onClick={() => router.push(`/presentations/${id}`)} startIcon={<Edit fontSize="small" />}>
                      Edit
                    </Button>
                    <Button variant="outlined" color='error' onClick={() => deletePresentation(id)} startIcon={<DeleteIcon fontSize="small" />}>
                      Delete
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {Object.entries(presentations).length <= 0 && (
        <Grid container spacing={1} alignItems="center" direction="column">
          <Grid item><Typography variant="subtitle1"><i>You haven't created any presentation yet.</i></Typography></Grid>
          <Grid item><Button color="primary" variant="contained" onClick={handleNewPresentation}>Create new presentation</Button></Grid>
        </Grid>
      )}
    </Container>
  )
}
