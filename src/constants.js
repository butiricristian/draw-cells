import React from 'react'

import { ReactComponent as BCell1 } from './assets/cells/b_cell_1.svg'
import { ReactComponent as DendriticCell1 } from './assets/cells/dendritic_cell_1.svg'
import { ReactComponent as DendriticCell2 } from './assets/cells/dendritic_cell_2.svg'
import { ReactComponent as TCell1 } from './assets/cells/t_cell_1.svg'
import { ReactComponent as TCell2 } from './assets/cells/t_cell_2.svg'
import { ReactComponent as Fibroblast1 } from './assets/cells/fibroblast_1.svg'
import { ReactComponent as Macrophage1 } from './assets/cells/macrophage_1.svg'
import { ReactComponent as MhcClassI } from './assets/cells/mhc_class_i.svg'
import { ReactComponent as NaturalKillerCell } from './assets/cells/natural_killer_cell.svg'
// import SvgInline from './Sprites/SvgInline'

export const rightDrawerWidth = 260;
export const bottomDrawerHeight = 240;
export const leftDrawerWidth = 150

export const SPRITE_TO_SVG_ELEMENT_MAP = {
  b_cell_1: (<BCell1 />),
  dendritic_cell_1: (<DendriticCell1 />),
  dendritic_cell_2: (<DendriticCell2 />),
  t_cell_1: (<TCell1 />),
  t_cell_2: (<TCell2 />),
  fibroblast_1: (<Fibroblast1 />),
  macrophage_1: (<Macrophage1 />),
  mhc_class_i: (<MhcClassI />),
  natural_killer_cell: (<NaturalKillerCell />),
}