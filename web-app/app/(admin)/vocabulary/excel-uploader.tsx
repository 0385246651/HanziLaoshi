"use client"

import { useState, useRef } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Upload, X, Check, FileSpreadsheet, Loader2 } from "lucide-react"
import { importVocabulary } from "./actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ExcelUploader() {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [skippedRows, setSkippedRows] = useState<{ row: number; reason: string; data: any }[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    const { validData, skipped } = await parseExcel(selectedFile)
    setPreviewData(validData)
    setSkippedRows(skipped)
  }

  const parseExcel = (file: File): Promise<{ validData: any[], skipped: any[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: "array" })

          let allValidData: any[] = [];
          let allSkipped: any[] = [];

          workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName]

            // 1. First, find the header row by scanning first 20 rows
            const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
            let headerRowIndex = 0;

            // Keywords to identify header row
            const headerKeywords = ['hanzi', 'hán tự', 'hán', 'meaning', 'nghĩa', 'definition', 'pinyin'];

            const foundHeaderIndex = rawRows.slice(0, 20).findIndex(row => {
              // Check if row has at least 2 matching columns
              const cellValues = row.map(c => String(c).toLowerCase().trim());
              const matches = cellValues.filter(val => headerKeywords.some(k => val.includes(k)));
              return matches.length >= 2;
            });

            if (foundHeaderIndex !== -1) {
              headerRowIndex = foundHeaderIndex;

            } else {
              console.warn(`No header found in sheet ${sheetName}, using first row.`);
            }

            // 2. Parse using the found header row
            const jsonData = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex });

            // Extract level from sheet Name as fallback
            let sheetLevel = 1;
            const match = sheetName.match(/\d+/);
            if (match) sheetLevel = parseInt(match[0]);

            // Helper to find key
            const findKey = (row: any, candidates: string[]) => {
              const keys = Object.keys(row);
              for (const candidate of candidates) {
                if (row[candidate] !== undefined) return row[candidate];
                const key = keys.find(k => k.trim().toLowerCase() === candidate.toLowerCase());
                if (key) return row[key];
              }
              return '';
            }

            // 3. Normalize and Validate
            jsonData.forEach((row: any, index) => {
              // Parse Level
              let hskLevel = sheetLevel;
              const levelRaw = findKey(row, ['Level', 'HSK', 'Cấp độ', 'Trình độ']);
              if (levelRaw) {
                if (typeof levelRaw === 'number') hskLevel = levelRaw;
                else {
                  const m = String(levelRaw).match(/\d+/);
                  if (m) hskLevel = parseInt(m[0]);
                }
              }

              const hanzi = findKey(row, ['Hán tự', 'Hanzi', 'Character', 'Word', 'Chữ Hán']);
              const meaning = findKey(row, ['Nghĩa', 'Meaning', 'Definition', 'Nghĩa tiếng việt']);

              if (!hanzi || String(hanzi).trim() === '') {
                // Skip check: Is it perhaps an "Example" row?
                // But for now, we strictly skip and report.
                allSkipped.push({
                  row: index + headerRowIndex + 2, // Excel row number (1-based + header offset)
                  reason: 'Thiếu Hán tự (Hanzi)',
                  data: row
                });
                return;
              }

              const newItem = {
                hsk_level: hskLevel,
                hanzi: String(hanzi).trim(),
                pinyin: findKey(row, ['Pinyin', 'Phiên âm']),
                meaning: String(meaning).trim(), // Allow empty meaning? Better to warn.
                audio_url: findKey(row, ['Phát âm', 'Audio', 'Sound', 'Mp3', 'Link', 'Audio Url']),
                example: findKey(row, ['Ví dụ (chữ hán)', 'Ví dụ', 'Example', 'Sentence', 'Câu ví dụ']),
                example_pinyin: findKey(row, ['Phiên âm ví dụ', 'Example Pinyin', 'Phiên âm']),
                example_meaning: findKey(row, ['Dịch', 'Example Meaning', 'Dịch nghĩa', 'Nghĩa ví dụ', 'Dịch'])
              };

              allValidData.push(newItem);
            });
          })


          resolve({ validData: allValidData, skipped: allSkipped })
        } catch (error) {
          console.error("Error parsing excel:", error);
          reject(error);
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  const handleUpload = async () => {
    if (previewData.length === 0) return
    setIsUploading(true)

    try {
      const result = await importVocabulary(previewData)
      if (result.error) {
        toast.error(`Lỗi import: ${result.error}`)
      } else {
        toast.success(`Đã import thành công ${previewData.length} từ vựng!`)
        setIsOpen(false)
        setFile(null)
        setPreviewData([])
        setSkippedRows([])
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi upload.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    // Download the static template file from public folder
    const link = document.createElement('a');
    link.href = '/samples/Template_TuVung_HSK.xlsx';
    link.download = 'Template_TuVung_HSK.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white">
          <Upload className="w-4 h-4" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Từ vựng từ Excel</DialogTitle>
          <DialogDescription>
            Hỗ trợ tự động tìm dòng tiêu đề. Các cột cần thiết: <strong>Hán tự, Pinyin, Nghĩa</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 px-1">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" className="gap-2 text-green-700 border-green-200 hover:bg-green-50" onClick={handleDownloadTemplate}>
              <FileSpreadsheet className="w-4 h-4" />
              Tải file mẫu chuẩn
            </Button>
          </div>

          {!file ? (
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#ff6933] hover:bg-[#ff6933]/5 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">Bấm để chọn file Excel</p>
              <p className="text-sm text-gray-400 mt-1">Hỗ trợ định dạng .xlsx, .xls</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded text-green-600">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#2E333D]">{file.name}</p>
                    <div className="flex gap-3 text-xs">
                      <span className="text-green-600 font-medium">✔ {previewData.length} hợp lệ</span>
                      {skippedRows.length > 0 && (
                        <span className="text-red-500 font-medium">⚠ {skippedRows.length} bị bỏ qua</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPreviewData([]); setSkippedRows([]); }}>
                  <X className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              {/* Skipped Rows Warning */}
              {skippedRows.length > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <span className="bg-orange-200 text-orange-800 text-[10px] px-1.5 py-0.5 rounded-full">{skippedRows.length}</span>
                    Dòng bị bỏ qua (Không thể Import)
                  </h4>
                  <div className="max-h-[150px] overflow-y-auto text-xs space-y-1 pr-2">
                    {skippedRows.map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-gray-600 border-b border-orange-100/50 pb-1 last:border-0">
                        <span className="font-mono text-orange-700 min-w-[50px]">Hàng {item.row}:</span>
                        <span className="flex-1 truncate">{JSON.stringify(item.data)}</span>
                        <span className="text-red-500 font-medium whitespace-nowrap">{item.reason}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-orange-600 mt-2 italic">* Các dòng này thiếu "Hán tự" hoặc sai định dạng.</p>
                </div>
              )}

              {/* Valid Data Preview */}
              {previewData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Xem trước dữ liệu hợp lệ ({previewData.length})</h4>
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/50">
                          <TableHead className="w-[60px]">HSK</TableHead>
                          <TableHead>Hán tự</TableHead>
                          <TableHead>Pinyin</TableHead>
                          <TableHead>Nghĩa</TableHead>
                          <TableHead>Ví dụ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 5).map((row, i) => (
                          <TableRow key={i}>
                            <TableCell>{row.hsk_level}</TableCell>
                            <TableCell className="font-bold text-lg">{row.hanzi}</TableCell>
                            <TableCell>{row.pinyin}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{row.meaning}</TableCell>
                            <TableCell className="max-w-[200px] truncate text-xs">
                              <div className="font-medium">{row.example}</div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {previewData.length > 5 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-xs text-gray-400 py-2">
                              ... và {previewData.length - 5} hàng nữa
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="bg-gray-50 -mx-6 -mb-6 p-4 border-t border-gray-100 mt-auto">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>
          <Button
            disabled={!file || isUploading || previewData.length === 0}
            onClick={handleUpload}
            className="bg-[#ff6933] hover:bg-[#e55022] text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Xác nhận Import ({previewData.length} từ)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
