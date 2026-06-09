export default function TransparenciaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra superior secundaria */}
      <header className="bg-slate-900 shadow-md border-b-4 border-lime-500 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <span className="text-lime-500">🛡️</span> CENTRO DE TRANSPARENCIA
          </h1>
          <a href="/dashboard">
            <button className="text-slate-300 hover:text-white font-bold transition-colors">
              Volver al Panel
            </button>
          </a>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 mt-6">
        
        {/* Cabecera de la sección */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Auditoría y Documentos</h2>
          <p className="text-slate-600 font-medium max-w-3xl">
            La confianza se construye con datos reales. Aquí puedes descargar los estados de cuenta mensuales oficiales emitidos por nuestro bróker regulado en Estados Unidos.
          </p>
        </div>

        {/* Lista de Documentos (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Documento 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-yellow-400 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-2xl shadow-inner border border-red-200">
                📄
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-yellow-600 transition-colors">Estado de Cuenta - Mayo 2026</h3>
                <p className="text-sm text-slate-500 font-medium">Emitido por: Tastytrade | PDF (2.4 MB)</p>
              </div>
            </div>
            <button className="bg-slate-100 hover:bg-yellow-500 text-slate-700 hover:text-slate-900 h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors shadow-sm">
              ↓
            </button>
          </div>

          {/* Documento 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-yellow-400 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-2xl shadow-inner border border-red-200">
                📄
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-yellow-600 transition-colors">Estado de Cuenta - Abril 2026</h3>
                <p className="text-sm text-slate-500 font-medium">Emitido por: Tastytrade | PDF (2.1 MB)</p>
              </div>
            </div>
            <button className="bg-slate-100 hover:bg-yellow-500 text-slate-700 hover:text-slate-900 h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors shadow-sm">
              ↓
            </button>
          </div>

        </div>

        {/* Sección de Video Auditoría */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500 rounded-full blur-3xl opacity-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span> EN VIVO (Grabación)
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Auditoría Mensual y Reparto de Dividendos</h3>
              <p className="text-slate-400 font-medium mb-6">
                Revive la sesión de este mes donde entramos en vivo al bróker, verificamos los balances del fondo y ejecutamos la distribución a todas las billeteras.
              </p>
              <button className="bg-lime-500 hover:bg-lime-400 text-slate-900 px-6 py-3 rounded-lg font-extrabold shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                ▶ Ver Grabación Completa
              </button>
            </div>
            
            {/* Miniatura de video simulada */}
            <div className="w-full md:w-1/2 aspect-video bg-slate-800 rounded-xl border-2 border-slate-700 flex items-center justify-center shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent z-10"></div>
               <span className="text-5xl opacity-50 relative z-0">📊</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}