"use client";

import React from "react";
import { Provider } from "react-redux";
import { canvas } from "./Canvas/reducers/canvas";
import { frames } from "./Frames/reducers/frames";
import homeReducer from "./Home/reducers";
import { presentations } from "./Presentation/reducers/presentations";
import { sidebars } from "./Sidebars/reducers/sidebars";
import { configureStore, PayloadAction } from "@reduxjs/toolkit";

const store = configureStore<any, PayloadAction<any>, any>({
  reducer: {
    sidebars,
    frames,
    presentations,
    canvas,
    home: homeReducer,
  },
});

function App({ children }: { children?: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export default App;
