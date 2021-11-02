import { Frame, Position, Sprite } from '../reducers/frames'

export const Actions = {
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
  ADD_CURRENT_SPRITE: 'ADD_CURRENT_SPRITE',
}

export const addSprite = (sprite: Sprite) => ({
  type: Actions.ADD_SPRITE,
  payload: sprite,
})

export const updateSprite = ({id, field, value}: any) => ({
  type: Actions.UPDATE_SPRITE,
  payload: {id, field, value},
})

export const removeSprite = (id: number | string) => ({
  type: Actions.REMOVE_SPRITE,
  payload: {id},
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

export const updateCurrentSpritePosition = (spriteId: number | string | null, position: Position) => ({
  type: Actions.UPDATE_CURRENT_SPRITE_POSITION,
  payload: {
    id: spriteId,
    position,
  }
})
