'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [esRegistro, setEsRegistro] = useState(false); // Controlador de modo
  const router = useRouter();

  const manejarAcceso = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMensaje('⚠️ Por favor, llena todos los campos.');
      return;
    }

    setCargando(true);
    setMensaje('');

    if (esRegistro) {
      // MODO: CREAR CUENTA NUEVA
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setMensaje('❌ Error al registrar: ' + error.message);
      } else {
        setMensaje('✅ ¡Cuenta creada! Entrando al sistema...');
        setTimeout(() => router.push('/'), 1500);
      }
    } else {
      // MODO: INICIAR SESIÓN (Para usuarios que ya existen)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setMensaje('❌ Error: Correo o contraseña incorrectos.');
      } else {
        setMensaje('✅ ¡Bienvenido de vuelta! Entrando al sistema...');
        setTimeout(() => router.push('/'), 1500);
      }
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-extrabold text-white tracking-tight">
            Inversor Libre
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {esRegistro ? 'Crea tu cuenta para empezar a invertir' : 'Accede a tu panel de inversión'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={manejarAcceso}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all outline-none"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all outline-none"
                placeholder={esRegistro ? "Mínimo 7 caracteres y 1 Símbolo" : "Tu contraseña secreta"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {mensaje && (
            <div className={`p-4 text-sm text-center rounded-lg font-medium ${mensaje.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
          >
            {cargando ? 'Procesando...' : (esRegistro ? 'Crear mi cuenta' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setEsRegistro(!esRegistro);
              setMensaje('');
            }}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            {esRegistro ? '¿Ya tienes una cuenta? Inicia sesión aquí' : '¿Aún no tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}