import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function MetricCard({ 
  title, 
  value, 
  format = 'number', 
  trend = null, 
  trendValue = null,
  icon: Icon,
  className = '' 
}) {
  const formatValue = (val, fmt) => {
    if (val === null || val === undefined) return '-'
    
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'number':
        return new Intl.NumberFormat('pt-BR').format(val)
      default:
        return val.toString()
    }
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-500'
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value, format)}
        </div>
        {trendValue !== null && (
          <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>
              {trend === 'up' ? '+' : trend === 'down' ? '' : ''}
              {formatValue(Math.abs(trendValue), format === 'currency' ? 'currency' : 'number')}
              {format !== 'percentage' && trend !== 'neutral' && ' vs semana anterior'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

