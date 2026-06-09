'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [transacciones, setTransacciones] = useState<any[]>([])

  useEffect(() => {
    cargarTransaccionesPendientes()
  }, [])

  const cargarTransaccionesPendientes = async () => {
    // Verificamos la sesión
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }

    // Cargamos solo las transacciones 'pendientes'
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('estado', 'pendiente')
      .order('fecha', { ascending: false })

    if (data) setTransacciones(data)
    setLoading(false)
  }

  // --- LÓGICA DE APROBACIÓN ---
  const aprobarTransaccion = async (tx: any) => {
    const confirmar = window.confirm(`¿Estás seguro de APROBAR este ${tx.tipo} por $${tx.monto} USD?`)
    if (!confirmar) return

    try {
      // 1. Cambiar estado a aprobado
      await supabase.from('transacciones').update({ estado: 'aprobado' }).eq('id', tx.id)

      // 2. Si es DEPÓSITO, sumarlo a la bóveda
      if (tx.tipo === 'DEPOSITO') {
        const { data: billetera } = await supabase.from('billeteras').select('balance_total').eq('id_usuario', tx.id_usuario).single()
        
        const balanceActual = billetera ? Number(billetera.balance_total) : 0
        const nuevoBalance = balanceActual + Number(tx.monto)

        if (billetera) {
          await supabase.from('billeteras').update({ balance_total: nuevoBalance }).eq('id_usuario', tx.id_usuario)
        } else {
          await supabase.from('billeteras').insert([{ id_usuario: tx.id_usuario, balance_total: nuevoBalance }])
        }
      }

      alert('✅ Transacción aprobada. Fondos indexados con éxito.')
      cargarTransaccionesPendientes()
    } catch (error: any) {
      alert('Error al procesar: ' + error.message)
    }
  }

  // --- LÓGICA DE RECHAZO ---
  const rechazarTransaccion = async (idTransaccion: string) => {
    const confirmar = window.confirm('¿Deseas RECHAZAR esta transacción?')
    if (!confirmar) return

    await supabase.from('transacciones').update({ estado: 'rechazado' }).eq('id', idTransaccion)
    alert('❌ Transacción rechazada.')
    cargarTransaccionesPendientes()
  }

  if (loading) return <div className="min-h-screen bg-[#020617] text-white flex justify-center items-center font-black uppercase tracking-widest">Accediendo al Servidor Maestro...</div>

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-8">
      
      <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest">Centro de <span className="text-fuchsia-500">Mando</span></h1>
          <p className="text-slate-400 text-sm mt-1">Gestión de Auditoría Financiera - CodeMagnum</p>
        </div>
        <Link href="/dashboard" className="text-cyan-400 font-bold hover:underline text-sm uppercase tracking-widest">
          Volver al Dashboard
        </Link>
      </header>

      <main className="max-w-7xl mx-auto">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest border-l-4 border-cyan-400 pl-4">Operaciones Pendientes de Revisión</h2>

        {transacciones.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <span className="text-4xl block mb-4">☕</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest">Sistema al día. No hay transacciones pendientes.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {transacciones.map((tx) => (
              <div key={tx.id} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-xl hover:border-slate-700 transition-colors">
                
                {/* Datos */}
                <div className="flex-1 w-full md:w-auto mb-6 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.tipo === 'DEPOSITO' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-fuchsia-500/20 text-fuchsia-400'}`}>
                      {tx.tipo}
                    </span>
                    <span className="text-slate-500 font-mono text-xs">Usuario ID: {tx.id_usuario.substring(0, 8)}...</span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-1">
                    ${Number(tx.monto).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-medium text-slate-500">USD</span>
                  </h3>
                  
                  <p className="text-sm text-slate-400">
                    Vía: <strong className="text-white">{tx.metodo_pago}</strong> 
                    {tx.metodo_pago === 'BANCO' && tx.tipo === 'RETIRO' && ` (${tx.banco_nombre} - ${tx.cuenta_numero})`}
                    {tx.metodo_pago === 'CRYPTO' && tx.tipo === 'RETIRO' && ` (${tx.red_crypto} - ${tx.wallet_direccion?.substring(0,6)}...)`}
                  </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                  
                  {tx.comprobante_url ? (
                    <a href={tx.comprobante_url} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center text-xs uppercase tracking-widest border border-slate-700">
                      📄 Ver Evidencia
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 italic px-4">Sin comprobante</span>
                  )}

                  <button onClick={() => rechazarTransaccion(tx.id)} className="w-full sm:w-auto bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white font-bold py-3 px-6 rounded-xl transition-colors text-xs uppercase tracking-widest">
                    Rechazar
                  </button>
                  
                  <button onClick={() => aprobarTransaccion(tx)} className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all text-xs uppercase tracking-widest">
                    Aprobar Ingreso
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}