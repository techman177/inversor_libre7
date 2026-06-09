import Link from 'next/link'

export default function LegalesPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* NAVEGACIÓN SIMPLE */}
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter text-white">
            INVERSOR<span className="text-cyan-400">LIBRE</span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors">
            ← Volver al Inicio
          </Link>
        </div>
      </nav>

      {/* CABECERA LEGAL */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actualizado: Junio 2026</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Transparencia y Legalidad</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Documentación oficial que rige el uso de la plataforma tecnológica y los servicios financieros proporcionados por CodeMagnum Agency.
        </p>
      </header>

      {/* CONTENIDO DE LOS CONTRATOS */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-20">
        
        {/* TÉRMINOS Y CONDICIONES */}
        <article id="terminos" className="scroll-mt-32">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest border-l-4 border-cyan-400 pl-4">1. Términos de Servicio</h2>
          <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
            <p>
              <strong className="text-white">1.1. Aceptación:</strong> Al acceder y registrarse en Inversor Libre, el usuario acepta estar sujeto a los presentes Términos de Servicio. La plataforma actúa como un puente tecnológico para la exposición a activos indexados y mercado de criptomonedas.
            </p>
            <p>
              <strong className="text-white">1.2. Riesgo de Inversión:</strong> Los mercados financieros e indexados conllevan riesgos. Inversor Libre y CodeMagnum Agency proporcionan la infraestructura tecnológica para la gestión del capital, pero no garantizan rendimientos fijos absolutos, dado que estos están sujetos a la volatilidad del mercado (S&P 500, ETFs, Web3).
            </p>
            <p>
              <strong className="text-white">1.3. Gestión de Capital:</strong> Los fondos depositados son gestionados bajo estrictos parámetros de seguridad (Cold Storage). Las solicitudes de retiro de liquidez están sujetas a tiempos de auditoría que pueden variar entre 24 y 48 horas hábiles.
            </p>
          </div>
        </article>

        {/* POLÍTICA DE PRIVACIDAD */}
        <article id="privacidad" className="scroll-mt-32">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest border-l-4 border-fuchsia-500 pl-4">2. Política de Privacidad</h2>
          <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
            <p>
              <strong className="text-white">2.1. Recopilación de Datos:</strong> Recopilamos información estrictamente necesaria para la creación de la bóveda del usuario (correo electrónico, identificadores únicos y comprobantes de pago) con la finalidad de mantener la integridad contable de la plataforma.
            </p>
            <p>
              <strong className="text-white">2.2. Protección (Cifrado):</strong> Toda la información sensible y financiera de nuestros clientes se encuentra protegida mediante protocolos criptográficos AES-256. CodeMagnum Agency no comercializa, vende ni comparte datos de usuarios con terceros ajenos a la operativa técnica del servicio.
            </p>
            <p>
              <strong className="text-white">2.3. Transparencia:</strong> Los usuarios tienen derecho a solicitar el borrado completo de su historial y cierre de bóveda en cualquier momento, siempre y cuando no existan contratos activos de inversión en ejecución.
            </p>
          </div>
        </article>

        {/* POLÍTICA AML */}
        <article id="aml" className="scroll-mt-32">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest border-l-4 border-blue-500 pl-4">3. Prevención de Lavado de Activos (AML)</h2>
          <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
            <p>
              <strong className="text-white">3.1. Cumplimiento Normativo:</strong> En cumplimiento con los estándares internacionales de Prevención de Lavado de Dinero (AML) y Conoce a tu Cliente (KYC), Inversor Libre audita rigurosamente el origen de los fondos depositados vía transferencias bancarias o Blockchain.
            </p>
            <p>
              <strong className="text-white">3.2. Restricciones:</strong> La plataforma se reserva el derecho de rechazar comprobantes de pago, bloquear temporalmente bóvedas o solicitar documentación adicional de identidad si los sistemas automatizados detectan patrones transaccionales inusuales o no justificados.
            </p>
          </div>
        </article>

      </section>

      {/* FOOTER SIMPLE */}
      <footer className="border-t border-slate-800 bg-[#01030a] py-8 text-center mt-12">
        <p className="text-slate-600 text-xs uppercase tracking-widest">
          © 2026 CodeMagnum Agency. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  )
}