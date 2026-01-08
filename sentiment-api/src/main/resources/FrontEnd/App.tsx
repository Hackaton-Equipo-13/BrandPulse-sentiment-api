import React, { useState, Suspense, lazy, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { extractTextsFromFile } from './extractTextsFromFile';
import { ThemeMode, SentimentType, SentimentResult, ConnectionConfig, Language, SentimentLog } from './types';
import { EmojiAtom } from './components/EmojiAtom';
import { SentimentDisplay } from './components/SentimentDisplay';
const AnalyticsCharts = lazy(() => import('./components/AnalyticsCharts').then(module => ({ default: module.AnalyticsCharts })));
import { analyzeSentiment, analyzeSentimentFromUrl, getSentimentHistory } from './services/sentimentService';
import { 
  Sun, Moon, Zap, 
  Terminal, ArrowDown, 
  Send, 
  Database,
  FileJson, FileText, FileCode,
  Globe, Cpu, Layers, Link
} from 'lucide-react';

const translations = {
  es: {
    title: "BRAND PULSE",
    subtitle: "Motor de Sentimiento Neuronal",
    terminal: "Análisis de Sentimiento",
    url_terminal: "Análisis de URL",
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
    url_terminal: "URL Analysis",
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
    url_terminal: "Análise de URL",
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
  const [lang, setLang] = useState<Language>(Language.ES);
  const [inputText, setInputText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [conn] = useState<ConnectionConfig>({ endpoint: 'api.brandpulse.io', port: '8080' });
  const [history, setHistory] = useState<SentimentLog[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    getSentimentHistory().then(setHistory).catch(() => setHistory([]));
  }, [result]);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const t = translations[lang];

  const handleTextAnalyze = async () => {
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
  
  const handleUrlAnalyze = async () => {
    if (!urlInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeSentimentFromUrl(urlInput);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneralAnalyze = () => {
    if (urlInput.trim()) {
      handleUrlAnalyze();
    } else if (inputText.trim()) {
      handleTextAnalyze();
    }
  };

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    try {
      setUploadedFileName(file.name);
      setIsAnalyzing(true);
      const texts = await extractTextsFromFile(file);
      if (!texts.length) {
        setInputText('');
        setIsAnalyzing(false);
        return;
      }
      setInputText(texts.join('\n')); 
      for (const text of texts) {
        try {
          const data = await analyzeSentiment(text);
          setResult(data);
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

  const themeOptions = [
    { mode: ThemeMode.LIGHT, icon: <Sun size={18} /> },
    { mode: ThemeMode.DARK, icon: <Moon size={18} /> },
    { mode: ThemeMode.NEON, icon: <Zap size={18} /> },
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

      <header className="container mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col md:flex-row justify-between items-center relative z-10 gap-4 md:gap-8">
        <div className="flex items-center gap-6">
          <EmojiAtom />
          <div>
            <h1 className={`text-4xl font-bold tracking-tighter flex items-center gap-4 font-pixel ${isNeon ? 'neon-text-cyan' : isLight ? 'text-slate-900' : ''}`}>
              {t.title} <span className={`text-[10px] opacity-70 px-3 py-1 border-4 rounded-lg ${isLight ? 'border-slate-900' : 'border-current'}`}>V.01 beta</span>
            </h1>
            <p className={`text-[12px] uppercase mt-2 opacity-60 font-pixel tracking-tighter ${isLight ? 'text-slate-700' : ''}`}>
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Language Switcher */}
          <div className={`flex items-center gap-1 p-1 border-4 rounded-lg ${isNeon ? 'neon-border-cyan' : isLight ? 'border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)]' : 'border-current shadow-[4px_4px_0px_currentColor]'}`}>
            {Object.values(Language).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 font-pixel text-[10px] transition-all uppercase rounded-md ${ 
                  lang === l ? (isLight ? 'bg-slate-900 text-white' : 'bg-current text-black') : 'opacity-40 hover:opacity-100'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Switcher */}
          <div className={`flex items-center gap-2 p-1 border-4 rounded-lg ${isNeon ? 'neon-border-pink' : isLight ? 'border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)]' : 'border-current shadow-[4px_4px_0px_currentColor]'}`}>
            {themeOptions.map(opt => (
              <button
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`p-2 transition-all rounded-md ${
                  theme === opt.mode ? (
                    isLight ? 'bg-slate-900 text-white' : 
                    theme === ThemeMode.DARK ? 'bg-slate-100 text-slate-950' : 
                    'bg-pink-600 shadow-[0_0_15px_#ff00ff] text-white'
                  ) : 'opacity-40 hover:opacity-100'
                }`}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          <div className="lg:col-span-5 space-y-12">
            <div className={`p-4 sm:p-6 md:p-10 border-4 transition-all rounded-lg ${ 
              isNeon ? 'neon-border-pink bg-black shadow-[8px_8px_0px_#ff00ff]' : 
              isLight ? 'border-slate-900 bg-white shadow-[10px_10px_0px_rgba(15,23,42,1)]' : 
              'border-current shadow-[10px_10px_0px_currentColor]'
            }`}>
              <div className="flex items-center gap-3 mb-8">
                <Terminal size={24} className={isNeon ? 'neon-text-pink' : isLight ? 'text-slate-900' : ''} />
                <h2 className={`font-bold uppercase text-[12px] font-pixel tracking-tighter ${isLight ? 'text-slate-900' : ''}`}>{t.terminal}</h2>
              </div>
              
              <div className="relative mb-6">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/reviews"
                  className={`w-full p-4 border-4 outline-none font-pixel text-[12px] leading-relaxed rounded-2xl ${ 
                    isNeon ? 'bg-black border-pink-500/30 text-pink-50 neon-animated-border' : 
                    isLight ? 'bg-slate-50 border-slate-900 text-slate-900' : 
                    'bg-white dark:bg-slate-900 border-current'
                  }`}
                />
                <button
                  onClick={handleUrlAnalyze}
                  disabled={isAnalyzing || !urlInput.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-all rounded-lg ${ 
                    isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125 active:scale-100'
                  }`}
                >
                  <Link size={20} />
                </button>
              </div>

              <div className={`my-8 p-4 border-2 rounded-lg ${isNeon ? 'border-cyan-400/20' : 'border-slate-400/20'}`}>
                <h3 className={`text-[10px] font-pixel mb-4 flex items-center gap-2 ${isNeon ? 'text-cyan-400' : ''}`}>
                  <Layers size={14} /> {t.dataTypes}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {dataTypes.map(type => (
                    <div key={type.name} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg">
                      <type.icon size={16} className={`opacity-60 ${isNeon ? 'text-cyan-300': ''}`} />
                      <span className="font-pixel text-[10px] opacity-80">{type.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className={`relative group p-4 border-4 rounded-2xl transition-all flex flex-col ${isNeon ? 'bg-black border-pink-500/30 neon-animated-border' : isLight ? 'bg-slate-50 border-slate-900' : 'bg-slate-900 border-current'}`} 
                onDrop={handleDrop} 
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('fileInput')?.click()} // Trigger hidden file input
              >
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe o arrastra un archivo (.json, .csv, o .xlsx) aquí..."
                  className="w-full flex-1 h-32 p-2 bg-transparent resize-none outline-none font-pixel text-[12px] leading-relaxed rounded-lg"
                />
                <input
                    id="fileInput"
                    type="file"
                    accept=".json,.csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/csv"
                    onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                  />
                <button
                  onClick={handleGeneralAnalyze}
                  disabled={isAnalyzing || (!inputText.trim() && !urlInput.trim())}
                  className={`w-full mt-4 py-6 font-bold uppercase flex items-center justify-center gap-4 transition-all font-pixel text-[14px] rounded-lg ${
                    isNeon ? 'bg-pink-600 hover:bg-pink-500 shadow-[0_0_25px_#ff00ff] neon-animated-border' :
                    isLight ? 'bg-slate-900 text-white hover:bg-slate-800' :
                    'bg-current text-slate-900 hover:bg-slate-300'
                  } ${ (isAnalyzing || (!inputText.trim() && !urlInput.trim())) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-100' }`}
                >
                  {isAnalyzing ? t.waiting : (<>{t.execute} <Send size={20} /></>)}
                </button>
                {uploadedFileName && (
                  <div className="mt-2 text-xs text-cyan-400 font-pixel truncate">Archivo cargado: {uploadedFileName}</div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            {result ? (
              <div className="w-full space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
                <SentimentDisplay
                  result={result}
                  theme={theme}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[600px] text-center opacity-30">
                <div className={`w-24 h-24 border-8 border-t-transparent animate-spin mb-10 rounded-full ${isLight ? 'border-slate-900 border-t-transparent' : 'border-current'}`} />
                <h3 className={`text-3xl font-bold uppercase tracking-[0.3em] mb-4 font-pixel ${isLight ? 'text-slate-900' : ''}`}>{t.idleTitle}</h3>
                <p className={`text-[14px] font-pixel leading-tight ${isLight ? 'text-slate-800' : ''}`}>{t.idleSub}</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Charts Section - Full Width */}
        {result && (
          <div className="mt-16 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Suspense fallback={<div className="w-full h-96 flex items-center justify-center font-pixel opacity-50">LOADING_ANALYTICS...</div>}>
              <AnalyticsCharts data={result} theme={theme} />
            </Suspense>
          </div>
        )}
        
        {/* Historial de comentarios */}
        <div className={`w-full bg-white/10 rounded-lg p-4 select-none mt-12 mb-8 max-w-7xl mx-auto ${isLight ? 'bg-white/80' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-doto text-lg">Historial de comentarios clasificados</span>
            <div className="relative">
              <button
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-ibm-plex text-xs rounded-lg shadow transition-transform hover:scale-105"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              >
                Descargar historial
              </button>
              {showDownloadMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-20 ${isLight ? 'bg-white' : 'bg-slate-800'}`}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); downloadHistory('xlsx', history); setShowDownloadMenu(false); }}
                    className={`block px-4 py-2 text-sm font-ibm-plex ${isLight ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'}`}
                  >
                    Descargar como XLSX
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); downloadHistory('csv', history); setShowDownloadMenu(false); }}
                    className={`block px-4 py-2 text-sm font-ibm-plex ${isLight ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'}`}
                  >
                    Descargar como CSV
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); downloadHistory('json', history); setShowDownloadMenu(false); }}
                    className={`block px-4 py-2 text-sm font-ibm-plex ${isLight ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-slate-700'}`}
                  >
                    Descargar como JSON
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="w-full mt-4 overflow-x-auto">
            <table className="min-w-full w-full text-xs text-left font-ibm-plex">
              <thead>
                <tr className="border-b border-slate-300/20">
                  <th className="py-1 pr-2">Fecha</th>
                  <th className="py-1 pr-2">Comentario</th>
                  <th className="py-1 pr-2">Clasificación</th>
                  <th className="py-1 pr-2">Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-4 opacity-60">Sin historial</td></tr>
                )}
                {paginatedHistory.map((item) => (
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
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 font-ibm-plex text-xs rounded-lg shadow transition-transform hover:scale-105 ${
                    isLight ? 'bg-slate-200 text-slate-800 disabled:opacity-50' : 'bg-slate-700 text-white disabled:opacity-50'
                  }`}
                >
                  Anterior
                </button>
                <span className="font-ibm-plex text-sm">Página {currentPage} de {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 font-ibm-plex text-xs rounded-lg shadow transition-transform hover:scale-105 ${
                    isLight ? 'bg-slate-200 text-slate-800 disabled:opacity-50' : 'bg-slate-700 text-white disabled:opacity-50'
                  }`}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Utilidad para descargar historial
function downloadHistory(format: 'xlsx' | 'csv' | 'json', history: SentimentLog[]) {
  const historyData = history.map(item => ({
    Fecha: new Date(item.fecha).toLocaleString(),
    Comentario: item.text || '',
    Clasificacion: item.prevision,
    Probabilidad: item.probabilidad
  }));

  if (format === 'xlsx') {
    const ws = XLSX.utils.json_to_sheet(historyData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_sentimientos.xlsx';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else if (format === 'csv') {
    const ws = XLSX.utils.json_to_sheet(historyData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_sentimientos.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else if (format === 'json') {
    const json = JSON.stringify(historyData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_sentimientos.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export default App;

