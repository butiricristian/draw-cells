import { get, ref } from 'firebase/database';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase-config';
import { loadInitialData } from '../../Frames/actions';
import PresentationContainer from './PresentationContainer';


const PresentationPage = () => {
  const dispatch = useDispatch()
  const { presentationId } = useParams()

  // const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // setIsLoading(true)
    const getData = async () => {
      const res = await get(ref(db, `presentations/${presentationId}`))
      dispatch(loadInitialData(res.val()))
      // setIsLoading(false)
    }
    getData()
  }, [presentationId, dispatch])

  return (
    <PresentationContainer />
  );
}

export default PresentationPage