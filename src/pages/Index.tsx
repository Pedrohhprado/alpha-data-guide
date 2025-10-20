import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";
import SideInfo from "@/components/SideInfo";
import DataCharts from "@/components/DataCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-20 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 bg-card">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Assistente
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Gráficos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="hidden lg:block lg:col-span-3">
                  <SideInfo />
                </div>

                {/* Chat Center */}
                <div className="col-span-1 lg:col-span-6">
                  <ChatBot />
                </div>

                {/* Right Sidebar */}
                <div className="hidden lg:block lg:col-span-3">
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-card border border-border animate-fade-in-up">
                      <h3 className="font-semibold text-foreground mb-3 text-sm">Início Rápido</h3>
                      <ol className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="font-semibold text-primary">1.</span>
                          <span>Faça perguntas sobre seus dados</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-primary">2.</span>
                          <span>Receba análises em tempo real</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-primary">3.</span>
                          <span>Visualize nos gráficos</span>
                        </li>
                      </ol>
                    </div>

                    <div className="p-5 rounded-xl gradient-hero text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <h3 className="font-semibold mb-1.5 text-sm">Conectado</h3>
                      <p className="text-xs text-white/80">
                        Suas planilhas do Google Drive estão sincronizadas e prontas para análise.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Sidebar */}
                <div className="lg:hidden col-span-1">
                  <SideInfo />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="mt-0">
              <DataCharts />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
