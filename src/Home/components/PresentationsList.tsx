import { Button, Card, CardActions, CardContent, Container, Grid } from '@mui/material'
import { child, get, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase-config'

export default function PresentationsList() {

  const [presentations, setPresentations] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      const res = await get(child(ref(db), `presentations`))
      setPresentations(res.val() || {})
    }
    getData()
  }, [])

  return (
    <Container maxWidth={false} sx={{mt: 3}}>
      <Grid container spacing={2}>
        {Object.entries(presentations).map(([id, val]) => (
          <Grid item key={id}>
            <Card>
              <CardContent>
                {id}
              </CardContent>
              <CardActions sx={{flexDirection: 'row-reverse'}}>
                <Button variant="contained" onClick={() => navigate(`/presentations/${id}`)}>Edit</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}