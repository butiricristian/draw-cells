import { Frame, Sprite } from '../reducers/frames'

export const Actions = {
  SET_INITIAL_DATA: 'SET_INITIAL_DATA',
  SET_CURRENT_FRAME: 'SET_CURRENT_FRAME',
  SET_CURRENT_SPRITE: 'SET_CURRENT_SPRITE',
  UPDATE_CURRENT_SPRITE_POSITION: 'UPDATE_CURRENT_SPRITE_POSITION',
  ADD_SPRITE: 'ADD_SPRITE',
  ADD_FRAME: 'ADD_FRAME',
  REMOVE_FRAME: 'REMOVE_FRAME',
  NEXT_FRAME: 'NEXT_FRAME',
  PREV_FRAME: 'PREV_FRAME',
  UPDATE_SPRITE: 'UPDATE_SPRITE',
  REMOVE_SPRITE: 'REMOVE_SPRITE',
  REMOVE_CURRENT_SPRITES: 'REMOVE_CURRENT_SPRITES',
  REMOVE_SPRITE_FROM_ALL_FRAMES: 'REMOVE_SPRITE_FROM_ALL_FRAMES',
  REMOVE_CURRENT_SPRITES_FROM_ALL_FRAMES: 'REMOVE_CURRENT_SPRITES_FROM_ALL_FRAMES',
  COPY_SPRITE_INTO_FRAME: 'COPY_SPRITE_INTO_FRAME',
  COPY_SELECTED_SPRITES_INTO_FRAME: 'COPY_SELECTED_SPRITES_INTO_FRAME',
  ADD_CURRENT_SPRITE: 'ADD_CURRENT_SPRITE',
  UPDATE_PRESENTATION_TITLE: 'UPDATE_PRESENTATION_TITLE',
  SET_IS_FRAMES_SAVING: 'SET_IS_FRAMES_SAVING'
}

export const loadInitialData = (payload: any) => ({
  type: Actions.SET_INITIAL_DATA,
  payload
})

export const addSprite = (sprite: Sprite) => ({
  type: Actions.ADD_SPRITE,
  payload: sprite,
})

export const updateSprite = ({field, value}: any) => ({
  type: Actions.UPDATE_SPRITE,
  payload: {field, value},
})

export const removeSprite = (id: number | string) => ({
  type: Actions.REMOVE_SPRITE,
  payload: {id},
})

export const removeCurrentSprites = () => ({
  type: Actions.REMOVE_CURRENT_SPRITES,
})

export const removeSpriteFromAllFrames = (id: number | string) => ({
  type: Actions.REMOVE_SPRITE_FROM_ALL_FRAMES,
  payload: {id},
})

export const removeCurrentSpritesFromAllFrames = () => ({
  type: Actions.REMOVE_CURRENT_SPRITES_FROM_ALL_FRAMES,
})

export const copySpriteIntoFrame = (spriteId: number | string, frameId: number | string) => ({
  type: Actions.COPY_SPRITE_INTO_FRAME,
  payload: {spriteId, frameId},
})

export const copySelectedSpriteSIntoFrame = (frameId: number | string) => ({
  type: Actions.COPY_SELECTED_SPRITES_INTO_FRAME,
  payload: {frameId},
})

export const addFrame = (frame: Frame) => ({
  type: Actions.ADD_FRAME,
  payload: frame,
})

export const nextAnimationFrame = () => ({
  type: Actions.NEXT_FRAME,
})

export const prevAnimationFrame = () => ({
  type: Actions.PREV_FRAME,
})

export const removeFrameById = ({id}: any) => ({
  type: Actions.REMOVE_FRAME,
  payload: {id},
})

export const setCurrentFrame = (frameId: number | string | null) => ({
  type: Actions.SET_CURRENT_FRAME,
  payload: frameId,
})

export const setCurrentSprite = (spriteId: number | string | null) => ({
  type: Actions.SET_CURRENT_SPRITE,
  payload: spriteId,
})

export const addCurrentSprite = (spriteId: number | string | null) => ({
  type: Actions.ADD_CURRENT_SPRITE,
  payload: spriteId,
})

export const updateCurrentSpritePosition = (spriteId: number | string | null, deltaX: number | undefined, deltaY: number | undefined) => ({
  type: Actions.UPDATE_CURRENT_SPRITE_POSITION,
  payload: {
    id: spriteId,
    deltaX,
    deltaY,
  }
})

export const updatePresentationTitle = (title: string) => ({
  type: Actions.UPDATE_PRESENTATION_TITLE,
  payload: title
})

export const setIsFramesSaving = (value: boolean) => ({
  type: Actions.SET_IS_FRAMES_SAVING,
  payload: value
})