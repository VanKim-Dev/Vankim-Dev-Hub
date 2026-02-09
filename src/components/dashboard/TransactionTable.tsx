'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Download, FileSpreadsheet } from 'lucide-react'
import { exportToCSV } from '@/utils/exportToCSV'
import { exportToExcel } from '@/utils/exportToExcel'
import { useLanguage } from '@/context/LanguageContext'
import { i18n } from '@/locales'

interface TransactionTableProps {
  transactions: any[]
  loading: boolean
  deletingId: string | null
  onEdit: (tx: any) => void
  onDelete: (id: string) => void
  // 부모에게서 받는 함수는 무시하고 내부 i18n을 우선 사용하도록 설정
  getCategoryLabel?: (value: string) => string 
  dateRange: { from: Date | undefined; to: Date | undefined }
}

export function TransactionTable({
  transactions,
  loading,
  deletingId,
  onEdit,
  onDelete,
  dateRange,
}: TransactionTableProps) {
  const { language } = useLanguage();
  const t = i18n[language];
  const labels = t.table;
  const common = t.common;

  // DB에 저장된 'food' 같은 value를 현재 언어의 '식비' 또는 'Food'로 바꿔줍니다.
  const formatCategory = (dbValue: string) => {
    if (!dbValue) return '-';
    
    // 현재 선택된 언어팩(t.categories)에서 같은 value를 가진 객체를 찾습니다.
    const categoryObj = t.categories.find(
      (c) => c.value.toLowerCase() === dbValue.toLowerCase()
    );

    // 찾으면 번역된 label을, 못 찾으면 DB 값을 그대로 반환합니다.
    return categoryObj ? categoryObj.label : dbValue;
  };

  const getDynamicFilename = () => {
    const today = new Date().toLocaleDateString('sv-SE');
    const baseName = language === 'ko' ? '재무리포트' : 'Finance_Report';
    return `${baseName}_${today}`;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl">
              {language === 'ko' ? '거래 내역' : 'Transactions'}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-green-600 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                onClick={() => exportToExcel(transactions, getDynamicFilename())}
              >
                <FileSpreadsheet className="h-3 w-3" />
                {language === 'ko' ? '엑셀 저장' : 'Export Excel'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-8 gap-1 text-xs"
                onClick={() => exportToCSV(transactions, getDynamicFilename())}
              >
                <Download className="h-3 w-3" />
                {language === 'ko' ? 'CSV 저장' : 'Export CSV'}
              </Button>
            </div>
          </div>

          {dateRange.from && dateRange.to && (
            <span className="text-muted-foreground text-sm font-normal bg-muted px-3 py-1 rounded-full">
              {format(dateRange.from, 'yyyy-MM-dd')} ~ {format(dateRange.to, 'yyyy-MM-dd')}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-muted-foreground">{common.processing}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-y">
                  <th className="p-4 text-left font-bold text-sm">{labels.date}</th>
                  <th className="p-4 text-left font-bold text-sm">{labels.type}</th>
                  <th className="p-4 text-left font-bold text-sm">{labels.amount}</th>
                  <th className="p-4 text-left font-bold text-sm">{labels.category}</th>
                  <th className="p-4 text-left font-bold text-sm">{labels.description}</th>
                  <th className="p-4 text-right font-bold text-sm">{labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 border-b transition-colors">
                    <td className="p-4 text-sm whitespace-nowrap">{tx.date}</td>
                    <td className="p-4 text-sm">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {tx.type === 'income' ? common.income : common.expense}
                      </span>
                    </td>
                    <td className={`p-4 text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {language === 'en' && '$'}
                      {Number(tx.amount).toLocaleString()}
                      {language === 'ko' && ` ${common.unit}`}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="bg-secondary/50 text-secondary-foreground rounded px-2 py-1 text-xs font-medium">
                        {formatCategory(tx.category)}
                      </span>
                    </td>
                    <td className="text-muted-foreground max-w-[200px] truncate p-4 text-sm">
                      {tx.description || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-500 h-8" onClick={() => onEdit(tx)}>
                          {common.edit}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 h-8" onClick={() => onDelete(tx.id)} disabled={deletingId === tx.id}>
                          {deletingId === tx.id ? '...' : common.delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}