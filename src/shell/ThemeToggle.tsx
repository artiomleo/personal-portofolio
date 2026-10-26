import { Moon, Sun } from "lucide-react";
import { useLayout } from "@/layout/LayoutProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useLayout();
  return (
    <button type="button" className="tb-icon" onClick={toggleTheme} aria-label="Dark theme" aria-pressed={mounted ? theme === "dark" : false}>
      <Moon className="icon-moon" size={16} aria-hidden="true" />
      <Sun className="icon-sun" size={16} aria-hidden="true" />
    </button>
  );
}
