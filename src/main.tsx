import { createRoot } from "react-dom/client";
import "@fontsource-variable/onest/wght.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
