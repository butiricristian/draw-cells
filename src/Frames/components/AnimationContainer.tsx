import * as htmlToImage from 'html-to-image';
import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../stateInterface';
import { setCurrentFrame, updateCurrentSpritePosition } from '../actions';
import { Frame } from '../reducers/frames';

interface AnimationContainerProps {
  frame: Frame,
}

function sleep (time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


const createPicture = async (frame: Frame, dispatch: Dispatch<any>) => {
  const mainCanvas = document.getElementById("main-canvas") || new HTMLElement()
  const previewCanvas = document.getElementById("preview-canvas")

  return htmlToImage.toPng(mainCanvas)
    .then((dataUrl) => {
      const oldImage = document.getElementById("image") || new Image()
      const img = new Image();
      img.src = dataUrl;
      img.id = "image"
      img.style.height = "100%"
      img.style.width = "100%"
      previewCanvas?.replaceChild(img, oldImage);
    })
}

export default function AnimationContainer() {
  const dispatch = useDispatch()
  const frame = useSelector((state: State) => state.frames.currentFrame)
  useEffect(() => {
    createPicture(frame, dispatch)
    sleep(300).then(() => dispatch(setCurrentFrame((parseInt(String(frame.id))) % 3 + 1)))
  }, [frame])

  return (
    <div style={{width: '100%', height: '100%'}} id="preview-canvas">
      <div id="image"></div>
    </div>
  );
}
