import { Button, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { toggleLoginModalOpen } from '../reducers'

export default function Landing(){
  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(toggleLoginModalOpen(true))
  }

  return (
    <Grid container sx={{height: 'calc(100vh - 70px)'}} spacing={4}>
      <Grid item xs={12} lg={5}>
        <Stack sx={{height: "80%", pl: 10, pr: 10, pt: 20}}>
          <Typography variant="h1" fontWeight={600} style={{lineHeight: 1, wordWrap: 'initial'}}>Draw Cells</Typography>
          <Typography variant="h4" color="GrayText" fontWeight={300}>Give life to your cells</Typography>
          <Grid container spacing={2} sx={{mt: 4}}>
            <Grid item xs={12} sm={6}><Button fullWidth variant="contained" size="large" onClick={handleLogin}>Sign up</Button></Grid>
            <Grid item xs={12} sm={6}><Button fullWidth variant="outlined" size="large" onClick={handleLogin}>Log in</Button></Grid>
          </Grid>
        </Stack>
      </Grid>
      <Grid item xs={12} lg={7}>
        <Stack alignItems="center" justifyContent="center" sx={{height: '100%'}}>
          <div style={{position: 'relative'}}>
            <img src={require('../../assets/macbook_mock.png')} alt="Macbook Animation" style={{width: '100%'}}/>
            <video controls style={{position: 'absolute', left: '16.15%', top: '10.45%', width: '67.7%', height: '72.1%', backgroundColor: '#111'}}>
              <source src={require('../../assets/animation_sample_1.mp4')} type="video/mp4"/>
            </video>
          </div>
        </Stack>
      </Grid>
    </Grid>
  )
}