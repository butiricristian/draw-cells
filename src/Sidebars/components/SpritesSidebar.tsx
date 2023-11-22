import makeStyles from '@mui/styles/makeStyles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarSprite from '../../Sprites/SidebarSprite';
import State from '../../stateInterface';
import { loadBackgrounds, toggleSprites } from '../actions';
import BaseSidebar from './BaseSidebar';
import { SPRITE_TO_SVG_ELEMENT_MAP } from '../../constants';
import { Accordion, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setCurrentFrameBackground } from '../../Frames/actions';
import { getDownloadURL, ref as storageRef, list } from "firebase/storage";
import { storage } from "../../firebase-config";

const useStyles = makeStyles({
  container: {height: '100%', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', maxHeight: 'calc(80vh)', overflowY: 'auto'},
  sprite: {width: 50, height: 50, cursor: 'pointer'},
  accordion: {width: '100%', boxShadow: 'none', '&.MuiPaper-rounded': {borderRadius: 0}}
})

const SPRITES_LIST = Object.keys(SPRITE_TO_SVG_ELEMENT_MAP)

export default function SpritesSidebar() {
  const dispatch = useDispatch()
  const isSpritesSidebarOpen = useSelector((state: State) => state.sidebars.isSpritesOpen)
  const classes = useStyles()
  const backgrounds = useSelector((state: State) => state.sidebars.backgrounds)

  const handleFrameBackground = (background: string) => {
    dispatch(setCurrentFrameBackground(background))
  }

  useEffect(() => {
    if (!isSpritesSidebarOpen) return

    const getBg = async () => {
      const imageRefs = await list(storageRef(storage, ""), { maxResults: 10 });
      const images = await Promise.all<any>(imageRefs.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return url
      }));
      dispatch(loadBackgrounds(images))
    };

    getBg();
  }, [isSpritesSidebarOpen, dispatch])

  return (
    <>
      <BaseSidebar
        isOpen={isSpritesSidebarOpen}
        toggleOpen={() => dispatch(toggleSprites())}
        iconRenderer={() => isSpritesSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        anchor="left"
      >
        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Sprites
          </AccordionSummary>
          <div className={classes.container}>
            {SPRITES_LIST.map((s, i) => (
              <SidebarSprite key={`sprite-${i}`} backgroundUrl={s} name={s}/>
            ))}
          </div>
        </Accordion>
        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Background Images
          </AccordionSummary>
          <div className={classes.container}>
            {backgrounds?.map((bg: any) => (
              <div onClick={() => handleFrameBackground(bg)}>
                <img src={bg} alt={bg} style={{ width: 50 }}/>
              </div>
            ))}
          </div>
        </Accordion>
      </BaseSidebar>
    </>
  );
}
