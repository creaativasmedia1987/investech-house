import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Plus, X, Building2, BarChart3, GitCompare, Printer, Settings, Trash2, Edit3, Lock, UserCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

// NOTA: Para funcionar 100%, você precisará instalar a biblioteca @supabase/supabase-js
// Mas deixei a lógica pronta para você plugar as chaves da API.

const InvestechOS = () => {
  // 1. ESTADO DE DADOS (Agora simulando o que viria do Banco de Dados)
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Daniel Oliveira', foto: 'https://i.pravatar.cc/150?u=daniel', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, mes: 'Mar' },
    { id: 2, corretor: 'Ana Silva', foto: 'https://i.pravatar.cc/150?u=ana', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, mes: 'Mar' },
    { id: 3, corretor: 'Maíra Ribeiro', foto: 'https://i.pravatar.cc/150?u=maira', unidade: 'Casa', construtora: 'Junes', valor: 3500000, mes: 'Mar' },
  ]);

  const [isAdmin, setIsAdmin] = useState(false); // Controle de login do gestor
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  
  const [mesSelecionado, setMesSelecionado] = useState('Mar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // 2. LÓGICA DE ADMINISTRAÇÃO
  const handleAdminLogin = () => {
    // Senha simples para demonstração (Em produção, use o Auth do Supabase)
    if (senhaInput === '1234') { 
      setIsAdmin(true);
      setShowAdminLogin(false);
      setSenhaInput('');
    } else {
      alert("Senha incorreta!");
    }
  };

  const deletarVenda = (id: number) => {
    if(window.confirm("Deseja realmente excluir esta venda?")) {
      setVendas(vendas.filter(v => v.id !== id));
      // Aqui entraria: await supabase.from('vendas').delete().eq('id', id)
    }
  };

  // 3. PROCESSAMENTO PARA O RANKING COM FOTO
  const vendasFiltradas = useMemo(() => vendas.filter(v => v.mes === mesSelecionado), [vendas, mesSelecionado]);
  
  const rankingCorretores = useMemo(() => {
    const map: Record<string, { nome: string, foto: string, valor: number }> = vendasFiltradas.reduce((acc, v) => {
      if (!acc[v.corretor]) acc[v.corretor] = { nome: v.corretor, foto: v.foto, valor: 0 };
      acc[v.corretor].valor += Number(v.valor);
      return acc;
    }, {} as Record<string, { nome: string, foto: string, valor: number }>);
    return Object.values(map).sort((a,b) => b.valor - a.valor);
  }, [vendasFiltradas]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans flex flex-col relative">
      
      {/* HEADER COM BOTÃO DE ADMIN */}
      <header className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#c5a059] p-2 rounded-xl shadow-lg shadow-[#c5a059]/20"><Zap className="text-black fill-black" size={24} /></div>
          <h1 className="text-3xl font-black italic tracking-tighter">INVESTECH <span className="text-[#c5a059]">OS</span></h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Botão de Gestão */}
          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${isAdmin ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            {isAdmin ? <Lock size={20} /> : <Settings size={20} />}
            <span className="text-[10px] font-black uppercase">{isAdmin ? 'Sair (Gestor)' : 'Gestão'}</span>
          </button>

          <button onClick={() => setIsCompareOpen(true)} className="bg-white/5 border border-white/10 p-3 rounded-2xl text-xs font-black uppercase">Comparativo</button>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] text-black p-3 rounded-2xl shadow-xl hover:scale-110 transition-all"><Plus size={28} /></button>
        </div>
      </header>

      {/* DASHBOARD PRINCIPAL */}
      <main className="flex-1 grid grid-cols-12 gap-8">
        
        {/* RANKING VISUAL (Com fotos dos corretores) */}
        <div className="col-span-4 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[#c5a059] font-black text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
              <Trophy size={16} /> Top Performance {mesSelecionado}
            </h3>
          </div>

          <div className="space-y-6">
            {rankingCorretores.map((c, i) => (
              <div key={i} className={`relative flex items-center p-4 rounded-[2rem] transition-all ${i === 0 ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent border border-[#c5a059]/30' : 'bg-[#111] border border-transparent'}`}>
                
                {/* Foto do Corretor */}
                <div className="relative">
                  <img src={c.foto || 'https://via.placeholder.com/150'} alt={c.nome} className={`w-14 h-14 rounded-full object-cover border-2 ${i === 0 ? 'border-[#c5a059]' : 'border-gray-700'}`} />
                  {i === 0 && <div className="absolute -top-2 -left-2 bg-[#c5a059] text-black rounded-full p-1"><Trophy size={12} /></div>}
                </div>

                <div className="ml-4 flex-1">
                  <p className="font-black text-sm uppercase tracking-tight">{c.nome}</p>
                  <p className="text-[#c5a059] font-black italic text-lg">R$ {(c.valor/1000000).toFixed(1)}M</p>
                </div>

                <div className="text-right">
                  <span className="text-gray-700 font-black italic text-2xl">#{i+1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA DE VENDAS (Com opções de edição para o Gestor) */}
        <div className="col-span-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10">
          <h2 className="text-2xl font-black mb-8 italic flex items-center gap-3 text-white">
            <BarChart3 className="text-[#c5a059]" /> Log de Vendas <span className="text-[#c5a059]">{mesSelecionado}</span>
          </h2>
          
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-4 custom-scroll">
            {vendasFiltradas.length > 0 ? vendasFiltradas.map((v) => (
              <div key={v.id} className="group flex justify-between items-center p-5 bg-[#111] hover:bg-[#151515] rounded-3xl border border-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#c5a059] shadow-[0_0_10px_#c5a059]"></div>
                  <div>
                    <p className="font-bold text-gray-200">{v.corretor} <span className="text-gray-600 font-normal ml-2">vendeu</span> {v.unidade}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">{v.construtora}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <p className="font-black text-white italic">R$ {v.valor.toLocaleString()}</p>
                  
                  {/* BOTÕES DE GESTÃO (Só aparecem se o gestor estiver logado) */}
                  {isAdmin && (
                    <div className="flex gap-2 animate-in slide-in-from-right">
                      <button className="p-2 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={16}/></button>
                      <button onClick={() => deletarVenda(v.id)} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              </div>
            )) : <p className="text-gray-800 italic text-center py-20 uppercase font-black tracking-widest">Aguardando dados...</p>}
          </div>
        </div>
      </main>

      {/* MODAL DE LOGIN GESTOR */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[600] flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/10 w-full max-w-sm rounded-[3rem] p-10 text-center">
            <Lock className="mx-auto text-[#c5a059] mb-4" size={48} />
            <h2 className="text-2xl font-black italic mb-2">Acesso Restrito</h2>
            <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Apenas sócios e administradores</p>
            <input 
              type="password" 
              placeholder="Digite a Senha" 
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-center mb-6 outline-none focus:border-[#c5a059]"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowAdminLogin(false)} className="flex-1 text-gray-500 font-bold uppercase text-xs">Cancelar</button>
              <button onClick={handleAdminLogin} className="flex-1 bg-[#c5a059] text-black font-black py-4 rounded-2xl">Entrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE LANÇAMENTO (Com campo de Foto) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/5 w-full max-w-lg rounded-[3rem] p-10 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500"><X /></button>
            <h2 className="text-[#c5a059] text-3xl font-black italic mb-8">Registrar Venda</h2>
            <div className="space-y-4">
              <input className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none" placeholder="Nome do Corretor" />
              <input className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none text-xs" placeholder="URL da Foto do Corretor (Ex: LinkedIn/WhatsApp)" />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black border border-white/10 rounded-2xl p-4 outline-none"><option>Apartamento</option><option>Casa</option><option>Lote</option></select>
                <input className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none" placeholder="Valor R$" />
              </div>
              <input className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none" placeholder="Construtora" />
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl text-xl mt-4 shadow-xl">SALVAR NO BANCO DE DADOS</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default InvestechOS;
