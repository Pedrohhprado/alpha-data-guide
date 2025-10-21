import { Sparkles, Shield, Zap, Mail } from "lucide-react";

const SideInfo = () => {
  const features = [
    {
      icon: Sparkles,
      title: "IA Avançada",
      description: "Análise de dados com Google Gemini"
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Seus dados protegidos e criptografados"
    },
    {
      icon: Zap,
      title: "Rápido",
      description: "Respostas em tempo real"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-xl bg-card border border-border hover:shadow-elegant transition-smooth animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="p-6 rounded-xl bg-gradient-subtle border border-border animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-semibold text-foreground mb-3">Sobre Alpha Insights</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Transformamos dados em insights acionáveis através de inteligência artificial avançada.
          Nossa plataforma analisa suas planilhas e fornece respostas claras e precisas.
        </p>
        <div className="flex items-center gap-2 text-sm text-primary">
          <Mail className="w-4 h-4" />
          <a href="mailto:contato@alphainsights.com" className="hover:underline">
            contato@alphainsights.com
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="text-center p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-primary">99.9%</p>
          <p className="text-xs text-muted-foreground">Precisão</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-primary">&lt;2s</p>
          <p className="text-xs text-muted-foreground">Resposta</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-primary">24/7</p>
          <p className="text-xs text-muted-foreground">Disponível</p>
        </div>
      </div>
    </div>
  );
};

export default SideInfo;
