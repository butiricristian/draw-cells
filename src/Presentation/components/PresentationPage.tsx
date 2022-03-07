import { child, get, ref } from 'firebase/database';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase-config';
import State from '../../stateInterface';
import PresentationContainer from './PresentationContainer';


const PresentationPage = () => {
  const { presentationId } = useParams()
  const user = useSelector((state: State) => state.home.user)

  useEffect(() => {
    const f = async () => {
      const res = await get(child(ref(db), `users/${user.id}`))
      console.log(res)
    }
    f()
  }, [user])

  return (
    <PresentationContainer />
  );
}

export default PresentationPage