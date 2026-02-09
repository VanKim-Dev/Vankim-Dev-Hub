export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  // 1. 헤더 설정 (한글 깨짐 방지를 위해 BOM 추가)
  const headers = ["날짜", "유형", "금액", "카테고리", "설명"];
  const csvRows = [
    "\uFEFF" + headers.join(","), // UTF-8 BOM + Header
  ];

  // 2. 데이터 행 변환
  data.forEach((row) => {
    const values = [
      row.date,
      row.type === "income" ? "수입" : "지출",
      row.amount,
      row.category || "기타",
      `"${(row.description || "").replace(/"/g, '""')}"`, // 쉼표가 포함된 설명을 위해 따옴표 처리
    ];
    csvRows.push(values.join(","));
  });

  // 3. Blob 생성 및 다운로드
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}