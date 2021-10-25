export const Actions = {
  SET_CANVAS_SCALE: 'SET_CANVAS_SCALE'
}

export const zoomIn = () => ({
  type: Actions.SET_CANVAS_SCALE,
  payload: {scaleIncrease: 0.001},
})

export const zoomOut = () => ({
  type: Actions.SET_CANVAS_SCALE,
  payload: {scaleIncrease: -0.001},
})