import { BarChart3 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="p-2 rounded-lg gradient-hero">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Análise de Dados</h1>
              <p className="text-xs text-muted-foreground">Assistente Inteligente</p>
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
