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

export const rightDrawerWidth = 300;
export const bottomDrawerHeight = 240;
export const leftDrawerWidth = 150

export const OFFSET = 200
export const VIEWPORT_WIDTH = 810
export const VIEWPORT_HEIGHT = 540

export const SPRITE_TO_SVG_ELEMENT_MAP = {
  b_cell_1: (<BCell1 id="b_cell_1" />),
  dendritic_cell_1: (<DendriticCell1 id="dendritic_cell_1" />),
  dendritic_cell_2: (<DendriticCell2 id="dendritic_cell_2" />),
  t_cell_1: (<TCell1 id="t_cell_1" />),
  t_cell_2: (<TCell2 id="t_cell_2" />),
  fibroblast_1: (<Fibroblast1 id="fibroblast_1" />),
  macrophage_1: (<Macrophage1 id="macrophage_1" />),
  mhc_class_i: (<MhcClassI id="mhc_class_i" />),
  natural_killer_cell: (<NaturalKillerCell id="natural_killer_cell" />),
}
