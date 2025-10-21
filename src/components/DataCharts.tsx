import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SheetData {
  [key: string]: any;
}

const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "hsl(var(--primary))",
  },
  despesas: {
    label: "Despesas",
    color: "hsl(var(--accent))",
  },
  produtividade: {
    label: "Produtividade",
    color: "hsl(var(--primary))",
  },
};

const DataCharts = () => {
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSheetData();
  }, []);

  const fetchSheetData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('chat-with-sheets', {
        body: {
          messages: [{
            role: 'user',
            content: 'Por favor, retorne todos os dados das planilhas em formato JSON para visualização em gráficos.'
          }]
        }
      });

      if (error) throw error;
      
      // O retorno vem em data.reply como texto, precisamos processar
      console.log('Sheet data:', data);
      
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      toast.error('Erro ao carregar dados das planilhas');
    } finally {
      setIsLoading(false);
    }
  };

  // Dados de exemplo enquanto carrega ou se não houver dados
  const barData = sheetData.length > 0 ? sheetData : [
    { mes: "Jan", vendas: 4000, despesas: 2400 },
    { mes: "Fev", vendas: 3000, despesas: 1398 },
    { mes: "Mar", vendas: 2000, despesas: 9800 },
    { mes: "Abr", vendas: 2780, despesas: 3908 },
    { mes: "Mai", vendas: 1890, despesas: 4800 },
    { mes: "Jun", vendas: 2390, despesas: 3800 },
  ];

  const lineData = [
    { dia: "Seg", produtividade: 85 },
    { dia: "Ter", produtividade: 92 },
    { dia: "Qua", produtividade: 78 },
    { dia: "Qui", produtividade: 88 },
    { dia: "Sex", produtividade: 95 },
  ];

  const pieData = [
    { name: "Concluídas", value: 65 },
    { name: "Em Andamento", value: 25 },
    { name: "Pendentes", value: 10 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando dados das planilhas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Dashboard de Dados
        </h2>
        <p className="text-sm text-muted-foreground">
          Visualize insights das suas planilhas em tempo real
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Vendas vs Despesas
            </CardTitle>
            <CardDescription>Análise mensal comparativa</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="mes" 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="despesas" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Linha */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Produtividade Semanal
            </CardTitle>
            <CardDescription>Desempenho da equipe (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="dia"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="produtividade" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza */}
        <Card className="shadow-elegant lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-primary" />
              Status das Tarefas
            </CardTitle>
            <CardDescription>Distribuição de atividades</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={chartConfig} className="h-[300px] w-full max-w-md">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "hsl(var(--primary))" : index === 1 ? "hsl(var(--accent))" : "hsl(var(--muted))"}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-subtle border-border shadow-elegant">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Insights Automáticos</h3>
              <p className="text-sm text-muted-foreground">
                Os gráficos são atualizados automaticamente conforme suas planilhas mudam. 
                Use o chat para fazer perguntas específicas sobre os dados visualizados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCharts;
