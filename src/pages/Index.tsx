import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";
import SideInfo from "@/components/SideInfo";

const Index = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      
      {/* Main Content - 100vh layout */}
      <main className="flex-1 pt-20 overflow-hidden">
        <div className="container mx-auto px-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center py-8">
            {/* Left Side Info - Hidden on mobile, visible on lg */}
            <div className="hidden lg:block lg:col-span-3">
              <SideInfo />
            </div>

            {/* Center - ChatBot (Main Hero) */}
            <div className="col-span-1 lg:col-span-6 flex items-center justify-center">
              <ChatBot />
            </div>

            {/* Right Side Info - Hidden on mobile, visible on lg */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-card border border-border animate-fade-in-up">
                  <h3 className="font-semibold text-foreground mb-3">Como Funciona?</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">1.</span>
                      <span>Faça sua pergunta sobre os dados</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">2.</span>
                      <span>Nossa IA analisa as planilhas</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">3.</span>
                      <span>Receba insights detalhados</span>
                    </li>
                  </ol>
                </div>

                <div className="p-6 rounded-xl gradient-hero text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-semibold mb-2">Experimente Agora</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Comece a fazer perguntas e descubra o poder da análise de dados com IA.
                  </p>
                  <div className="text-xs text-white/60">
                    Conectado às suas planilhas do Google Drive
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Side Info - Stack below on mobile */}
            <div className="lg:hidden col-span-1 pb-8">
              <SideInfo />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
