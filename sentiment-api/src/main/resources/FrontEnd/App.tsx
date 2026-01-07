
import React, { useState, Suspense, lazy } from 'react';
import * as XLSX from 'xlsx';
import { extractTextsFromFile } from './extractTextsFromFile';
import { ThemeMode, SentimentType, SentimentResult, ConnectionConfig, Language } from './types';
import { EmojiAtom } from './components/EmojiAtom';
import { SentimentDisplay } from './components/SentimentDisplay';
const AnalyticsCharts = lazy(() => import('./components/AnalyticsCharts').then(module => ({ default: module.AnalyticsCharts })));
import { analyzeSentiment, getSentimentHistory, SentimentLog } from './services/sentimentService';
import { 
  Sun, Moon, Zap, 
  Terminal, ArrowDown, 
  Send, 
  Database,
  FileJson, FileText, FileCode,
  Globe, Cpu, Layers
} from 'lucide-react';

const translations = {
  es: {
    title: "BRAND PULSE",
    subtitle: "Motor de Sentimiento Neuronal",
    terminal: "Análisis de Sentimiento",
    execute: "_EJECUTAR_ANALISIS",
    waiting: "ESPERANDO...",
    idleTitle: "SISTEMA_INACTIVO",
    idleSub: "ESPERANDO FLUJO DE DATOS NEURONALES...",
    outputFormats: "_FORMATOS_DE_SALIDA",
    enterprise: "Integración Empresarial",
    enterpriseText: "OPTIMIZADO PARA FLUJOS BIG_DATA. COMPATIBLE CON SPRING_BOOT / PYTHON_ML.",
    dataTypes: "TIPOS DE DATOS ADMITIDOS",
    node: "NODO",
    port: "PUERTO",
    link: "ENLACE",
    established: "ESTABLECIDO_V01.BETA",
    lang: "IDIOMA"
  },
  en: {
    title: "BRAND PULSE",
    subtitle: "Neural Sentiment Engine",
    terminal: "Sentiment Analysis",
    execute: "_EXECUTE_ANALYSIS",
    waiting: "WAITING...",
    idleTitle: "SYSTEM_IDLE",
    idleSub: "AWAITING NEURAL_FEED DATA FOR RECONSTRUCTION...",
    outputFormats: "_OUTPUT_FORMATS",
    enterprise: "Enterprise Integration",
    enterpriseText: "OPTIMIZED FOR BIG_DATA FLUX. COMPATIBLE WITH SPRING_BOOT / PYTHON_ML.",
    dataTypes: "SUPPORTED DATA TYPES",
    node: "NODE",
    port: "PORT",
    link: "LINK",
    established: "ESTABLISHED_V01.BETA",
    lang: "LANGUAGE"
  },
  pt: {
    title: "BRAND PULSE",
    subtitle: "Motor de Sensação Neuronal",
    terminal: "análise de sentimento",
    execute: "_EXECUTAR_ANALISE",
    waiting: "AGUARDANDO...",
    idleTitle: "SISTEMA_INATIVO",
    idleSub: "AGUARDANDO FLUXO DE DADOS NEURONAIS...",
    outputFormats: "_FORMATOS_DE_SAIDA",
    enterprise: "Integração Empresarial",
    enterpriseText: "OTIMIZADO PARA FLUXOS BIG_DATA. COMPATÍVEL COM SPRING_BOOT / PYTHON_ML.",
    dataTypes: "TIPOS DE DADOS SUPORTADOS",
    node: "NÓ",
    port: "PORTA",
    link: "LINK",
    established: "ESTABELECIDO_V01.BETA",
    lang: "IDIOMA"
  }
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.DARK);
  // Solo modo oscuro y neón
  const themeOptions = [
    { mode: ThemeMode.DARK, icon: <Moon size={18} /> },
    { mode: ThemeMode.NEON, icon: <Zap size={18} /> },
  ];
  const [lang, setLang] = useState<Language>(Language.ES);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [conn] = useState<ConnectionConfig>({ endpoint: 'api.brandpulse.io', port: '8080' });
  const [history, setHistory] = useState<SentimentLog[]>([]);

  React.useEffect(() => {
    getSentimentHistory().then(setHistory).catch(() => setHistory([]));
  }, [result]);
  const t = translations[lang];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeSentiment(inputText);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // El manejo de archivos ahora se hace con extractTextsFromFile

  const handleFile = async (file: File | null) => {
    if (!file) return;
    try {
      setUploadedFileName(file.name);
      setIsAnalyzing(true);
      // Extraer textos del archivo (.json, .csv, .xlsx)
      const texts = await extractTextsFromFile(file);
      if (!texts.length) {
        setInputText('');
        setIsAnalyzing(false);
        return;
      }
      setInputText(''); // No mostrar base64 ni datos crudos
      // Analizar cada texto y mostrar resultados
      let lastResult = null;
      for (const text of texts) {
        try {
          const data = await analyzeSentiment(text);
          setResult(data); // Muestra el último en la gráfica
        } catch (error) {
          console.error(error);
        }
      }
      setIsAnalyzing(false);
    } catch (e) {
      setIsAnalyzing(false);
      console.error(e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const isNeon = theme === ThemeMode.NEON;
  const isLight = theme === ThemeMode.LIGHT;

  const dataTypes = [
    { name: "JSON Streams", icon: FileJson },
    { name: "Social Feeds", icon: Globe },
    { name: "User Reviews", icon: FileText },
    { name: "Raw Logs", icon: Cpu }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${
      isLight ? 'bg-slate-50 text-slate-900' :
      theme === ThemeMode.DARK ? 'bg-slate-950 text-slate-100' :
      'bg-black text-white'
    }`}>
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500 blur-[120px]" />
      </div>
      <header className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
        <div className="flex items-center gap-6">
          <EmojiAtom />
          <div>
            <h1 className={`text-4xl font-bold tracking-tighter font-pixel ${isNeon ? 'neon-text-cyan' : isLight ? 'text-slate-900' : ''}`}>{t.title}</h1>
            <p className={`text-[12px] uppercase mt-2 opacity-60 font-pixel tracking-tighter ${isLight ? 'text-slate-700' : ''}`}>{t.subtitle}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Selector de tema solo iconos */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {themeOptions.map(opt => (
              <button
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`p-2 rounded transition-all border-2 font-pixel text-xs flex items-center ${theme === opt.mode ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_#ff00ff]' : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'}`}
                title={opt.mode === ThemeMode.DARK ? 'Oscuro' : 'Neón'}
              >
                {opt.icon}
              </button>
            ))}
          </div>
          {/* Selector de idioma solo iconos */}
          <div className="flex items-center gap-2 ml-4">
            {[
              { value: 'es', icon: <span className="font-pixel text-xs">ES</span> },
              { value: 'en', icon: <span className="font-pixel text-xs">EN</span> },
              { value: 'pt', icon: <span className="font-pixel text-xs">POR</span> }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setLang(opt.value as Language)}
                className={`p-2 rounded border-2 font-pixel text-xs flex items-center ${lang === opt.value ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_#ff00ff]' : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'}`}
                title={opt.value.toUpperCase()}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Columna izquierda */}
          <div className="lg:col-span-5 space-y-12">
            <div className={`p-10 border-4 transition-all ${isNeon ? 'neon-border-pink bg-black shadow-[8px_8px_0px_#ff00ff]' : isLight ? 'border-slate-900 bg-white shadow-[10px_10px_0px_rgba(15,23,42,1)]' : 'border-current shadow-[10px_10px_0px_currentColor]'}`}> 
              <div className="flex items-center gap-3 mb-8">
                <Terminal size={24} className={isNeon ? 'neon-text-pink' : isLight ? 'text-slate-900' : ''} />
                <h2 className={`font-bold uppercase text-[12px] font-pixel tracking-tighter ${isLight ? 'text-slate-900' : ''}`}>{t.terminal}</h2>
              </div>
              {/* API DATA TYPES SECTION + Importar archivo */}
              <div className={`mb-10 p-4 border-2 neon-border-pink bg-black`}>
                <h3 className={`text-[10px] font-pixel mb-4 flex items-center gap-2 text-cyan-400`}>
                  <Layers size={14} /> TIPOS DE DATOS ADMITIDOS
                </h3>
                <div className="flex flex-col gap-4 items-center">
                  <button
                    className="w-full py-4 px-6 border-4 border-cyan-500/50 hover:border-cyan-500 text-cyan-400 rounded-lg font-pixel text-xs font-bold transition-all"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    ARRASTRA O SELECCIONA UN ARCHIVO .JSON, .CSV O EXCEL
                  </button>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".json,.csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/csv"
                    onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="relative group" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <div className={`w-full h-56 p-4 border-4 transition-all outline-none font-pixel text-[12px] leading-relaxed flex flex-col ${isNeon ? 'bg-black border-pink-500/30 text-pink-50' : 'bg-white dark:bg-slate-900 border-current'}`}> 
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe tu comentario para análisis o adjunta un archivo .json, .csv, .xlsx..."
                    className="w-full flex-1 p-4 bg-transparent resize-none outline-none font-pixel text-[12px] leading-relaxed"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !inputText.trim()}
                    className={`w-full mt-4 py-6 font-bold uppercase flex items-center justify-center gap-4 transition-all font-pixel text-[14px] ${
                      isAnalyzing ? 'opacity-50 cursor-not-allowed' :
                      isNeon ? 'bg-pink-600 hover:bg-pink-500 shadow-[0_0_25px_#ff00ff]' :
                      isLight ? 'bg-slate-900 text-white hover:bg-slate-800 hover:translate-y-[-4px]' :
                      'bg-current text-slate-900 dark:text-slate-900 hover:translate-y-[-4px] active:translate-y-0'
                    }`}
                  >
                    {isAnalyzing ? t.waiting : (<>{t.execute} <Send size={20} /></>)}
                  </button>
                  {uploadedFileName && (
                    <div className="mt-2 text-xs text-cyan-400 font-pixel truncate">Archivo cargado: {uploadedFileName}</div>
                  )}
                </div>
              </div>
            </div>
            {/* Eliminado box de integración empresarial */}
          </div>
          {/* Columna derecha */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            {result ? (
              <div className="w-full space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
                <SentimentDisplay
                  result={result}
                  theme={theme}
                />
                <Suspense fallback={<div className="w-full h-96 flex items-center justify-center font-pixel opacity-50">LOADING_ANALYTICS...</div>}>
                  <AnalyticsCharts data={result} theme={theme} />
                </Suspense>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[600px] text-center opacity-30">
                <div className={`w-24 h-24 border-8 border-current border-t-transparent animate-spin mb-10 ${isLight ? 'border-slate-900 border-t-transparent' : ''}`} />
                <h3 className={`text-3xl font-bold uppercase tracking-[0.3em] mb-4 font-pixel ${isLight ? 'text-slate-900' : ''}`}>{t.idleTitle}</h3>
                <p className={`text-[14px] font-pixel leading-tight ${isLight ? 'text-slate-800' : ''}`}>{t.idleSub}</p>
              </div>
            )}
          </div>
        </div>
        {/* Historial de comentarios abarcando ambas columnas */}
        <div className="w-full bg-white/10 rounded-lg p-4 select-none mt-12 mb-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg">Historial de comentarios clasificados</span>
            <button
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-pixel text-xs rounded shadow"
              onClick={() => downloadHistoryAndChart(history, result)}
            >
              Descargar historial y gráfica
            </button>
          </div>
          <div className="w-full mt-4 overflow-x-auto">
            <table className="min-w-full w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300/20">
                  <th className="py-1 pr-2">Fecha</th>
                  <th className="py-1 pr-2">Comentario</th>
                  <th className="py-1 pr-2">Clasificación</th>
                  <th className="py-1 pr-2">Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-4 opacity-60">Sin historial</td></tr>
                )}
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-slate-300/10 hover:bg-slate-200/10">
                    <td className="py-1 pr-2 whitespace-nowrap">{new Date(item.fecha).toLocaleString()}</td>
                    <td className="py-1 pr-2 max-w-[600px] truncate" title={item.text}>{item.text}</td>
                    <td className="py-1 pr-2 font-bold">
                      {item.prevision === 'POSITIVE' && <span className="text-green-500">Positivo</span>}
                      {item.prevision === 'NEGATIVE' && <span className="text-red-500">Negativo</span>}
                      {item.prevision === 'NEUTRAL' && <span className="text-yellow-500">Neutral</span>}
                    </td>
                    <td className="py-1 pr-2">{item.probabilidad.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

// Utilidad para descargar historial y gráfica
function downloadHistoryAndChart(history, result) {
  // Descargar historial como Excel
  const wsData = [
    ['Fecha', 'Comentario', 'Clasificación', 'Probabilidad'],
    ...history.map(item => [
      new Date(item.fecha).toLocaleString(),
      item.text || '',
      item.prevision,
      item.probabilidad
    ])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Historial');

  // Descargar gráfica como imagen (si existe)
  const chartCanvas = document.querySelector('canvas');
  if (chartCanvas) {
    const imgURL = chartCanvas.toDataURL('image/png');
    // Insertar imagen en una nueva hoja (como base64, Excel la mostrará como texto, pero es lo máximo posible solo con JS puro)
    const imgSheet = XLSX.utils.aoa_to_sheet([
      ['Gráfica de Sentimientos'],
      [' '],
      ['La imagen se descarga como archivo aparte: grafica_sentimientos.png']
    ]);
    XLSX.utils.book_append_sheet(wb, imgSheet, 'Gráfica');

    // Descargar imagen como archivo aparte
    const a2 = document.createElement('a');
    a2.href = imgURL;
    a2.download = 'grafica_sentimientos.png';
    a2.click();
  }

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'historial_sentimientos.xlsx';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default App;

