"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { i18n } from "@/locales";

interface TransactionFormProps {
  isEditing: boolean;
  formData: {
    type: string;
    amount: string;
    category: string;
    description: string;
    date: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function TransactionForm({
  isEditing,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
}: TransactionFormProps) {
  // ✅ 전역 언어 상태 가져오기
  const { language } = useLanguage();
  const t = i18n[language];

  // 번역 데이터 단축 참조
  const labels = t.form;
  const common = t.common;
  
  // ✅ 카테고리 목록을 현재 언어 설정에서 직접 가져옴 (실시간 반영의 핵심)
  const currentCategories = t.categories;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev: any) => ({
        ...prev,
        [name]: onlyNums,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {isEditing ? labels.editTitle : labels.addTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
          {/* 유형 선택 */}
          <div className="grid gap-2">
            <Label htmlFor="type" className="font-semibold">{labels.type}</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.typePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">{t.chart.income}</SelectItem>
                <SelectItem value="expense">{t.chart.expense}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 금액 입력 */}
          <div className="grid gap-2">
            <Label htmlFor="amount" className="font-semibold">{labels.amount}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {language === "en" ? "$" : "₩"}
              </span>
              <Input
                id="amount"
                name="amount"
                type="text"
                placeholder="0"
                value={formData.amount ? Number(formData.amount).toLocaleString() : ""}
                onChange={handleInputChange}
                required
                inputMode="numeric"
                className="pl-8 text-right font-bold text-lg"
              />
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className="grid gap-2">
            <Label htmlFor="category" className="font-semibold">{labels.category}</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.catPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {/* ✅ 현재 선택된 언어의 카테고리 목록을 맵핑 */}
                {currentCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 날짜 입력 */}
          <div className="grid gap-2">
            <Label htmlFor="date" className="font-semibold flex justify-between items-center">
              {labels.date}
              {/* ✅ 언어에 따라 날짜 포맷 가이드를 동적으로 표시 */}
              <span className="text-[10px] text-muted-foreground font-normal tabular-nums">
                {language === "ko" ? "(YYYY-MM-DD)" : "(MM/DD/YYYY)"}
              </span>
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              lang={language}
              className="w-full focus:ring-2 transition-all dark:bg-slate-900 dark:border-slate-800"
            />
          </div>

          {/* 설명 입력 */}
          <div className="md:col-span-2 grid gap-2">
            <Label htmlFor="description" className="font-semibold">{labels.description}</Label>
            <Input
              id="description"
              name="description"
              placeholder={labels.descPlaceholder}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-2">
            <Button 
              type="submit" 
              className="flex-1 font-bold h-11 text-base transition-all active:scale-95"
              disabled={loading}
            >
              {loading ? common.processing : isEditing ? labels.submitEdit : labels.submitAdd}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 text-base"
                onClick={onCancel}
              >
                {common.cancel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}