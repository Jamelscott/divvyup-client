import * as ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import App from "./App";
import store from "./utils/store";
import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </MantineProvider>
  </StrictMode>
);
