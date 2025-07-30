import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function RevenueChart({ data, title = "Receita por Dia" }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    )
  }

  // Transformar dados e ordenar por data
  const chartData = Object.entries(data)
    .map(([date, receita]) => ({
      date,
      receita,
      formattedDate: format(parseISO(date), 'dd/MM', { locale: ptBR }),
      fullDate: format(parseISO(date), 'EEEE, dd/MM/yyyy', { locale: ptBR })
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium capitalize">{data.fullDate}</p>
          <p className="text-sm text-blue-600">
            Receita: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(data.receita)}
          </p>
        </div>
      )
    }
    return null
  }

  // Calcular estatísticas
  const totalReceita = chartData.reduce((sum, item) => sum + item.receita, 0)
  const mediaReceita = totalReceita / chartData.length
  const maiorReceita = Math.max(...chartData.map(item => item.receita))
  const menorReceita = Math.min(...chartData.map(item => item.receita))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <div className="text-sm text-muted-foreground font-normal">
            Média: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(mediaReceita)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="receita" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Maior Receita</p>
            <p className="font-semibold text-green-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(maiorReceita)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Menor Receita</p>
            <p className="font-semibold text-orange-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(menorReceita)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

