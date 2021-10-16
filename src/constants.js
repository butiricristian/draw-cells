import React from 'react'
import {ReactComponent as BCell1} from './assets/b_cell_1.svg'
import {ReactComponent as DendriticCell1} from './assets/dendritic_cell_1.svg'
import {ReactComponent as DendriticCell2} from './assets/dendritic_cell_2.svg'
import {ReactComponent as TCell1} from './assets/t_cell_1.svg'
import {ReactComponent as TCell2} from './assets/t_cell_2.svg'

export const drawerWidth = 240;
export const bottomDrawerHeight = 240;

export const SPRITE_TO_SVG_ELEMENT_MAP = {
  b_cell_1: (<BCell1 />),
  dendritic_cell_1: (<DendriticCell1 />),
  dendritic_cell_2: (<DendriticCell2 />),
  t_cell_1: (<TCell1 />),
  t_cell_2: (<TCell2 />),
}