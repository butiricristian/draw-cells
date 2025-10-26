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
import TCR1 from "../public/assets/cells/TCR_1.svg";
import TCR2 from "../public/assets/cells/TCR_2.svg";
import BCRIgADimer from "../public/assets/cells/BCR_IgA_Dimer.svg";
import BCRIgA from "../public/assets/cells/BCR_IgA.svg";
import BCRIgD from "../public/assets/cells/BCR_IgD.svg";
import BCRIgE from "../public/assets/cells/BCR_IgE.svg";
import BCRIgE2 from "../public/assets/cells/BCR_IgE_2.svg";
import BCRIgGFlexible1 from "../public/assets/cells/BCR_IgG_flexible_1.svg";
import BCRIgGFlexible2 from "../public/assets/cells/BCR_IgG_flexible_2.svg";
import BCRIgG from "../public/assets/cells/BCR_IgG.svg";
import BCRIgMMonomer from "../public/assets/cells/BCR_IgM_monomer.svg";
import BCRIgMPentamer from "../public/assets/cells/BCR_IgM_pentamer.svg";
import BCRIgMPentamer2 from "../public/assets/cells/BCR_IgM_pentamer_2.svg";
import UpworkCell1 from "../public/assets/cells/upwork_cell_1.svg";
import UpworkCell3 from "../public/assets/cells/upwork_cell_3.svg";
import UpworkCell4 from "../public/assets/cells/upwork_cell_4.svg";
// import SvgInline from './Sprites/SvgInline'

export const rightDrawerWidth = 300;
export const bottomDrawerHeight = 240;
export const leftDrawerWidth = 300;

export const OFFSET = 200;
export const VIEWPORT_WIDTH = 810;
export const VIEWPORT_HEIGHT = 540;

export const SPRITE_TO_SVG_ELEMENT_MAP = {
  "Immune cells": {},
  "Lab animals": {},
  "Lab icons": {},
  Organs: {},
  "Structural cells": {},
};

// export const SPRITE_TO_SVG_ELEMENT_MAP = {
//   b_cell_1: { name: "B Cell 1", tags: ["Cell"], svg: <BCell1 id="b_cell_1" /> },
//   basophil: {
//     name: "Basophil",
//     tags: ["Cell"],
//     svg: <Basophil id="basophil" />,
//   },
//   dendritic_cell_1: {
//     name: "Dendritic Cell 1",
//     tags: [],
//     svg: <DendriticCell1 id="dendritic_cell_1" />,
//   },
//   dendritic_cell_2: {
//     name: "Dendritic Cell 2",
//     tags: [],
//     svg: <DendriticCell2 id="dendritic_cell_2" />,
//   },
//   t_cell_1: { name: "T Cell 1", tags: [], svg: <TCell1 id="t_cell_1" /> },
//   t_cell_2: { name: "T Cell 2", tags: [], svg: <TCell2 id="t_cell_2" /> },
//   fibroblast_1: {
//     name: "Fibroblast 1",
//     tags: [],
//     svg: <Fibroblast1 id="fibroblast_1" />,
//   },
//   macrophage_1: {
//     name: "Macrophage 1",
//     tags: [],
//     svg: <Macrophage1 id="macrophage_1" />,
//   },
//   mhc_class_i: {
//     name: "MHC Class I",
//     tags: [],
//     svg: <MhcClassI id="mhc_class_i" />,
//   },
//   mhc_class_ii: {
//     name: "MHC Class II",
//     tags: [],
//     svg: <MhcClassII id="mhc_class_ii" />,
//   },
//   monocyte: { name: "Monocyte", tags: [], svg: <Monocyte id="monocyte" /> },
//   natural_killer_cell_2: {
//     name: "Natural Killer Cell 2",
//     tags: [],
//     svg: <NaturalKillerCell2 id="natural_killer_cell_2" />,
//   },
//   natural_killer_cell: {
//     name: "Natural Killer Cell",
//     tags: [],
//     svg: <NaturalKillerCell id="natural_killer_cell" />,
//   },
//   neutrophil: {
//     name: "Neutrophil",
//     tags: [],
//     svg: <Neutrophil id="neutrophil" />,
//   },
//   TCR_1: { name: "TCR 1", tags: [], svg: <TCR1 id="TCR_1" /> },
//   TCR_2: { name: "TCR 2", tags: [], svg: <TCR2 id="TCR_2" /> },
//   BCR_IgA_Dimer: {
//     name: "BCR IgA Dimer",
//     tags: [],
//     svg: <BCRIgADimer id="BCR_IgA_Dimer" />,
//   },
//   BCR_IgA: { name: "BCR IgA", tags: [], svg: <BCRIgA id="BCR_IgA" /> },
//   BCR_IgD: { name: "BCR IgD", tags: [], svg: <BCRIgD id="BCR_IgD" /> },
//   BCR_IgE: { name: "BCR IgE", tags: [], svg: <BCRIgE id="BCR_IgE" /> },
//   BCR_IgE_2: { name: "BCR IgE 2", tags: [], svg: <BCRIgE2 id="BCR_IgE_2" /> },
//   BCR_IgG_flexible_1: {
//     name: "BCR IgG Flexible 1",
//     tags: [],
//     svg: <BCRIgGFlexible1 id="BCR_IgG_flexible_1" />,
//   },
//   BCR_IgG_flexible_2: {
//     name: "BCR IgG Flexible 2",
//     tags: [],
//     svg: <BCRIgGFlexible2 id="BCR_IgG_flexible_2" />,
//   },
//   BCR_IgG: { name: "BCR IgG", tags: [], svg: <BCRIgG id="BCR_IgG" /> },
//   BCR_IgM_monomer: {
//     name: "BCR IgM Monomer",
//     tags: [],
//     svg: <BCRIgMMonomer id="BCR_IgM_monomer" />,
//   },
//   BCR_IgM_pentamer: {
//     name: "BCR IgM Pentamer",
//     tags: [],
//     svg: <BCRIgMPentamer id="BCR_IgM_pentamer" />,
//   },
//   BCR_IgM_pentamer_2: {
//     name: "BCR IgM Pentamer 2",
//     tags: [],
//     svg: <BCRIgMPentamer2 id="BCR_IgM_pentamer_2" />,
//   },
//   upwork_cell_1: {
//     name: "Upwork Cell 1",
//     tags: [],
//     svg: <UpworkCell1 id="upwork_cells_1" />,
//   },
//   upwork_cell_3: {
//     name: "Upwork Cell 3",
//     tags: [],
//     svg: <UpworkCell3 id="upwork_cells_3" />,
//   },
//   upwork_cell_4: {
//     name: "Upwork Cell 4",
//     tags: [],
//     svg: <UpworkCell4 id="upwork_cells_4" />,
//   },
// } as const;
