import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string) {
  if (data.length === 0) return;

  // 1. 데이터를 엑셀용 객체 배열로 변환
  const excelData = data.map((row) => ({
    "날짜": row.date,
    "유형": row.type === "income" ? "수입" : "지출",
    "금액": row.amount,
    "카테고리": row.category || "기타",
    "설명": row.description || "",
  }));

  // 2. 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 3. ⭐ 셀 너비(Column Width) 설정
  // wch는 글자 수 기준입니다. 한글은 보통 2를 곱해주는 게 안전해요.
  const colWidths = [
    { wch: 15 }, // 날짜
    { wch: 10 }, // 유형
    { wch: 15 }, // 금액
    { wch: 15 }, // 카테고리
    { wch: 40 }, // 설명 (설명은 길 수 있으니 크게!)
  ];
  worksheet['!cols'] = colWidths;

  // 4. 워크북 생성 및 파일 쓰기
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "거래내역");

  // 파일 다운로드
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}