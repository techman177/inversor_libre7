'use client'; // Obligatorio en Next.js para poder usar botones y formularios

import { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Conecta el "cable" de la base de datos

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Esta es la función que hace la magia al darle clic al botón
  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página recargue
    setCargando(true);
    setMensaje('');

    // Aquí Supabase hace el trabajo pesado y envía el correo
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMensaje('❌ Error: ' + error.message);
    } else {
      setMensaje('✅ ¡Registro exitoso! Revisa tu bandeja de entrada o la carpeta de Spam para confirmar tu cuenta.');
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inversor Libre
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crea tu cuenta para comenzar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={registrarUsuario}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña (Mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Aquí mostramos los mensajes de éxito o error */}
          {mensaje && (
            <div className={`p-3 text-sm text-center rounded ${mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensaje}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={cargando}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {cargando ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}