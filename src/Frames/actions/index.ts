import { Frame, Position, Sprite } from '../reducers/frames'

export const Actions = {
  SET_CURRENT_FRAME: 'SET_CURRENT_FRAME',
  SET_CURRENT_SPRITE: 'SET_CURRENT_SPRITE',
  UPDATE_CURRENT_SPRITE_POSITION: 'UPDATE_CURRENT_SPRITE_POSITION',
  ADD_SPRITE: 'ADD_SPRITE',
  ADD_FRAME: 'ADD_FRAME',
}

export const addSprite = (sprite: Sprite) => ({
  type: Actions.ADD_SPRITE,
  payload: sprite,
})

export const addFrame = (frame: Frame) => ({
  type: Actions.ADD_FRAME,
  payload: frame,
})

export const setCurrentFrame = (frameId: number | string | null) => ({
  type: Actions.SET_CURRENT_FRAME,
  payload: frameId,
})

export const setCurrentSprite = (spriteId: number | string | null) => ({
  type: Actions.SET_CURRENT_SPRITE,
  payload: spriteId,
})

export const updateCurrentSpritePosition = (spriteId: number | string | null, position: Position) => ({
  type: Actions.UPDATE_CURRENT_SPRITE_POSITION,
  payload: {
    id: spriteId,
    position,
  }
})
