'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  
  // Datos Financieros
  const [balance, setBalance] = useState(0)
  const [ganancias, setGanancias] = useState(0)
  const [reinvertir, setReinvertir] = useState(false)
  const [configEmpresa, setConfigEmpresa] = useState<any>(null)
  
  // Listas de datos
  const [paquetes, setPaquetes] = useState<any[]>([])
  const [historialTx, setHistorialTx] = useState<any[]>([])
  const [misInversiones, setMisInversiones] = useState<any[]>([])

  // Interfaz
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [temaOscuro, setTemaOscuro] = useState(true)
  
  // Modales
  const [modalActivo, setModalActivo] = useState<'ninguno' | 'deposito' | 'retiro' | 'seguridad' | 'detalle_paquete'>('ninguno')
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<any>(null)
  const [tabDeposito, setTabDeposito] = useState<'banco' | 'crypto' | 'tarjeta'>('crypto')
  const [modalPayPal, setModalPayPal] = useState(false)
  
  const [alerta, setAlerta] = useState<{ visible: boolean, titulo: string, mensaje: string, tipo: 'info'|'error'|'exito'|'confirmacion', accionConfirmar?: () => void }>({ visible: false, titulo: '', mensaje: '', tipo: 'info' })
  
  // Formularios
  const [monto, setMonto] = useState('')
  const [montoPayPal, setMontoPayPal] = useState(0)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [subiendo, setSubiendo] = useState(false)
  
  // Seguridad
  const [nuevoCorreo, setNuevoCorreo] = useState('')
  const [nuevaContrasena, setNuevaContrasena] = useState('')

  // Retiros
  const [metodoRetiro, setMetodoRetiro] = useState<'banco' | 'crypto'>('crypto')
  const [bancoNombre, setBancoNombre] = useState('')
  const [cuentaNumero, setCuentaNumero] = useState('')
  const [walletDireccion, setWalletDireccion] = useState('')
  const [redCrypto, setRedCrypto] = useState('BSC (BEP20)')

  useEffect(() => {
    cargarDatosPlataforma()
  }, [])

  const cargarDatosPlataforma = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUserId(user.id)

    let { data: billetera } = await supabase.from('billeteras').select('*').eq('id_usuario', user.id).single()
    if (billetera) {
      setUserData(billetera)
      setBalance(Number(billetera.balance_total))
      setGanancias(Number(billetera.ganancias_historicas))
      setReinvertir(billetera.reinvertir_ganancias)
    }

    const { data: listaPaquetes } = await supabase.from('paquetes_inversion').select('*').order('rentabilidad_pct', { ascending: true })
    if (listaPaquetes) setPaquetes(listaPaquetes)

    const { data: txs } = await supabase.from('transacciones').select('*').eq('id_usuario', user.id).order('fecha', { ascending: false }).limit(5)
    if (txs) setHistorialTx(txs)

    // AQUI CARGAMOS LAS INVERSIONES DEL USUARIO
    const { data: invs } = await supabase.from('inversiones_usuario').select('*, paquetes_inversion(*)').eq('id_usuario', user.id).eq('estado', 'activa')
    if (invs) setMisInversiones(invs)

    const { data: config } = await supabase.from('configuracion_empresa').select('*').eq('id', 1).single()
    if (config) setConfigEmpresa(config)
    
    setLoading(false)
  }

  const mostrarAlerta = (titulo: string, mensaje: string, tipo: 'info'|'error'|'exito' = 'info') => {
    setAlerta({ visible: true, titulo, mensaje, tipo })
  }

  const mostrarConfirmacion = (titulo: string, mensaje: string, accion: () => void) => {
    setAlerta({ visible: true, titulo, mensaje, tipo: 'confirmacion', accionConfirmar: accion })
  }

  const copiarAlPortapapeles = (texto: string, mensaje: string) => {
    navigator.clipboard.writeText(texto)
    mostrarAlerta('Copiado', `${mensaje} copiado al portapapeles.`, 'exito')
  }

  const toggleReinversion = async () => {
    const nuevoEstado = !reinvertir
    setReinvertir(nuevoEstado)
    await supabase.from('billeteras').update({ reinvertir_ganancias: nuevoEstado }).eq('id_usuario', userId)
    mostrarAlerta('Preferencia Guardada', nuevoEstado ? 'Tus ganancias ahora generarán interés compuesto automático.' : 'Las ganancias se enviarán a tu balance líquido.', 'exito')
  }

  const actualizarSeguridad = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubiendo(true)
    try {
      if (nuevoCorreo) {
        const { error } = await supabase.auth.updateUser({ email: nuevoCorreo })
        if (error) throw error
        mostrarAlerta('Correo Actualizado', 'Revisa tu bandeja para confirmar el cambio.', 'exito')
      }
      if (nuevaContrasena) {
        const { error } = await supabase.auth.updateUser({ password: nuevaContrasena })
        if (error) throw error
        mostrarAlerta('Seguridad Actualizada', 'Contraseña cambiada exitosamente.', 'exito')
      }
      setModalActivo('ninguno')
    } catch (error: any) { mostrarAlerta('Error', error.message, 'error') } finally { setSubiendo(false) }
  }

  const abrirDetallePaquete = (paquete: any) => {
    setPaqueteSeleccionado(paquete)
    setModalActivo('detalle_paquete')
  }

  const ejecutarInversion = async () => {
    if (!paqueteSeleccionado) return
    if (balance < paqueteSeleccionado.monto_minimo) {
      setModalActivo('deposito')
      return
    }
    
    mostrarConfirmacion('Firma de Contrato', `¿Autorizas el débito de $${paqueteSeleccionado.monto_minimo} USD para fondear el portafolio "${paqueteSeleccionado.nombre}"?`, async () => {
      const nuevoBalance = balance - paqueteSeleccionado.monto_minimo
      await supabase.from('billeteras').update({ balance_total: nuevoBalance }).eq('id_usuario', userId)
      await supabase.from('inversiones_usuario').insert([{ id_usuario: userId, id_paquete: paqueteSeleccionado.id, monto_invertido: paqueteSeleccionado.monto_minimo }])
      setAlerta({ ...alerta, visible: false })
      setModalActivo('ninguno')
      mostrarAlerta('Contrato Activo', `Fondos indexados exitosamente en "${paqueteSeleccionado.nombre}".`, 'exito')
      cargarDatosPlataforma()
    })
  }

  const procesarDepositoConComprobante = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!monto || Number(monto) <= 0) return mostrarAlerta('Monto Inválido', 'Ingresa un monto mayor a 0.', 'error')
    if (!archivo) return mostrarAlerta('Evidencia Faltante', 'Debes adjuntar el comprobante.', 'error')
    setSubiendo(true)
    try {
      const fileExt = archivo.name.split('.').pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('comprobantes').upload(`depositos/${fileName}`, archivo)
      if (uploadError) throw new Error('Error de conexión con la bóveda de imágenes.')
      const { data: { publicUrl } } = supabase.storage.from('comprobantes').getPublicUrl(`depositos/${fileName}`)
      
      await supabase.from('transacciones').insert([{ id_usuario: userId, tipo: 'DEPOSITO', monto: Number(monto), estado: 'pendiente', metodo_pago: tabDeposito === 'banco' ? 'BANCO' : 'CRYPTO', comprobante_url: publicUrl }])
      
      mostrarAlerta('Auditoría Iniciada', 'Comprobante en revisión. Tus fondos se reflejarán pronto.', 'exito')
      setModalActivo('ninguno'); setMonto(''); setArchivo(null); cargarDatosPlataforma()
    } catch (error: any) { mostrarAlerta('Error', error.message, 'error') } finally { setSubiendo(false) }
  }

  const prepararPagoTarjeta = (e: React.FormEvent) => {
    e.preventDefault()
    const valor = Number(monto)
    if (!valor || valor <= 0) return mostrarAlerta('Monto Inválido', 'Monto incorrecto.', 'error')
    setMontoPayPal(valor); setModalActivo('ninguno'); setModalPayPal(true)
  }

  const ejecutarRedireccionPayPal = async () => {
    setSubiendo(true)
    const total = montoPayPal + (montoPayPal * 0.054) + 0.30
    try {
      await supabase.from('transacciones').insert([{ id_usuario: userId, tipo: 'DEPOSITO', monto: montoPayPal, estado: 'pendiente', metodo_pago: 'TARJETA_CREDITO' }])
      window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=techtouch1a@gmail.com&amount=${total.toFixed(2)}&currency_code=USD&item_name=Aporte%20Capital%20Inversor%20Libre`
    } catch (error) { setSubiendo(false) }
  }

  const registrarRetiro = async (e: React.FormEvent) => {
    e.preventDefault()
    const cantidad = Number(monto)
    if (cantidad <= 0 || cantidad > balance) return mostrarAlerta('Operación Denegada', 'Fondos líquidos insuficientes.', 'error')
    await supabase.from('transacciones').insert([{ id_usuario: userId, tipo: 'RETIRO', monto: cantidad, estado: 'pendiente', metodo_pago: metodoRetiro === 'banco' ? 'BANCO' : 'CRYPTO', banco_nombre: metodoRetiro === 'banco' ? bancoNombre : null, cuenta_numero: metodoRetiro === 'banco' ? cuentaNumero : null, wallet_direccion: metodoRetiro === 'crypto' ? walletDireccion : null, red_crypto: metodoRetiro === 'crypto' ? redCrypto : null }])
    await supabase.from('billeteras').update({ balance_total: balance - cantidad }).eq('id_usuario', userId)
    mostrarAlerta('Liquidación en Proceso', 'Retiro enviado a revisión departamental.', 'exito')
    setModalActivo('ninguno'); setMonto(''); cargarDatosPlataforma()
  }

  if (loading) return <div className="min-h-screen bg-[#020617] text-white flex justify-center items-center font-black tracking-widest uppercase">Validando Conexión Segura...</div>
  const totalInvertido = misInversiones.reduce((acc, inv) => acc + Number(inv.monto_invertido), 0)

  // Cálculos para el modal de depósito (Spread / Fee)
  const montoValor = Number(monto) || 0
  const feeTecnico = montoValor * 0.015
  const totalABoveda = montoValor - feeTecnico

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-500 overflow-x-hidden ${temaOscuro ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <header className={`border-b backdrop-blur-xl p-5 px-8 flex justify-between items-center sticky top-0 z-40 transition-colors ${temaOscuro ? 'border-slate-800/80 bg-[#0f172a]/90' : 'border-slate-200 bg-white/90'}`}>
        <h1 className="text-xl md:text-2xl font-black tracking-wider">
          INVERSOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">LIBRE</span>
        </h1>
        
        <div className="relative">
          <button onClick={() => setMenuAbierto(!menuAbierto)} className={`p-2 rounded-lg transition-colors ${temaOscuro ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          {menuAbierto && (
            <div className={`absolute right-0 mt-4 w-[90vw] max-w-[250px] md:w-64 rounded-2xl shadow-2xl border overflow-hidden transition-colors ${temaOscuro ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className={`p-4 border-b ${temaOscuro ? 'border-slate-800' : 'border-slate-100'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titular de Cuenta</p>
                <p className={`text-sm font-bold truncate ${temaOscuro ? 'text-white' : 'text-black'}`}>{userData?.nombre} {userData?.apellido}</p>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button onClick={() => { setModalActivo('seguridad'); setMenuAbierto(false) }} className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-bold transition-colors ${temaOscuro ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                  <span>🔒</span> Seguridad de Bóveda
                </button>
                <button onClick={() => { setTemaOscuro(!temaOscuro); setMenuAbierto(false) }} className={`flex items-center justify-between w-full text-left p-3 rounded-xl text-sm font-bold transition-colors ${temaOscuro ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                  <span className="flex items-center gap-3"><span>{temaOscuro ? '☀️' : '🌙'}</span> Interfaz</span>
                  <span className={`text-[10px] px-2 py-1 rounded-md uppercase ${temaOscuro ? 'bg-slate-900' : 'bg-slate-200'}`}>{temaOscuro ? 'Oscuro' : 'Claro'}</span>
                </button>
                <a href="/dashboard/soporte" onClick={() => setMenuAbierto(false)} className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-bold transition-colors ${temaOscuro ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                  <span>🎧</span> Centro de Soporte
                </a>
                <a href="https://wa.me/18094301811" target="_blank" rel="noreferrer" onClick={() => setMenuAbierto(false)} className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-bold transition-colors ${temaOscuro ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                  <span>💬</span> Contactar Asesor Oficial
                </a>
              </div>
              <div className={`p-2 border-t ${temaOscuro ? 'border-slate-800' : 'border-slate-100'}`}>
                <button onClick={() => { supabase.auth.signOut().then(() => window.location.href = '/login') }} className="flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors">
                  <span>🚪</span> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 mt-6 flex-grow w-full space-y-10">
        
        {/* EL NUEVO SALUDO VIP */}
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>
            Hola, {userData?.nombre || 'Inversor'} 👋
          </h2>
          <p className={temaOscuro ? 'text-slate-400' : 'text-slate-500'}>Resumen de tu patrimonio indexado.</p>
        </div>

        {/* PANEL PRINCIPAL (HERO) */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-colors ${temaOscuro ? 'bg-gradient-to-br from-[#0f172a] to-[#020617] border-slate-800' : 'bg-gradient-to-br from-white to-slate-100 border-slate-200'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className={`text-[10px] md:text-xs font-bold tracking-widest mb-2 uppercase flex items-center gap-2 ${temaOscuro ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Liquidez Disponible
                </p>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-medium text-cyan-500 font-mono">USD</span>
                </h2>
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button onClick={() => setModalActivo('deposito')} className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 text-white font-black py-4 px-8 rounded-xl transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)]">Fondear Bóveda</button>
                <button onClick={() => setModalActivo('retiro')} className={`w-full md:w-auto border font-black py-4 px-8 rounded-xl transition-all uppercase tracking-widest text-xs ${temaOscuro ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>Retirar Capital</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`border p-6 rounded-[2rem] flex-1 flex flex-col justify-center relative overflow-hidden transition-colors ${temaOscuro ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-[40px]"></div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Ganancias Acumuladas</p>
              <h3 className="text-3xl font-black text-fuchsia-500">+${ganancias.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            
            <div className={`border p-6 rounded-[2rem] flex-1 flex flex-col justify-center transition-colors ${temaOscuro ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Interés Compuesto</p>
                <button onClick={toggleReinversion} className={`w-10 h-5 rounded-full relative transition-colors ${reinvertir ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${reinvertir ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
              <p className={`text-xs font-bold ${reinvertir ? 'text-cyan-400' : 'text-slate-500'}`}>
                {reinvertir ? 'Reinversión Automática ON' : 'Ganancias a saldo líquido'}
              </p>
            </div>
          </div>
        </div>

        {/* LA NUEVA CARTERA ACTIVA (Solo se muestra si tiene inversiones) */}
        {misInversiones.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6 mt-8">
              <h3 className={`text-xl font-black uppercase tracking-widest border-l-4 border-emerald-400 pl-4 ${temaOscuro ? 'text-white' : 'text-slate-800'}`}>Mi Portafolio Activo</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${temaOscuro ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>Total Indexado: ${totalInvertido.toLocaleString('en-US')}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {misInversiones.map((inv) => (
                <div key={inv.id} className={`border rounded-2xl p-6 relative overflow-hidden ${temaOscuro ? 'bg-gradient-to-br from-[#0f172a] to-[#020617] border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-[20px]"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Contrato Activo</p>
                      <h4 className={`text-lg font-bold ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>{inv.paquetes_inversion?.nombre}</h4>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className={`text-3xl font-black mb-4 ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>${Number(inv.monto_invertido).toLocaleString('en-US')}</p>
                  <div className={`pt-4 border-t flex justify-between text-[10px] font-mono uppercase font-bold ${temaOscuro ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span>Target: +{inv.paquetes_inversion?.rentabilidad_pct}%</span>
                    <span>Fecha: {new Date(inv.fecha_inicio).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentos y Fiscalidad */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 mt-8">
          <p className="text-sm text-slate-400 mb-3">Documentos Fiscales y de Custodia</p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="text-white font-medium">Estado de Cuenta 2026 (Consolidado)</p>
                <p className="text-xs text-slate-500">Generado por Hapi Securities LLC</p>
              </div>
            </div>
            <div>
              <a href="/EstadoCuenta2026.pdf" download className="inline-block px-4 py-2 rounded-xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition">Descargar PDF</a>
            </div>
          </div>
        </div>

        {/* VITRINA DE PORTAFOLIOS OFICIALES */}
        <div>
          <h3 className={`text-xl font-black mb-6 uppercase tracking-widest border-l-4 border-cyan-400 pl-4 mt-8 ${temaOscuro ? 'text-white' : 'text-slate-800'}`}>Mercados Institucionales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paquetes.map((paquete) => (
              <div key={paquete.id} onClick={() => abrirDetallePaquete(paquete)} className={`border rounded-3xl p-6 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer ${temaOscuro ? 'bg-[#111827]/60 border-slate-800 hover:border-cyan-500/40' : 'bg-white border-slate-200 hover:border-cyan-400'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h4 className={`text-lg font-black tracking-tight mb-2 ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>{paquete.nombre}</h4>
                  <p className={`text-xs mb-6 min-h-[40px] ${temaOscuro ? 'text-slate-400' : 'text-slate-500'}`}>{paquete.descripcion}</p>
                </div>
                <div className="relative z-10">
                  <div className={`flex justify-between items-center mb-6 p-4 rounded-2xl border ${temaOscuro ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Target API</p><p className="text-xl font-black text-cyan-500">+{paquete.rentabilidad_pct}%</p></div>
                    <div className="text-right"><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Ingreso</p><p className={`text-lg font-bold ${temaOscuro ? 'text-white' : 'text-black'}`}>${paquete.monto_minimo}</p></div>
                  </div>
                  <button className={`w-full py-3.5 font-black rounded-xl transition-colors uppercase text-xs tracking-widest ${temaOscuro ? 'bg-slate-800 text-white group-hover:bg-cyan-500 group-hover:text-black' : 'bg-slate-100 text-slate-800 group-hover:bg-cyan-500 group-hover:text-white'}`}>Ver Composición</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* 1. MODAL DE DETALLE DE PAQUETE (La Pared de Liquidez)          */}
      {/* ============================================================== */}
      {modalActivo === 'detalle_paquete' && paqueteSeleccionado && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex justify-center items-center p-4">
          <div className={`w-[95%] md:w-full md:max-w-lg rounded-3xl p-5 md:p-8 relative shadow-[0_0_50px_rgba(6,182,212,0.15)] border ${temaOscuro ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setModalActivo('ninguno')} className="absolute top-6 right-6 text-slate-400 hover:text-cyan-500 font-mono text-lg">✕</button>
            <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-widest rounded-md mb-4">Ficha Técnica</div>
            <h3 className={`text-2xl font-black mb-2 tracking-tight ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>{paqueteSeleccionado.nombre}</h3>
            <p className={`text-sm mb-6 ${temaOscuro ? 'text-slate-400' : 'text-slate-600'}`}>{paqueteSeleccionado.descripcion}</p>
            
            <div className={`p-5 rounded-2xl border mb-6 ${temaOscuro ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Composición de Activos (ETFs)</p>
              <div className="space-y-2">
                {paqueteSeleccionado.etfs_oficiales ? paqueteSeleccionado.etfs_oficiales.split(',').map((etf: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-cyan-500 text-lg">📈</span>
                    <span className={`text-sm font-bold font-mono ${temaOscuro ? 'text-white' : 'text-slate-800'}`}>{etf.trim()}</span>
                  </div>
                )) : <span className="text-xs text-slate-400 italic">Cesta diversificada institucional.</span>}
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Monto Operativo</p>
                <p className={`text-xl font-black ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>${paqueteSeleccionado.monto_minimo} USD</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retorno Est.</p>
                <p className="text-xl font-black text-emerald-400">+{paqueteSeleccionado.rentabilidad_pct}%</p>
              </div>
            </div>

            {balance < paqueteSeleccionado.monto_minimo ? (
              <div className="text-center">
                <p className="text-xs text-red-400 font-bold mb-3 uppercase tracking-widest">Liquidez Insuficiente</p>
                <button onClick={ejecutarInversion} className="w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg">Depositar Fondos Ahora</button>
              </div>
            ) : (
              <button onClick={ejecutarInversion} className="w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg">Firmar Contrato (Invertir)</button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MODAL DE SEGURIDAD                                          */}
      {/* ============================================================== */}
      {modalActivo === 'seguridad' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex justify-center items-center p-4">
          <div className={`w-[95%] md:w-full md:max-w-md rounded-3xl p-5 md:p-8 relative shadow-2xl border ${temaOscuro ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setModalActivo('ninguno')} className="absolute top-6 right-6 text-slate-400 hover:text-cyan-500 font-mono text-lg">✕</button>
            <h3 className={`text-xl font-black mb-6 uppercase tracking-widest ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>🔒 Seguridad</h3>
            <form onSubmit={actualizarSeguridad} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nuevo Correo</label>
                <input type="email" placeholder="Dejar en blanco para omitir" value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-sm outline-none transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nueva Contraseña</label>
                <input type="password" placeholder="Mínimo 6 caracteres" value={nuevaContrasena} onChange={(e) => setNuevaContrasena(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-sm outline-none transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />
              </div>
              <button type="submit" disabled={subiendo || (!nuevoCorreo && !nuevaContrasena)} className={`w-full py-4 rounded-xl uppercase tracking-widest text-xs font-black transition-all ${subiendo || (!nuevoCorreo && !nuevaContrasena) ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg'}`}>Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MODAL DE DEPÓSITO COMPLETO                                  */}
      {/* ============================================================== */}
      {modalActivo === 'deposito' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex justify-center items-center p-4">
          <div className={`w-[95%] md:w-full md:max-w-xl rounded-3xl p-5 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar border ${temaOscuro ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setModalActivo('ninguno')} className="absolute top-6 right-6 text-slate-400 hover:text-cyan-500 font-mono text-lg">✕</button>
            <h3 className={`text-xl font-black mb-4 uppercase tracking-widest ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>Aportar Capital</h3>
            
            <div className={`flex gap-1 mb-6 p-1 rounded-xl border ${temaOscuro ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button type="button" onClick={() => setTabDeposito('crypto')} className={`flex-1 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${tabDeposito === 'crypto' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-500'}`}>Cripto</button>
              <button type="button" onClick={() => setTabDeposito('banco')} className={`flex-1 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${tabDeposito === 'banco' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-500'}`}>Bancos RD</button>
              <button type="button" onClick={() => setTabDeposito('tarjeta')} className={`flex-1 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${tabDeposito === 'tarjeta' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-500'}`}>Tarjeta</button>
            </div>

            {tabDeposito === 'crypto' && configEmpresa && (
               <div className={`rounded-xl p-4 mb-6 border text-sm ${temaOscuro ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                 <p className="font-bold text-cyan-500 text-xs uppercase mb-2 tracking-widest">Red: BSC (BEP20) USDT</p>
                 <div className="flex justify-between items-center"><span className={`font-mono text-[10px] md:text-xs ${temaOscuro ? 'text-slate-300' : 'text-slate-700'}`}>{configEmpresa.wallet_usdt_bep20}</span><button onClick={() => copiarAlPortapapeles(configEmpresa.wallet_usdt_bep20, 'Wallet')} className="text-cyan-500 text-xs font-bold hover:underline">Copiar</button></div>
               </div>
            )}
            
            {tabDeposito === 'banco' && (
               <div className={`rounded-xl p-4 mb-6 border text-sm ${temaOscuro ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-emerald-900/20 border-emerald-500/50'}`}>
                 <p className="text-[13px] text-emerald-100">🛡️ <span className="font-bold">Fondos Custodiados Internacionalmente.</span> Tu capital se transfiere directamente a las cuentas institucionales de nuestro Corresponsal de Corretaje Oficial (Hapi Securities LLC, miembro de FINRA y SIPC).</p>
               </div>
            )}

            <form onSubmit={tabDeposito === 'tarjeta' ? prepararPagoTarjeta : procesarDepositoConComprobante}>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Monto a Depositar (USD)</label>
              <input type="number" required value={monto} onChange={(e) => setMonto(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-lg mb-4 outline-none font-mono transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-100">Monto a procesar</span>
                  <span className="font-mono text-sm text-white">${montoValor.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-slate-400">Fee Tecnológico CodeMagnum (1.5%)</span>
                  <span className="text-sm text-rose-400 font-mono">${feeTecnico.toFixed(2)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-black text-white">Total a Bóveda</span>
                  <span className="text-cyan-400 font-black text-lg font-mono">${totalABoveda.toFixed(2)}</span>
                </div>
              </div>

              {tabDeposito !== 'tarjeta' && (
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Adjuntar Comprobante *</label>
                  <input type="file" accept="image/*" required onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)} className={`w-full text-sm file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold cursor-pointer ${temaOscuro ? 'text-slate-400 file:bg-slate-800 file:text-white hover:file:bg-slate-700' : 'text-slate-600 file:bg-slate-200 file:text-black hover:file:bg-slate-300'}`} />
                </div>
              )}

              <button type="submit" disabled={subiendo} className={`w-full font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all ${subiendo ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : (tabDeposito === 'tarjeta' ? 'bg-[#0070ba] hover:bg-[#005ea6] text-white shadow-lg' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg')}`}>
                {subiendo ? 'Procesando...' : (tabDeposito === 'tarjeta' ? '💳 Pagar con Tarjeta' : 'Notificar Depósito')}
              </button>

              <p className="mt-3 text-[10px] text-slate-500">Al depositar, aceptas los términos de custodia institucional. Los fondos son procesados mediante canales regulados.</p>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL DE RETIRO                                             */}
      {/* ============================================================== */}
      {modalActivo === 'retiro' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex justify-center items-center p-4">
          <div className={`w-[95%] md:w-full md:max-w-xl rounded-3xl p-5 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar border ${temaOscuro ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setModalActivo('ninguno')} className="absolute top-6 right-6 text-slate-400 hover:text-cyan-500 font-mono text-lg">✕</button>
            <h3 className={`text-xl font-black mb-6 uppercase tracking-widest ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>Liquidar Fondos</h3>
            
            <div className={`flex gap-1 mb-6 p-1 rounded-xl border ${temaOscuro ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button type="button" onClick={() => setMetodoRetiro('crypto')} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${metodoRetiro === 'crypto' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-500'}`}>Cripto</button>
              <button type="button" onClick={() => setMetodoRetiro('banco')} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${metodoRetiro === 'banco' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-500'}`}>Banco Local</button>
            </div>

            <form onSubmit={registrarRetiro} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Monto a Retirar (USD)</label>
                <input type="number" required value={monto} onChange={(e) => setMonto(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-lg outline-none font-mono transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />
              </div>

              {metodoRetiro === 'banco' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nombre del Banco</label>
                    <input type="text" required value={bancoNombre} onChange={(e) => setBancoNombre(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-sm outline-none transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Número de Cuenta</label>
                    <input type="text" required value={cuentaNumero} onChange={(e) => setCuentaNumero(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-sm outline-none font-mono transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Red (Ej. BSC, TRC20)</label>
                    <input type="text" required value={redCrypto} onChange={(e) => setRedCrypto(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-sm outline-none transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Dirección de Billetera</label>
                    <input type="text" required value={walletDireccion} onChange={(e) => setWalletDireccion(e.target.value)} className={`w-full border p-4 rounded-xl font-bold text-sm outline-none font-mono transition-colors ${temaOscuro ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-black focus:border-cyan-400'}`} />
                  </div>
                </>
              )}
              <button type="submit" disabled={subiendo} className={`w-full font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all mt-4 ${subiendo ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'}`}>Solicitar Liquidación</button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL DE PAYPAL                                             */}
      {/* ============================================================== */}
      {modalPayPal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-[95%] md:w-full md:max-w-md rounded-3xl p-5 md:p-8 shadow-[0_0_50px_rgba(0,112,186,0.2)]">
            <div className="flex justify-center mb-6"><div className="h-16 w-16 bg-[#0070ba]/20 rounded-full flex items-center justify-center"><span className="text-3xl">💳</span></div></div>
            <h3 className="text-2xl font-black text-center text-white mb-2">Pasarela Segura</h3>
            <p className="text-center text-slate-400 text-sm mb-8">Resumen de liquidación internacional.</p>
            <div className="bg-[#020617] rounded-2xl p-6 border border-slate-800 mb-8">
              <div className="flex justify-between items-center mb-4"><span className="text-slate-400 text-sm">Capital a ingresar:</span><span className="text-white font-mono">${montoPayPal.toFixed(2)}</span></div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800"><span className="text-slate-400 text-sm">Fee (5.4% + $0.30):</span><span className="text-red-400 font-mono">${((montoPayPal * 0.054) + 0.30).toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span className="text-white font-bold uppercase tracking-widest text-xs">Total:</span><span className="text-cyan-400 font-black text-xl font-mono">${(montoPayPal + (montoPayPal * 0.054) + 0.30).toFixed(2)}</span></div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={() => setModalPayPal(false)} disabled={subiendo} className="w-full md:w-auto bg-transparent border border-slate-700 text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors uppercase text-xs tracking-widest">Cancelar</button>
              <button onClick={ejecutarRedireccionPayPal} disabled={subiendo} className="w-full md:w-auto bg-[#0070ba] hover:bg-[#005ea6] text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase text-xs tracking-widest">{subiendo ? '...' : 'Ir a PayPal'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ALERTA CUSTOM */}
      {alerta.visible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className={`w-[95%] md:w-full md:max-w-sm rounded-3xl p-6 shadow-2xl border ${temaOscuro ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${alerta.tipo === 'error' ? 'bg-red-500/20 text-red-500' : alerta.tipo === 'exito' ? 'bg-emerald-500/20 text-emerald-500' : alerta.tipo === 'confirmacion' ? 'bg-cyan-500/20 text-cyan-500' : 'bg-blue-500/20 text-blue-500'}`}>
                <span className="text-3xl">{alerta.tipo === 'error' ? '✕' : alerta.tipo === 'exito' ? '✓' : alerta.tipo === 'confirmacion' ? '?' : 'i'}</span>
              </div>
              <h3 className={`text-xl font-black mb-2 ${temaOscuro ? 'text-white' : 'text-slate-900'}`}>{alerta.titulo}</h3>
              <p className={`text-sm mb-8 ${temaOscuro ? 'text-slate-400' : 'text-slate-600'}`}>{alerta.mensaje}</p>
              
              {alerta.tipo === 'confirmacion' ? (
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <button onClick={() => setAlerta({ ...alerta, visible: false })} className={`w-full md:w-auto py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-colors ${temaOscuro ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancelar</button>
                  <button onClick={alerta.accionConfirmar} className="w-full md:w-auto py-3 bg-cyan-500 text-slate-950 font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:bg-cyan-400 transition-colors">Confirmar</button>
                </div>
              ) : (
                <button onClick={() => setAlerta({ ...alerta, visible: false })} className="w-full py-3 bg-cyan-500 text-slate-950 font-black rounded-xl uppercase text-xs tracking-widest shadow-lg hover:bg-cyan-400 transition-colors">Entendido</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}