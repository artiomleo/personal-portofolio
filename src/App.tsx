import { CanvasApiProvider } from "@/canvas/CanvasApi";
import { DevModeProvider } from "@/devmode/DevModeProvider";
import { LayoutProvider } from "@/layout/LayoutProvider";
import { Shell } from "@/shell/Shell";

export default function App() {
  return (
    <LayoutProvider>
      <CanvasApiProvider>
        <DevModeProvider>
          <Shell />
        </DevModeProvider>
      </CanvasApiProvider>
    </LayoutProvider>
  );
}
