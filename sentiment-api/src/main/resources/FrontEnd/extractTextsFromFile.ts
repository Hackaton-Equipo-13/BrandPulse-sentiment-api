// Utilidad para extraer textos de archivos .xlsx y .csv
import * as XLSX from 'xlsx';

export function extractTextsFromFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const lower = file.name.toLowerCase();
    const reader = new FileReader();
    if (lower.endsWith('.json')) {
      reader.onload = () => {
        try {
          const json = JSON.parse(String(reader.result || '[]'));
          if (Array.isArray(json)) {
            if (json.length > 0 && typeof json[0] === 'object') {
              const keys = Object.keys(json[0]);
              const textKey = keys.find(k => /coment|text|review|mensaje|message/i.test(k)) || keys[0];
              resolve(json.map((item: any) => String(item[textKey] || '')));
            } else {
              resolve(json.map((item: any) => String(item)));
            }
          } else {
            resolve([String(json)]);
          }
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    } else if (lower.endsWith('.csv')) {
      reader.onload = () => {
        try {
          const text = String(reader.result || '');
          const lines = text.split(/\r?\n/).filter(Boolean);
          const hasHeader = lines[0].includes(',');
          let idx = 0;
          if (hasHeader) {
            const headers = lines[0].split(',');
            idx = headers.findIndex(h => /coment|text|review|mensaje|message/i.test(h));
            if (idx === -1) idx = 0;
            resolve(lines.slice(1).map(l => l.split(',')[idx] || ''));
          } else {
            resolve(lines);
          }
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      reader.onload = () => {
        try {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          let idx = 0;
          if (json.length > 0 && Array.isArray(json[0])) {
            const headers = json[0].map((h: any) => String(h));
            idx = headers.findIndex(h => /coment|text|review|mensaje|message/i.test(h));
            if (idx === -1) idx = 0;
            resolve(json.slice(1).map((row: any) => String(row[idx] || '')));
          } else {
            resolve([]);
          }
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Tipo de archivo no soportado.'));
    }
  });
}
