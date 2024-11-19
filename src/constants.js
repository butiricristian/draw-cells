import React from "react";

import BCell1 from "../public/assets/cells/b_cell_1.svg";
import Basophil from "../public/assets/cells/basophil.svg";
import DendriticCell1 from "../public/assets/cells/dendritic_cell_1.svg";
import DendriticCell2 from "../public/assets/cells/dendritic_cell_2.svg";
import TCell1 from "../public/assets/cells/t_cell_1.svg";
import TCell2 from "../public/assets/cells/t_cell_2.svg";
import Fibroblast1 from "../public/assets/cells/fibroblast_1.svg";
import Macrophage1 from "../public/assets/cells/macrophage_1.svg";
import MhcClassI from "../public/assets/cells/mhc_class_i.svg";
import MhcClassII from "../public/assets/cells/mhc_class_ii.svg";
import Monocyte from "../public/assets/cells/monocyte.svg";
import NaturalKillerCell2 from "../public/assets/cells/natural_killer_cell_2.svg";
import NaturalKillerCell from "../public/assets/cells/natural_killer_cell.svg";
import Neutrophil from "../public/assets/cells/neutrophil.svg";
// import SvgInline from './Sprites/SvgInline'

export const rightDrawerWidth = 300;
export const bottomDrawerHeight = 240;
export const leftDrawerWidth = 150;

export const OFFSET = 200;
export const VIEWPORT_WIDTH = 810;
export const VIEWPORT_HEIGHT = 540;

export const SPRITE_TO_SVG_ELEMENT_MAP = {
  b_cell_1: <BCell1 id="b_cell_1" />,
  basophil: <Basophil id="basophil" />,
  dendritic_cell_1: <DendriticCell1 id="dendritic_cell_1" />,
  dendritic_cell_2: <DendriticCell2 id="dendritic_cell_2" />,
  t_cell_1: <TCell1 id="t_cell_1" />,
  t_cell_2: <TCell2 id="t_cell_2" />,
  fibroblast_1: <Fibroblast1 id="fibroblast_1" />,
  macrophage_1: <Macrophage1 id="macrophage_1" />,
  mhc_class_i: <MhcClassI id="mhc_class_i" />,
  mhc_class_ii: <MhcClassII id="mhc_class_ii" />,
  monocyte: <Monocyte id="monocyte" />,
  natural_killer_cell_2: <NaturalKillerCell2 id="natural_killer_cell_2" />,
  natural_killer_cell: <NaturalKillerCell id="natural_killer_cell" />,
  neutrophil: <Neutrophil id="neutrophil" />,
};
