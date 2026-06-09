'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [modo, setModo] = useState<'login' | 'registro' | 'recuperar'>('login')
  const [cargando, setCargando] = useState(false)
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '', tipo: '' })

  // Campos de formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [prefijoPais, setPrefijoPais] = useState('+1')
  const [telefono, setTelefono] = useState('')

  const mostrarAlerta = (mensaje: string, tipo: 'error' | 'exito') => {
    setAlerta({ visible: true, mensaje, tipo })
    setTimeout(() => setAlerta({ visible: false, mensaje: '', tipo: '' }), 5000)
  }

  const manejarAutenticacion = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      if (modo === 'registro') {
        if (!nombre || !apellido || !telefono) throw new Error('Debes completar todos los campos obligatorios (*).')
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nombre, apellido, telefono: `${prefijoPais}${telefono}` } }
        })
        if (error) throw error
        
        // Crear billetera inicial al registrarse
        if (data.user) {
          await supabase.from('billeteras').insert([{ id_usuario: data.user.id, nombre, apellido, telefono: `${prefijoPais}${telefono}` }])
        }
        mostrarAlerta('Registro exitoso. Revisa tu correo o inicia sesión.', 'exito')
        setModo('login')
        
      } else if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/dashboard'
        
      } else if (modo === 'recuperar') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/dashboard` })
        if (error) throw error
        mostrarAlerta('Se han enviado las instrucciones a tu correo electrónico.', 'exito')
        setModo('login')
      }
    } catch (error: any) {
      mostrarAlerta(error.message, 'error')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Fondos Ciberseguros */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white inline-block mb-2">
            INVERSOR<span className="text-cyan-400">LIBRE</span>
          </Link>
          <p className="text-slate-400 text-sm">
            {modo === 'login' ? 'Acceso Seguro a Bóveda' : modo === 'registro' ? 'Apertura de Cuenta Institucional' : 'Recuperación de Accesos'}
          </p>
        </div>

        {alerta.visible && (
          <div className={`p-4 rounded-xl mb-6 text-xs font-bold uppercase tracking-widest text-center border ${alerta.tipo === 'exito' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {alerta.mensaje}
          </div>
        )}

        <form onSubmit={manejarAutenticacion} className="space-y-4">
          
          {modo === 'registro' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nombre *</label>
                <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Apellido *</label>
                <input type="text" required value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl text-sm focus:border-cyan-500 outline-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Correo Electrónico *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl text-sm focus:border-cyan-500 outline-none" />
          </div>

          {modo === 'registro' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Teléfono Celular *</label>
              <div className="flex gap-2">
                <select value={prefijoPais} onChange={(e) => setPrefijoPais(e.target.value)} className="bg-slate-950 border border-slate-800 text-white p-3 rounded-xl text-sm focus:border-cyan-500 outline-none w-28 cursor-pointer">
                  <option value="+1">🇩🇴 +1</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+507">🇵🇦 +507</option>
                </select>
                <input type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="8090000000" className="flex-1 bg-slate-950 border border-slate-800 text-white p-3 rounded-xl text-sm focus:border-cyan-500 outline-none font-mono" />
              </div>
            </div>
          )}

          {modo !== 'recuperar' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Contraseña Maestra *</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl text-sm focus:border-cyan-500 outline-none font-mono" />
            </div>
          )}

          {modo === 'login' && (
            <div className="flex justify-end">
              <button type="button" onClick={() => setModo('recuperar')} className="text-[10px] text-cyan-400 hover:underline font-bold uppercase tracking-widest">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button type="submit" disabled={cargando} className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl uppercase tracking-widest text-xs transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] mt-4">
            {cargando ? 'Procesando...' : modo === 'login' ? 'Autorizar Acceso' : modo === 'registro' ? 'Crear Bóveda' : 'Enviar Instrucciones'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          {modo === 'login' ? (
            <p className="text-xs text-slate-400">
              ¿No tienes una cuenta? <button onClick={() => setModo('registro')} className="text-white font-bold hover:text-cyan-400">Registrarse ahora</button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              ¿Ya tienes una bóveda? <button onClick={() => setModo('login')} className="text-white font-bold hover:text-cyan-400">Iniciar Sesión</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}