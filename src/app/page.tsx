 'use client'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Link from 'next/link'

export default function ModernLandingPage() {
  // Variantes de animación para reusar
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black overflow-hidden">
      
      {/* CAPA DE FONDOS Y GRADIENTES (CIBER-SEGURIDAD) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="relative z-50 flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter">
          INVERSOR<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">LIBRE</span>
        </h1>
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#plataforma" className="hover:text-cyan-400 transition-colors">La Plataforma</a>
          <a href="#etf" className="hover:text-cyan-400 transition-colors">Tecnología ETF</a>
          <a href="#seguridad" className="hover:text-cyan-400 transition-colors">Seguridad</a>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="hidden md:flex items-center px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="/login" className="px-6 md:px-8 py-2.5 bg-white text-black font-black uppercase tracking-widest text-[10px] md:text-xs rounded-full hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
            Abrir Bóveda
          </Link>
        </div>
      </nav>

      {/* HERO SECTION (IMPACTO INICIAL) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-40 text-center flex flex-col items-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Gestión de Capital Institucional</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white">
            INTELIGENCIA FINANCIERA <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500">SIN INTERMEDIARIOS</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Accede a portafolios indexados y tecnología Blockchain de alto rendimiento. Construimos tu patrimonio con la seguridad de un banco suizo y la agilidad de la Web3.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:scale-105 transition-all">
              Comenzar a Invertir
            </Link>
            <a href="#etf" className="px-10 py-5 bg-transparent border border-slate-700 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-slate-800 transition-all">
              Conocer Metodología
            </a>
          </div>
        </motion.div>
      </section>

      {/* CINTA DE CONFIANZA (ESTADÍSTICAS) */}
      <div className="relative z-10 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
          <div>
            <p className="text-3xl md:text-4xl font-black text-white font-mono">99.9%</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">Uptime de Servidores</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-cyan-400 font-mono">24/7</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">Auditoría de Fondos</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-white font-mono">0.0%</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">Comisiones Ocultas</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-fuchsia-400 font-mono">+150</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">Activos Indexados</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN: LA PLATAFORMA Y ETF */}
      <section id="etf" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">El Ecosistema <span className="text-cyan-400">Perfecto</span></h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Tu capital no especula, invierte. Utilizamos ETFs (Exchange Traded Funds) para diversificar el riesgo y asegurar un crecimiento sostenido.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
          {[
            {
              icono: "🌐",
              titulo: "Diversificación Global (ETFs)",
              desc: "Tu dinero se distribuye en cestas de acciones de las empresas más sólidas del mundo. Menor riesgo, mayor estabilidad a largo plazo."
            },
            {
              icono: "⚡",
              titulo: "Infraestructura Blockchain",
              desc: "Procesamos ingresos y retiros a través de la red BSC (BEP20) de Binance y protocolos encriptados para garantizar liquidez inmediata."
            },
            {
              icono: "🏛️",
              titulo: "Respaldo Bancario Local",
              desc: "Integración fluida con el sistema financiero dominicano (Banreservas, BHD, QIK) para entradas y salidas de capital sin fricción."
            }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="bg-gradient-to-br from-slate-900 to-[#020617] border border-slate-800 p-10 rounded-[2rem] hover:border-cyan-500/30 transition-colors group">
              <div className="text-4xl mb-6 bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{item.icono}</div>
              <h4 className="text-xl font-black text-white mb-4">{item.titulo}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECCIÓN: SEGURIDAD (VITAL PARA FINTECH) */}
      <section id="seguridad" className="relative z-10 py-32 bg-slate-900/20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400">Auditoría y Ciberseguridad</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
              TU PATRIMONIO, <br/>
              <span className="text-slate-500">BLINDADO.</span>
            </h3>
            <div className="space-y-6">
              {[
                { title: "Cifrado End-to-End", text: "Toda tu información personal y financiera viaja encriptada bajo estándares militares AES-256." },
                { title: "Bóvedas en Frío (Cold Storage)", text: "El 95% de los activos digitales se mantienen fuera de línea, imposibilitando vulnerabilidades de red." },
                { title: "Pasarela PayPal Certificada", text: "Procesamiento de tarjetas de crédito tercerizado y asegurado por la infraestructura global de PayPal." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 bg-cyan-500/20 text-cyan-400 p-1 rounded">✓</div>
                  <div>
                    <h5 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">{item.title}</h5>
                    <p className="text-slate-400 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="relative bg-[#020617] border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado del Sistema</span>
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Operativo</span>
              </div>
              <div className="space-y-4 font-mono text-xs text-slate-400">
                <p>&gt; Validando protocolos de red...</p>
                <p className="text-emerald-400">&gt; Conexión segura establecida.</p>
                <p>&gt; Indexando Smart Contracts BEP20...</p>
                <p className="text-emerald-400">&gt; Blockchain sincronizada.</p>
                <p className="mt-8 text-cyan-400 animate-pulse">_Esperando credenciales de usuario</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LLAMADO A LA ACCIÓN FINAL */}
      <section className="relative z-10 py-32 text-center px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-[#020617] border border-slate-800 p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">Toma el control de tu futuro hoy.</h3>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">Únete al ecosistema privado de Inversor Libre y haz que tu capital trabaje con la eficiencia del 1%.</p>
          <Link href="/login" className="inline-block px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform">
            Crear Cuenta Gratuita
          </Link>
        </div>
      </section>

      {/* FOOTER CORPORATIVO */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#01030a] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-black tracking-tighter text-white mb-4">
              INVERSOR<span className="text-cyan-400">LIBRE</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
              Tecnología financiera avanzada para la gestión inteligente de capitales a través de mercados indexados y activos digitales.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Términos del Servicio</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Prevención de Lavado (AML)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Soporte</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contacto Corporativo</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs uppercase tracking-widest">© 2026 CodeMagnum Agency. Todos los derechos reservados.</p>
          <p className="text-slate-700 text-[10px] uppercase tracking-widest">Santo Domingo, República Dominicana.</p>
        </div>
      </footer>
    </main>
  )
}