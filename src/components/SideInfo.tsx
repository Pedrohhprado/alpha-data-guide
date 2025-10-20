import { Sparkles, Shield, Zap } from "lucide-react";

const SideInfo = () => {
  const features = [
    {
      icon: Sparkles,
      title: "IA Avançada",
      description: "Análise com Google Gemini"
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Dados criptografados"
    },
    {
      icon: Zap,
      title: "Rápido",
      description: "Respostas instantâneas"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-5 rounded-xl bg-card border border-border hover:shadow-elegant transition-smooth animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5 text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="text-center p-3 rounded-lg bg-card border border-border">
          <p className="text-xl font-bold text-primary">99%</p>
          <p className="text-[10px] text-muted-foreground">Precisão</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border border-border">
          <p className="text-xl font-bold text-primary">&lt;2s</p>
          <p className="text-[10px] text-muted-foreground">Resposta</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border border-border">
          <p className="text-xl font-bold text-primary">24/7</p>
          <p className="text-[10px] text-muted-foreground">Online</p>
        </div>
      </div>
    </div>
  );
};

export default SideInfo;
