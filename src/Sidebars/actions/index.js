export const Actions = {
  TOGGLE_SPRITES: 'TOGGLE_SPRITES',
  TOGGLE_FRAMES: 'TOGGLE_FRAMES',
  TOGGLE_PROPERTIES: 'TOGGLE_PROPERTIES'
}

export const toggleSprites = () => ({
  type: Actions.TOGGLE_SPRITES,
})

export const toggleFrames = () => ({
  type: Actions.TOGGLE_FRAMES,
})

export const toggleProperties = () => ({
  type: Actions.TOGGLE_PROPERTIES,
})
