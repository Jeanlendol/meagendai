import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MetricCard } from './MetricCard'
import { PerformanceChart } from './PerformanceChart'
import { RevenueChart } from './RevenueChart'
import { DetailsTable } from './DetailsTable'
import { TopClients } from './TopClients'
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
  const [error, setError] = useState("")
  const [lastUpdate, setLastUpdate] = useState(null)
  const [periodo, setPeriodo] = useState("semanal") // 'semanal' ou 'mensal'

  // Mock data for testing - this is the data structure from the user's API
  const mockData = {
    receitaTotal: 1050,
    totalAgendamentos: 9,
    ticketMedio: 116.66666666666667,
    clientesUnicos: 2,
    taxaOcupacao: 30,
    agendamentosDetalhados: [
      {descricao: 'Buço', preco: 100, data_agendamento: '2025-07-24T14:00:00+00:00', status: 'confirmado', nome: 'Jean'},
      {descricao: 'Micro-pigmentação', preco: 300, data_agendamento: '2025-07-03T21:00:00+00:00', status: 'confirmado', nome: 'Jean Lendol'},
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-07-01T16:00:00+00:00', status: 'confirmado', nome: 'Jean Lendol'},
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-07-04T13:00:00+00:00', status: 'confirmado', nome: 'Jean'},
      {descricao: 'Depilação Facial - linha egípcia', preco: 150, data_agendamento: '2025-07-15T20:30:00+00:00', status: 'confirmado', nome: 'Jean'},
      {descricao: 'Hydrogloss', preco: 40, data_agendamento: '2025-07-15T20:30:00+00:00', status: 'confirmado', nome: 'Jean'},
      {descricao: 'Retoque Micro-pigmentação', preco: 10, data_agendamento: '2025-07-15T20:30:00+00:00', status: 'confirmado', nome: 'Jean'},
      {descricao: 'Buço', preco: 70, data_agendamento: '2025-07-15T20:30:00+00:00', status: 'confirmado', nome: 'Jean'},
      {descricao: 'Micro-pigmentação', preco: 300, data_agendamento: '2025-07-15T20:30:00+00:00', status: 'confirmado', nome: 'Jean'},
      // Future appointments with "pendente" status
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-08-01T10:00:00+00:00', status: 'pendente', nome: 'Maria Silva'},
      {descricao: 'Micro-pigmentação', preco: 300, data_agendamento: '2025-08-02T14:00:00+00:00', status: 'pendente', nome: 'Ana Costa'},
      {descricao: 'Buço', preco: 100, data_agendamento: '2025-08-03T16:00:00+00:00', status: 'pendente', nome: 'Carla Santos'},
      {descricao: 'Hydrogloss', preco: 40, data_agendamento: '2025-08-05T11:00:00+00:00', status: 'pendente', nome: 'Lucia Oliveira'},
      {descricao: 'Depilação Facial - linha egípcia', preco: 150, data_agendamento: '2025-08-06T15:00:00+00:00', status: 'pendente', nome: 'Patricia Lima'},
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-08-07T09:00:00+00:00', status: 'pendente', nome: 'Fernanda Rocha'},
      {descricao: 'Micro-pigmentação', preco: 300, data_agendamento: '2025-08-10T13:00:00+00:00', status: 'pendente', nome: 'Juliana Mendes'},
      {descricao: 'Buço', preco: 100, data_agendamento: '2025-08-12T17:00:00+00:00', status: 'pendente', nome: 'Roberta Alves'},
      {descricao: 'Retoque Micro-pigmentação', preco: 10, data_agendamento: '2025-08-15T12:00:00+00:00', status: 'pendente', nome: 'Camila Ferreira'},
      {descricao: 'Hydrogloss', preco: 40, data_agendamento: '2025-08-18T14:30:00+00:00', status: 'pendente', nome: 'Beatriz Souza'},
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-08-20T10:30:00+00:00', status: 'pendente', nome: 'Gabriela Martins'},
      {descricao: 'Depilação Facial - linha egípcia', preco: 150, data_agendamento: '2025-08-25T16:30:00+00:00', status: 'pendente', nome: 'Renata Barbosa'}
    ],
    agendamentosFuturos: [
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-08-01T10:00:00+00:00', status: 'pendente', nome: 'Maria Silva'},
      {descricao: 'Micro-pigmentação', preco: 300, data_agendamento: '2025-08-02T14:00:00+00:00', status: 'pendente', nome: 'Ana Costa'},
      {descricao: 'Buço', preco: 100, data_agendamento: '2025-08-03T16:00:00+00:00', status: 'pendente', nome: 'Carla Santos'},
      {descricao: 'Hydrogloss', preco: 40, data_agendamento: '2025-08-05T11:00:00+00:00', status: 'pendente', nome: 'Lucia Oliveira'},
      {descricao: 'Depilação Facial - linha egípcia', preco: 150, data_agendamento: '2025-08-06T15:00:00+00:00', status: 'pendente', nome: 'Patricia Lima'},
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-08-07T09:00:00+00:00', status: 'pendente', nome: 'Fernanda Rocha'},
      {descricao: 'Micro-pigmentação', preco: 300, data_agendamento: '2025-08-10T13:00:00+00:00', status: 'pendente', nome: 'Juliana Mendes'},
      {descricao: 'Buço', preco: 100, data_agendamento: '2025-08-12T17:00:00+00:00', status: 'pendente', nome: 'Roberta Alves'},
      {descricao: 'Retoque Micro-pigmentação', preco: 10, data_agendamento: '2025-08-15T12:00:00+00:00', status: 'pendente', nome: 'Camila Ferreira'},
      {descricao: 'Hydrogloss', preco: 40, data_agendamento: '2025-08-18T14:30:00+00:00', status: 'pendente', nome: 'Beatriz Souza'},
      {descricao: 'Design de Sobrancelha', preco: 40, data_agendamento: '2025-08-20T10:30:00+00:00', status: 'pendente', nome: 'Gabriela Martins'},
      {descricao: 'Depilação Facial - linha egípcia', preco: 150, data_agendamento: '2025-08-25T16:30:00+00:00', status: 'pendente', nome: 'Renata Barbosa'}
    ],
    comparacaoSemanaAnterior: {
      agendamentosVariacao: 9,
      clientesVariacao: 2,
      receitaVariacao: 0
    },
    performanceServicos: {
      'Buço': {quantidade: 2, receita: 170, percentual: 16.19047619047619},
      'Depilação Facial - linha egípcia': {quantidade: 1, receita: 150, percentual: 14.285714285714285},
      'Design de Sobrancelha': {quantidade: 2, receita: 80, percentual: 7.6190476190476195},
      'Hydrogloss': {quantidade: 1, receita: 40, percentual: 3.8095238095238098},
      'Micro-pigmentação': {quantidade: 2, receita: 600, percentual: 57.14285714285714},
      'Retoque Micro-pigmentação': {quantidade: 1, receita: 10, percentual: 0.9523809523809524}
    },
    receitaPorDia: {
      '2025-07-01': 40,
      '2025-07-03': 300,
      '2025-07-04': 40,
      '2025-07-15': 570,
      '2025-07-24': 100
    },
    topClientes: [
      {nome: 'Jean', total: 710},
      {nome: 'Jean L.', total: 340}
    ]
  }

  const fetchReportData = async () => {
    try {
      setLoading(true)
      setError("")

      // For testing purposes, use mock data
      // In production, this would make the actual API call
      if (!token) {
        // Use mock data when no token is provided
        console.log("Using mock data for testing")
        setReportData(mockData)
        setLastUpdate(new Date())
        setLoading(false)
        return
      }

      // Decodificar token para extrair params (simplificado)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { empresa_id, startDate, endDate, periodo: apiPeriodo } = payload;

      if (apiPeriodo) {
        setPeriodo(apiPeriodo);
      } else {
        setPeriodo("semanal"); // Default to semanal if not provided
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jdfdjpwabrttwadxvrrb.supabase.co/functions/v1'

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
      
      console.log("Dados recebidos da API:", data);
      
      // Normalizar dados para estrutura esperada pelo frontend
      const normalizedData = {
        receitaTotal: data.receitaTotal || 0,
        totalAgendamentos: data.totalAgendamentos || 0,
        clientesUnicos: data.clientesUnicos || 0,
        ticketMedio: data.ticketMedio || 0,
        taxaOcupacao: data.taxaOcupacao || 0,
        
        // Dados que podem não existir - usar valores padrão
        comparacaoSemanaAnterior: data.comparacaoSemanaAnterior || null,
        performanceServicos: data.performanceServicos || {},
        receitaPorDia: data.receitaPorDia || {},
        topClientes: data.topClientes || [],
        agendamentosDetalhados: data.agendamentosDetalhados || [],
        agendamentosFuturos: data.agendamentosFuturos || []
      }
      
      setReportData(normalizedData)
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
    if (!variation) return 'neutral'
    if (variation > 0) return 'up'
    if (variation < 0) return 'down'
    return 'neutral'
  }

  // Verificar se há dados para gráficos
  const hasPerformanceData = reportData.performanceServicos && Object.keys(reportData.performanceServicos).length > 0
  const hasRevenueData = reportData.receitaPorDia && Object.keys(reportData.receitaPorDia).length > 0
  const hasTopClients = reportData.topClientes && reportData.topClientes.length > 0
  const hasDetailsData = reportData.agendamentosDetalhados && reportData.agendamentosDetalhados.length > 0

  // Calcular indicadores futuros usando a nova variável agendamentosFuturos
  const calculateFutureIndicators = () => {
    // Priorizar agendamentosFuturos se disponível, senão usar a lógica antiga
    if (reportData.agendamentosFuturos && reportData.agendamentosFuturos.length > 0) {
      const hoje = new Date()
      const proximos7Dias = new Date()
      proximos7Dias.setDate(hoje.getDate() + 7)
      const proximos30Dias = new Date()
      proximos30Dias.setDate(hoje.getDate() + 30)

      // Usar agendamentosFuturos diretamente do Supabase
      const agendamentosFuturos30Dias = reportData.agendamentosFuturos.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.data_agendamento)
        return dataAgendamento <= proximos30Dias
      })

      const valorPotencialFuturo30Dias = agendamentosFuturos30Dias.reduce((total, agendamento) => {
        return total + (agendamento.preco || 0)
      }, 0)

      const agendamentosFuturos7Dias = reportData.agendamentosFuturos.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.data_agendamento)
        return dataAgendamento <= proximos7Dias
      })

      // Taxa de ocupação futura (simulada - assumindo 10 horários por dia nos próximos 7 dias)
      const horariosDisponiveis7Dias = 7 * 10 // 7 dias * 10 horários por dia
      const horariosOcupados7Dias = agendamentosFuturos7Dias.length
      const taxaOcupacaoFutura7Dias = horariosDisponiveis7Dias > 0 ? (horariosOcupados7Dias / horariosDisponiveis7Dias) * 100 : 0

      return {
        agendamentosFuturos30Dias: agendamentosFuturos30Dias.length,
        valorPotencialFuturo30Dias,
        agendamentosFuturos7Dias: agendamentosFuturos7Dias.length,
        taxaOcupacaoFutura7Dias
      }
    }

    // Fallback para a lógica antiga se agendamentosFuturos não estiver disponível
    if (!reportData.agendamentosDetalhados) return null

    const hoje = new Date()
    const proximos7Dias = new Date()
    proximos7Dias.setDate(hoje.getDate() + 7)
    const proximos30Dias = new Date()
    proximos30Dias.setDate(hoje.getDate() + 30)

    const agendamentosPendentes = reportData.agendamentosDetalhados.filter(agendamento => {
      return agendamento.status === 'pendente'
    })

    const agendamentosFuturos30Dias = agendamentosPendentes.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.data_agendamento)
      return dataAgendamento > hoje && dataAgendamento <= proximos30Dias
    })

    const valorPotencialFuturo30Dias = agendamentosFuturos30Dias.reduce((total, agendamento) => {
      return total + (agendamento.preco || 0)
    }, 0)

    const agendamentosFuturos7Dias = agendamentosPendentes.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.data_agendamento)
      return dataAgendamento >= hoje && dataAgendamento <= proximos7Dias
    })

    // Taxa de ocupação futura (simulada - assumindo 10 horários por dia nos próximos 7 dias)
    const horariosDisponiveis7Dias = 7 * 10 // 7 dias * 10 horários por dia
    const horariosOcupados7Dias = agendamentosFuturos7Dias.length
    const taxaOcupacaoFutura7Dias = horariosDisponiveis7Dias > 0 ? (horariosOcupados7Dias / horariosDisponiveis7Dias) * 100 : 0

    return {
      agendamentosFuturos30Dias: agendamentosFuturos30Dias.length,
      valorPotencialFuturo30Dias,
      agendamentosFuturos7Dias: agendamentosFuturos7Dias.length,
      taxaOcupacaoFutura7Dias
    }
  }

  const futureIndicators = calculateFutureIndicators()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Relatório de desempenho {periodo === 'mensal' ? '(Mensal)' : '(Semanal)'}
              </p>
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
            description={periodo === 'semanal' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
          />
          
          <MetricCard
            title="Atendimentos"
            value={reportData.totalAgendamentos}
            format="number"
            trend={reportData.comparacaoSemanaAnterior ? 
              getTrend(reportData.totalAgendamentos, reportData.comparacaoSemanaAnterior.agendamentosVariacao) : 
              null
            }
            trendValue={reportData.comparacaoSemanaAnterior?.agendamentosVariacao}
            icon={Calendar}
            className="border-l-4 border-l-blue-500"
            description={periodo === 'semanal' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
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
            description={periodo === 'semanal' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
          />
          
          <MetricCard
            title="Ticket Médio"
            value={reportData.ticketMedio}
            format="currency"
            icon={TrendingUp}
            className="border-l-4 border-l-orange-500"
            description={periodo === 'semanal' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
          />
        </div>

        {/* Taxa de Ocupação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Taxa de Ocupação {periodo === 'semanal' ? '(Últimos 7 dias)' : '(Últimos 30 dias)'}</span>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Mostra o quanto da sua agenda foi preenchida.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Top Clientes - só exibe se houver dados */}
          <div className="lg:col-span-2">
            {hasTopClients ? (
              <TopClients data={reportData.topClientes} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    Dados de clientes não disponíveis
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Gráficos - só exibe se houver dados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {hasPerformanceData ? (
            <PerformanceChart 
              data={reportData.performanceServicos} 
              type="bar"
              title="Performance por Serviço"
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Performance por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Dados de performance não disponíveis
                </div>
              </CardContent>
            </Card>
          )}
          
          {hasRevenueData ? (
            <RevenueChart 
              data={reportData.receitaPorDia}
              title="Receita Diária"
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Receita Diária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Dados de receita diária não disponíveis
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gráfico de Pizza e Resumo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {hasPerformanceData ? (
            <PerformanceChart 
              data={reportData.performanceServicos} 
              type="pie"
              title="Distribuição da Receita"
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Distribuição da Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Dados de distribuição não disponíveis
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Card de Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dias com Atendimento</span>
                  <span className="font-semibold">
                    {Object.keys(reportData.receitaPorDia).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Receita por Cliente</span>
                  <span className="font-semibold">
                    {reportData.clientesUnicos > 0 ? 
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(reportData.receitaTotal / reportData.clientesUnicos) :
                      "N/A"
                    }
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

        {/* Tabela de Detalhes - só exibe se houver dados */}
        {hasDetailsData ? (
          <DetailsTable 
            data={reportData.agendamentosDetalhados}
            title="Agendamentos do Período"
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos do Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Dados detalhados de agendamentos não disponíveis
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indicadores Futuros */}
        {futureIndicators && (
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Projeções Futuras
              </h2>
              <p className="text-sm text-muted-foreground">
                Indicadores baseados em agendamentos com status pendente
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Agendamentos Futuros"
                value={futureIndicators.agendamentosFuturos30Dias}
                format="number"
                icon={Calendar}
                className="border-l-4 border-l-blue-500"
                description="Próximos 30 dias"
              />
              
              <MetricCard
                title="Valor Potencial Futuro"
                value={futureIndicators.valorPotencialFuturo30Dias}
                format="currency"
                icon={DollarSign}
                className="border-l-4 border-l-green-500"
                description="Próximos 30 dias"
              />
              
              <MetricCard
                title="Agendamentos Futuros"
                value={futureIndicators.agendamentosFuturos7Dias}
                format="number"
                icon={Clock}
                className="border-l-4 border-l-orange-500"
                description="Próximos 7 dias"
              />
              
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Ocupação Futura
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {futureIndicators.taxaOcupacaoFutura7Dias.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        futureIndicators.taxaOcupacaoFutura7Dias >= 80 ? 'bg-green-500' :
                        futureIndicators.taxaOcupacaoFutura7Dias >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(futureIndicators.taxaOcupacaoFutura7Dias, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mostra o quanto da sua agenda foi preenchida.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
