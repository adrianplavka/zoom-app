import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import App from "./app/app";
import { RootStoreProvider } from "./app/store";
import { ZoomProvider } from "./features/zoom/context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <RootStoreProvider>
      <ZoomProvider>
        <App />
      </ZoomProvider>
    </RootStoreProvider>
  </StrictMode>
);
