'use client'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function ModernLandingPage() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

  // Variantes de animación con tipado estricto oficial para evitar rabieta de TypeScript
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* 1. BARRA DE NAVEGACIÓN PREMIUM */}
      <nav className="border-b border-slate-800/60 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-black tracking-wider text-white">
            INVERSOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">LIBRE</span>
          </Link>

          {/* Menú Escritorio */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#beneficios" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Beneficios</a>
            <a href="#portafolios" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Mercados</a>
            <a href="#seguridad" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Seguridad</a>
            <Link href="/login" className="text-sm font-bold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider text-[11px]">
              Ingresar a Bóveda
            </Link>
          </div>

          {/* Hamburguesa Móvil */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)} 
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuMovilAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {menuMovilAbierto && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0f172a] border-b border-slate-800 p-4 space-y-3 shadow-xl flex flex-col"
          >
            <a href="#beneficios" onClick={() => setMenuMovilAbierto(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-xl">Beneficios</a>
            <a href="#portafolios" onClick={() => setMenuMovilAbierto(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-xl">Mercados</a>
            <a href="#seguridad" onClick={() => setMenuMovilAbierto(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-xl">Seguridad</a>
            <Link href="/login" onClick={() => setMenuMovilAbierto(false)} className="block w-full text-center bg-cyan-500 text-slate-950 font-black py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg">
              Ingresar a Bóveda
            </Link>
          </motion.div>
        )}
      </nav>

      {/* 2. SECCIÓN HERO (LA PRIMERA IMPRESIÓN MÁXIMA) */}
      <header className="relative pt-20 pb-24 md:pt-32 md:pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Efectos de luces de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/12 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-fuchsia-500/5 rounded-full blur-[60px] md:blur-[120px] pointer-events-none"></div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center relative z-10 space-y-6 md:space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Acceso Exclusivo a Mercados de EE.UU.</span>
          </motion.div>

          <motion.h2 
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.95]"
          >
            Hazte dueño de tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500">
              Libertad Financiera
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeInUp}
            className="max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 font-medium leading-relaxed px-2"
          >
            Infraestructura tecnológica avanzada para la exposición inteligente a los portafolios indexados del S&P 500 y mercados cripto de alta liquidez. Construye patrimonio con respaldo de grado institucional.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 px-4 w-full sm:w-auto mx-auto"
          >
            <Link href="/login" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 text-slate-950 font-black py-4.5 px-10 rounded-2xl transition-all uppercase tracking-widest text-xs text-center shadow-[0_0_30px_rgba(6,182,212,0.25)]">
              Aperturar Cuenta Gratuita
            </Link>
            <a href="#portafolios" className="w-full sm:w-auto text-center border border-slate-700 text-slate-300 hover:bg-slate-900/50 hover:text-white font-bold py-4.5 px-10 rounded-2xl transition-all uppercase tracking-widest text-xs">
              Explorar Portafolios
            </a>
          </motion.div>
        </motion.div>
      </header>

      {/* 3. SECCIÓN BENEFICIOS / DIFERENCIADORES */}
      <section id="beneficios" className="py-20 border-t border-slate-900 bg-[#01030a]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-2">¿Por qué Inversor Libre?</h3>
            <p className="text-2xl md:text-4xl font-black text-white tracking-tight">Ecosistema diseñado para la preservación de capital</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-[#0f172a]/50 border border-slate-800/80 p-8 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="text-3xl mb-4">🛡️</div>
              <h4 className="text-lg font-bold text-white mb-2">Bóvedas con Cifrado AES-256</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Toda la contabilidad, credenciales e historiales financieros están blindados bajo estrictos parámetros de seguridad criptográfica de extremo a extremo.</p>
            </div>
            <div className="bg-[#0f172a]/50 border border-slate-800/80 p-8 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="text-3xl mb-4">📈</div>
              <h4 className="text-lg font-bold text-white mb-2">Interés Compuesto Automático</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Nuestra tecnología te permite activar la reinversión de ganancias con un solo clic, multiplicando geométricamente tu rendimiento de manera desatendida.</p>
            </div>
            <div className="bg-[#0f172a]/50 border border-slate-800/80 p-8 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="text-3xl mb-4">📊</div>
              <h4 className="text-lg font-bold text-white mb-2">Diversificación Automatizada</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Fondos distribuidos estratégicamente en las empresas más estables del mercado norteamericano (Apple, Microsoft, Nvidia, Amazon) a través de ETFs directos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN MERCADOS (VISTA PREVIA DEL INTERIOR) */}
      <section id="portafolios" className="py-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-2">Vehículos Disponibles</h3>
          <p className="text-2xl md:text-4xl font-black text-white tracking-tight">Portafolios de Inversión Administrados</p>
          <p className="text-sm text-slate-400 mt-2">Selecciona la estrategia contable que se alinee con tu perfil de riesgo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Tarjeta 1 */}
          <div className="bg-[#0f172a]/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white">Indexado Básico</h4>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Bajo Riesgo</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Canasta diversificada de ETFs líquidos enfocados en replicar con exactitud el comportamiento de las 500 empresas más sólidas de EE.UU. (S&P 500).</p>
            </div>
            <div>
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 mb-4">
                <div><p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Target API</p><p className="text-lg font-black text-cyan-400">+5.5%</p></div>
                <div className="text-right"><p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Ingreso Min.</p><p className="text-lg font-bold text-white">$50 USD</p></div>
              </div>
              <Link href="/login" className="block w-full text-center py-3 bg-white hover:bg-slate-200 text-black font-black rounded-xl uppercase text-xs tracking-widest transition-colors">Contratar Plan</Link>
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-[#0f172a]/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-full blur-2xl"></div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white">Crecimiento Web3</h4>
                <span className="bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Moderado</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Exposición controlada a activos digitales de alta capitalización, contratos inteligentes regulados, ETFs de Bitcoin y nodos de validación de infraestructura descentralizada.</p>
            </div>
            <div>
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 mb-4">
                <div><p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Target API</p><p className="text-lg font-black text-fuchsia-400">+12%</p></div>
                <div className="text-right"><p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Ingreso Min.</p><p className="text-lg font-bold text-white">$25 USD</p></div>
              </div>
              <Link href="/login" className="block w-full text-center py-3 bg-white hover:bg-slate-200 text-black font-black rounded-xl uppercase text-xs tracking-widest transition-colors">Contratar Plan</Link>
            </div>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-[#0f172a]/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white">Institucional Premium</h4>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Corporativo</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Acceso preferencial a fondos privados de liquidez corporativa transnacional, con rendimientos optimizados mediante estrategias de colaterales estructurados.</p>
            </div>
            <div>
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 mb-4">
                <div><p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Target API</p><p className="text-lg font-black text-emerald-400">+25%</p></div>
                <div className="text-right"><p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Ingreso Min.</p><p className="text-lg font-bold text-white">$50 USD</p></div>
              </div>
              <Link href="/login" className="block w-full text-center py-3 bg-white hover:bg-slate-200 text-black font-black rounded-xl uppercase text-xs tracking-widest transition-colors">Contratar Plan</Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN AUDITORÍA / CONFIANZA */}
      <section id="seguridad" className="py-20 border-t border-slate-900 bg-slate-950/20 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center rounded-2xl mx-auto font-bold text-xl">🛡️</div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase tracking-wide">Transparencia Auditada</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Inversor Libre es un ecosistema cerrado de gestión de capital tecnológico. No retenemos claves privadas de custodia compartida desprotegidas y cumplimos con los protocolos contables de reporte de evidencias financieras manuales aprobados por nuestro Centro de Mando. Tus aportes están resguardados frente a fluctuaciones tecnológicas locales.
          </p>
        </div>
      </section>

      {/* 6. FOOTER CORPORATIVO (CON ATRIBUCIÓN CODEMAGNUM Y LINKS ENLAZADOS) */}
      <footer className="border-t border-slate-900 bg-[#01030a] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white">INVERSOR<span className="text-cyan-400">LIBRE</span></h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Tecnología financiera de vanguardia para la optimización contable y exposición inteligente de capitales a los mercados financieros globales.
            </p>
          </div>

          {/* Col 2: Enlaces Legales Reales Conectados Directamente a la página Legal */}
          <div className="space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Marco Legal</h5>
            <ul className="space-y-2 text-xs font-bold text-slate-500">
              <li><Link href="/legales#terminos" className="hover:text-cyan-400 transition-colors">Términos del Servicio</Link></li>
              <li><Link href="/legales#privacidad" className="hover:text-cyan-400 transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/legales#aml" className="hover:text-cyan-400 transition-colors">Prevención de Lavado (AML)</Link></li>
            </ul>
          </div>

          {/* Col 3: Enlace de Soporte */}
          <div className="space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Mesa de Ayuda</h5>
            <p className="text-xs text-slate-500 leading-relaxed">¿Necesitas soporte institucional?</p>
            <Link href="/login" className="inline-block text-xs font-bold text-cyan-400 hover:underline uppercase tracking-widest">
              Abrir Ticket en Bóveda →
            </Link>
          </div>
        </div>

        {/* Cierre Técnico con Atribución Exclusiva a la Agencia */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            © 2026 CODEMAGNUM. Todos los derechos reservados. Desarrollado bajo estándares de auditoría criptográfica.
          </p>
        </div>
      </footer>

    </div>
  )
}