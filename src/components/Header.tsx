import { Brain } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="p-2 rounded-lg bg-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Alpha Insights</h1>
              <p className="text-xs text-muted-foreground">Análise de Dados Inteligente</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
              Recursos
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
              Contato
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
