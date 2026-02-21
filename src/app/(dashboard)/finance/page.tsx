'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
// ✅ 수정된 경로에서 dictionary import
import { i18n } from '@/locales' 

import { useLanguage } from '@/context/LanguageContext'

// 분리한 컴포넌트들 Import
import { DateFilter } from '@/components/dashboard/finance/DateFilter'
import { SummaryCards } from '@/components/dashboard/finance/SummaryCards'
import { CategoryChart } from '@/components/dashboard/finance/CategoryChart'
import { MonthlyChart } from '@/components/dashboard/finance/MonthlyChart'
import { TransactionForm } from '@/components/dashboard/finance/TransactionForm'
import { TransactionTable } from '@/components/dashboard/finance/TransactionTable'
import { ScheduleCalendar } from '@/components/dashboard/finance/ScheduleCalendar'
import { ReportDownload } from '@/components/dashboard/finance/ReportDownload'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const supabase = createClient()

  const { language } = useLanguage()
  
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: '',
  })

  // ✅ 딕셔너리 적용
  const labels = i18n[language]
  const CATEGORIES = labels.categories

  // --- 데이터 필터링 및 계산 로직 ---
  const filteredTransactions = transactions.filter((tx) => {
    if (!dateRange.from || !dateRange.to) return true
    const txDate = new Date(tx.date)
    const fromDate = new Date(dateRange.from)
    const toDate = new Date(dateRange.to)
    fromDate.setHours(0, 0, 0, 0)
    toDate.setHours(23, 59, 59, 999)
    return txDate >= fromDate && txDate <= toDate
  })

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const balance = totalIncome - totalExpense

  const chartData = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: any[], curr) => {
      const categoryLabel = labels.categories.find((c: any) => c.value === curr.category)?.label 
        || curr.category 
        || labels.messages.others;

      const existing = acc.find((item) => item.name === categoryLabel);
      if (existing) {
        existing.value += Number(curr.amount);
      } else {
        acc.push({ name: categoryLabel, value: Number(curr.amount) });
      }
      return acc;
    }, []);

  const getCategoryLabel = (value: string) => {
    const category = labels.categories.find((c: any) => c.value === value);
    return category ? category.label : value || '-';
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (!error) setTransactions(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const now = new Date();
    const userToday = now.toLocaleDateString('sv-SE');
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    // 날짜 필터 초기화
    setDateRange({ from: firstDay, to: now });

    // 폼 데이터 초기 날짜 설정 (prev 사용으로 Lint 방지)
    setFormData((prev) => ({
      ...prev,
      date: userToday,
    }));
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchTransactions()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)
    }
    init()

    const channel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
          fetchTransactions()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchTransactions, supabase])

  const handleStartEdit = (tx: any) => {
    setIsEditing(true);
    setEditingId(tx.id);
    setFormData({
      type: tx.type,
      amount: tx.amount.toString(),
      category: tx.category || '',
      description: tx.description || '',
      date: tx.date,
    });

    const formElement = document.getElementById('transaction-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || isNaN(Number(formData.amount))) {
      toast.error(labels.messages.invalidAmount)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category || null,
      description: formData.description || null,
      date: formData.date,
    }

    const { error } = isEditing
      ? await supabase.from('transactions').update(payload).eq('id', editingId).eq('user_id', user.id)
      : await supabase.from('transactions').insert({ ...payload, user_id: user.id })

    if (error) {
      const errorMsg = isEditing ? labels.messages.editFailed : labels.messages.addFailed;
      toast.error(errorMsg, { description: error.message })
    } else {
      const successMsg = isEditing ? labels.messages.editSuccess : labels.messages.addSuccess;
      toast.success(successMsg)
      resetForm()
      fetchTransactions()
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      type: 'income',
      amount: '',
      category: '',
      description: '',
      date: new Date().toLocaleDateString('sv-SE'),
    })
  }

  const handleDeleteTransaction = async (txId: string) => {
    if (!confirm(labels.messages.deleteConfirm)) return

    setDeletingId(txId)
    const { error } = await supabase.from('transactions').delete().eq('id', txId)

    if (error) {
      toast.error(labels.messages.deleteFailed)
    } else {
      toast.success(labels.messages.deleteSuccess)
      fetchTransactions()
    }
    setDeletingId(null)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="mx-auto max-w-5xl space-y-8">
{user && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border border-primary/20">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">
                  <span className="text-primary">{user.email?.split('@')[0]}</span>
                  {labels.dashboard.greet}
                </p>
                <p className="text-muted-foreground text-sm">
                   {labels.dashboard.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight shrink-0"> {/* shrink-0으로 제목 밀림 방지 */}
            {labels.dashboard.title}
          </h1>
          
          {/* 버튼 컨테이너에 flex-wrap 추가 */}
          <div className="flex flex-wrap items-center gap-2"> 
            <ReportDownload
              transactions={filteredTransactions}
              summary={{ income: totalIncome, expense: totalExpense, balance }}
              dateRange={dateRange}
              lang={language}
            />
            
            {/* 혹시 여기에 다른 Export 버튼들이 있다면 함께 배치됩니다 */}
          </div>
        </div>

        <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
        
        <SummaryCards
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
        />

        <ScheduleCalendar transactions={transactions} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <MonthlyChart data={filteredTransactions} />
          </div>
          <div className="md:col-span-1">
            <CategoryChart chartData={chartData} />
          </div>
        </div>

        <div id="transaction-form-section">
          <TransactionForm
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={resetForm}
            loading={loading}
          />
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          loading={loading}
          deletingId={deletingId}
          onEdit={handleStartEdit}
          onDelete={handleDeleteTransaction}
          dateRange={dateRange}
        />
      </div>
    </div>
  )
}