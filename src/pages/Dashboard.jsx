import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { PerformanceChart } from '../components/PerformanceChart'
import { RevenueChart } from '../components/RevenueChart'
import { DetailsTable } from '../components/DetailsTable'
import { TopClients } from '../components/TopClients'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Target,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Hook para pegar query params
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export function Dashboard() {
  const query = useQuery()
  const token = query.get('token') // pega o token da query string

  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchReportData = async () => {
    if (!token) {
      setError('Token de acesso não fornecido')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      // Decodificar token para extrair params (simplificado)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { empresa_id, startDate, endDate } = payload;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'


      const urlWithParams = `${supabaseUrl}/get-company-report`;

      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expirado ou inválido. Solicite um novo relatório.')
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      console.log("Dados recebidos da API:", data);  // Adicionando o log dos dados recebidos
      setReportData(data)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      setError(err.message || 'Erro ao carregar o relatório')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg font-medium">Carregando seu relatório...</p>
          <p className="text-sm text-muted-foreground">Processando dados de performance</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Erro ao Carregar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={fetchReportData}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    )
  }

  const getTrend = (current, variation) => {
    if (variation > 0) return 'up'
    if (variation < 0) return 'down'
    return 'neutral'
  }

  console.log("Dados de performance para o gráfico:", reportData.performanceServicos);  // Log dos dados de performance

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Performance
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Relatório de desempenho empresarial
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <div className="text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Atualizado: {format(lastUpdate, 'HH:mm', { locale: ptBR })}
                </div>
              )}
              <button
                onClick={fetchReportData}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Receita Total"
            value={reportData.receitaTotal}
            format="currency"
            trend={reportData.comparacaoSemanaAnterior ? 
              getTrend(reportData.receitaTotal, reportData.comparacaoSemanaAnterior.receitaVariacao) : 
              null
            }
            trendValue={reportData.comparacaoSemanaAnterior?.receitaVariacao}
            icon={DollarSign}
            className="border-l-4 border-l-green-500"
          />
          
          <MetricCard
            title="Agendamentos"
            value={reportData.totalAgendamentos}
            format="number"
            trend={reportData.comparacaoSemanaAnterior ? 
              getTrend(reportData.totalAgendamentos, reportData.comparacaoSemanaAnterior.agendamentosVariacao) : 
              null
            }
            trendValue={reportData.comparacaoSemanaAnterior?.agendamentosVariacao}
            icon={Calendar}
            className="border-l-4 border-l-blue-500"
          />
          
          <MetricCard
            title="Clientes Únicos"
            value={reportData.clientesUnicos}
            format="number"
            trend={reportData.comparacaoSemanaAnterior ? 
              getTrend(reportData.clientesUnicos, reportData.comparacaoSemanaAnterior.clientesVariacao) : 
              null
            }
            trendValue={reportData.comparacaoSemanaAnterior?.clientesVariacao}
            icon={Users}
            className="border-l-4 border-l-purple-500"
          />
          
          <MetricCard
            title="Ticket Médio"
            value={reportData.ticketMedio}
            format="currency"
            icon={TrendingUp}
            className="border-l-4 border-l-orange-500"
          />
        </div>

        {/* Taxa de Ocupação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Taxa de Ocupação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {reportData.taxaOcupacao.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      reportData.taxaOcupacao >= 80 ? 'bg-green-500' :
                      reportData.taxaOcupacao >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${reportData.taxaOcupacao}%` }}
                  />
                </div>
                <Badge variant={
                  reportData.taxaOcupacao >= 80 ? 'default' :
                  reportData.taxaOcupacao >= 60 ? 'secondary' : 'destructive'
                }>
                  {reportData.taxaOcupacao >= 80 ? 'Excelente' :
                   reportData.taxaOcupacao >= 60 ? 'Bom' : 'Precisa Melhorar'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Top Clientes */}
          <div className="lg:col-span-2">
            <TopClients data={reportData.topClientes} />
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart 
            data={reportData.performanceServicos} 
            type="bar"
            title="Performance por Serviço"
          />
          <RevenueChart 
            data={reportData.receitaPorDia}
            title="Receita Diária"
          />
        </div>

        {/* Gráfico de Pizza */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart 
            data={reportData.performanceServicos} 
            type="pie"
            title="Distribuição da Receita"
          />
          
          {/* Card de Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Serviços Oferecidos</span>
                  <span className="font-semibold">
                    {Object.keys(reportData.performanceServicos).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dias com Atendimento</span>
                  <span className="font-semibold">
                    {Object.keys(reportData.receitaPorDia).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Receita por Cliente</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(reportData.receitaTotal / reportData.clientesUnicos)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status Geral</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operacional
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Detalhes */}
        <DetailsTable 
          data={reportData.agendamentosDetalhados}
          title="Todos os Agendamentos do Período"
        />
      </div>
    </div>
  )
}
