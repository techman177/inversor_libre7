"use client"

import { useState } from 'react'
// Asegúrate de que esta ruta apunte a donde tienes tus llaves de supabase. 
// Si tu archivo se llama distinto, cámbialo aquí:
import { supabase } from '../../lib/supabase' 

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  // Esta es la función que dispara el correo de confirmación
  const registrarUsuario = async (e: any) => {
    e.preventDefault()
    setCargando(true)
    setMensaje('')

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      setMensaje('¡Éxito! Revisa tu bandeja de entrada para confirmar tu cuenta.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Inversor Libre
        </h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="••••••••"
              required
            />
          </div>

          {mensaje && (
            <div className="p-3 text-sm text-center text-blue-700 bg-blue-100 rounded-md">
              {mensaje}
            </div>
          )}

          <button
            onClick={registrarUsuario}
            disabled={cargando}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cargando ? 'Cargando...' : 'Crear mi cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}