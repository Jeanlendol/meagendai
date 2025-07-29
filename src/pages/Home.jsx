import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { AlertCircle, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard de Performance
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Relatórios automatizados de desempenho empresarial com métricas detalhadas 
            e insights para o crescimento do seu negócio.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acompanhe sua receita em tempo real com comparações semanais
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Clientes Únicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitore o crescimento da sua base de clientes
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Análise detalhada por serviço e tendências de crescimento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Access Info */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <span>Como Acessar Seu Relatório</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <div className="space-y-3">
              <p>
                <strong>Via WhatsApp:</strong> Envie uma mensagem para sua assistente virtual 
                solicitando o relatório semanal ou mensal.
              </p>
              <p>
                <strong>Automático:</strong> Receba automaticamente toda segunda-feira 
                um link com o relatório da semana anterior.
              </p>
              <p>
                <strong>Personalizado:</strong> Solicite relatórios de períodos específicos 
                através de comandos como "relatório do mês passado".
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Dashboard desenvolvido para otimizar a gestão do seu negócio
          </p>
        </div>
      </div>
    </div>
  )
}

