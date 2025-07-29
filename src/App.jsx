import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { TrendingUp, Users, DollarSign, Calendar, RefreshCw } from 'lucide-react'
import './App.css'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const revenueData = [
  { name: 'Consulta Médica', value: 4500, color: '#0088FE' },
  { name: 'Exames', value: 3200, color: '#00C49F' },
  { name: 'Procedimentos', value: 2800, color: '#FFBB28' },
  { name: 'Outros', value: 1500, color: '#FF8042' }
]

const performanceData = [
  { month: 'Jan', receita: 8500, agendamentos: 45 },
  { month: 'Fev', receita: 9200, agendamentos: 52 },
  { month: 'Mar', receita: 8800, agendamentos: 48 },
  { month: 'Abr', receita: 10500, agendamentos: 58 },
  { month: 'Mai', receita: 11200, agendamentos: 62 },
  { month: 'Jun', receita: 12000, agendamentos: 68 }
]

function App() {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = () => {
    setIsUpdating(true)
    setTimeout(() => {
      setIsUpdating(false)
    }, 2000)
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="11"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Relatório de desempenho</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12.000</div>
              <p className="text-xs text-muted-foreground">
                +20.1% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Confirmados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68</div>
              <p className="text-xs text-muted-foreground">
                +9.5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 176</div>
              <p className="text-xs text-muted-foreground">
                +5.2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +12.3% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição da Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">R$ {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="receita" fill="#0088FE" name="Receita (R$)" />
                  <Bar yAxisId="right" dataKey="agendamentos" fill="#00C49F" name="Agendamentos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Services Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Desempenho dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Serviço</th>
                    <th className="text-right py-2">Quantidade</th>
                    <th className="text-right py-2">Receita</th>
                    <th className="text-right py-2">Ticket Médio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Consulta Médica</td>
                    <td className="text-right py-2">25</td>
                    <td className="text-right py-2">R$ 4.500</td>
                    <td className="text-right py-2">R$ 180</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Exames</td>
                    <td className="text-right py-2">20</td>
                    <td className="text-right py-2">R$ 3.200</td>
                    <td className="text-right py-2">R$ 160</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Procedimentos</td>
                    <td className="text-right py-2">14</td>
                    <td className="text-right py-2">R$ 2.800</td>
                    <td className="text-right py-2">R$ 200</td>
                  </tr>
                  <tr>
                    <td className="py-2">Outros</td>
                    <td className="text-right py-2">9</td>
                    <td className="text-right py-2">R$ 1.500</td>
                    <td className="text-right py-2">R$ 167</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Update Button at Bottom */}
        <div className="flex justify-center">
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App

