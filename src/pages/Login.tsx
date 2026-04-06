import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decoração de Fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c5a059] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="z-10 bg-[#0a0a0a] border border-white/5 p-12 rounded-[3rem] w-full max-w-md shadow-2xl relative">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="InvestHouse Logo" className="w-[200px] mx-auto mb-8 object-contain" />
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Acesso Exclusivo</h2>
          <p className="text-[#c5a059] text-xs font-bold tracking-[0.2em] uppercase">Gestão e Lançamentos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059] transition-colors"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059] transition-colors"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-bold text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
              Credenciais inválidas. Tente novamente.
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl text-xl shadow-2xl hover:bg-white transition-all uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
          >
            <ShieldCheck size={24} /> ENTRAR NO SISTEMA
          </button>
        </form>
      </div>
    </div>
  );
}
