import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function DetailsTable({ data, title = "Detalhes dos Agendamentos" }) {
  const [sortField, setSortField] = useState('data_agendamento')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Nenhum agendamento encontrado
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const sortedData = [...data].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === 'data_agendamento') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    } else if (sortField === 'preco') {
      aValue = Number(aValue)
      bValue = Number(bValue)
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  const formatDateTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'confirmado': 'default',
      'cancelado': 'destructive',
      'pendente': 'secondary'
    }
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            {data.length} agendamento{data.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th 
                  className="text-left p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('data_agendamento')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Data/Hora</span>
                    <SortIcon field="data_agendamento" />
                  </div>
                </th>
                <th 
                  className="text-left p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('nome')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Cliente</span>
                    <SortIcon field="nome" />
                  </div>
                </th>
                <th 
                  className="text-left p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('descricao')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Procedimento</span>
                    <SortIcon field="descricao" />
                  </div>
                </th>
                <th 
                  className="text-right p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('preco')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Valor</span>
                    <SortIcon field="preco" />
                  </div>
                </th>
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((agendamento, index) => (
                <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-2 text-sm">
                    {formatDateTime(agendamento.data_agendamento)}
                  </td>
                  <td className="p-2 font-medium">
                    {agendamento.nome}
                  </td>
                  <td className="p-2 text-sm">
                    {agendamento.descricao}
                  </td>
                  <td className="p-2 text-right font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(agendamento.preco))}
                  </td>
                  <td className="p-2 text-center">
                    {getStatusBadge(agendamento.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, data.length)} de {data.length} agendamentos
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

