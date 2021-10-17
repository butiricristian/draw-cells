export const Actions = {
  TOGGLE_MODAL: 'TOGGLE_MODAL',
}

export const toggleModal = (isOpen: boolean) => ({
  type: Actions.TOGGLE_MODAL,
  payload: isOpen
})
