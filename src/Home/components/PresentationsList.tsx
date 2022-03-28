import { Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, IconButton } from '@mui/material'
import { child, get, ref, remove } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase-config'
import State from '../../stateInterface'
import DeleteIcon from '@mui/icons-material/Delete';

export default function PresentationsList() {
  const user = useSelector((state: State) => state.home.user)
  const [isPresentationsLoading, setIsPresentationsLoading] = useState(false)
  const [presentations, setPresentations] = useState({})
  const navigate = useNavigate()

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
      <Grid container spacing={2}>
        {Object.entries(presentations).map(([id, val]: any) => (
          <Grid item key={id}>
            <Card>
              <CardContent>
                {val.title} | {id}
              </CardContent>
              <CardActions sx={{flexDirection: 'row-reverse'}}>
                <Button variant="contained" onClick={() => navigate(`/presentations/${id}`)}>Edit</Button>
                <IconButton color='error' onClick={() => deletePresentation(id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}