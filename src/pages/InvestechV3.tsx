import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Award, Plus, X, Save, Building2, User, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const InvestechV3 = () => {
  // 1. ESTADO DE DADOS E INTERFACE
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, data: '2026-03-01' },
    { id: 2, corretor: 'Bruno Costa', unidade: 'Lote', construtora: 'Damha', valor: 450000, data: '2026-03-02' },
    { id: 3, corretor: 'Carla Souza', unidade: 'Casa', construtora: 'Alphabet', valor: 890000, data: '2026-03-05' },
    { id: 4, corretor: 'Daniel Oliveira', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, data: '2026-03-08' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [novaVenda, setNovaVenda] = useState({
    corretor: '', unidade: 'Apartamento', construtora: '', valor: '', data: new Date().toISOString().split('T')[0]
  });

  // Alternância automática da TV (Modo Hall)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen) setAbaAtiva((prev) => (prev === 0 ? 1 : 0));
    }, 12000);
    return () => clearInterval(interval);
  }, [isModalOpen]);

  // 2. CÁLCULOS
  const vgvTotal = useMemo(() => vendas.reduce((acc, v) => acc + Number(v.valor), 0), [vendas]);
  
  const top5Corretores = useMemo(() => {
    const counts: Record<string, number> = vendas.reduce((acc, v) => {
      acc[v.corretor] = (acc[v.corretor] || 0) + Number(v.valor);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts)
      .map(([nome, vgv]) => ({ nome, vgv }))
      .sort((a, b) => b.vgv - a.vgv)
      .slice(0, 5);
  }, [vendas]);

  // 3. FUNÇÕES DE AÇÃO
  const handleSalvarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    const vendaFormatada = { ...novaVenda, id: Date.now(), valor: parseFloat(novaVenda.valor) };
    setVendas([vendaFormatada, ...vendas]);
    setIsModalOpen(false);
    setNovaVenda({ corretor: '', unidade: 'Apartamento', construtora: '', valor: '', data: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 border-b border-[#c5a059]/10 pb-6">
        <div>
          <h1 className="text-4xl font-black text-[#c5a059] flex items-center gap-2 tracking-tighter">
            <Zap className="fill-[#c5a059]" /> INVESTECH
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Real Estate Intelligence</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right border-r border-gray-800 pr-6">
            <p className="text-gray-500 text-[10px] font-bold uppercase">VGV Acumulado</p>
            <p className="text-3xl font-black text-white">R$ {vgvTotal.toLocaleString('pt-BR')}</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#c5a059] hover:bg-[#d4af37] text-black p-3 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all transform hover:scale-110 active:scale-95"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="grid grid-cols-12 gap-8">
        {/* RANKING LADO ESQUERDO */}
        <div className="col-span-4 space-y-4">
          <h3 className="text-gray-500 font-bold text-xs flex items-center gap-2 mb-6 tracking-widest uppercase">
            <Trophy size={14} className="text-[#c5a059]" /> Ranking de Performance
          </h3>
          {top5Corretores.map((c, i) => (
            <div key={i} className={`p-4 rounded-2xl border transition-all duration-700 ${i === 0 ? 'bg-[#c5a059]/10 border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.05)]' : 'bg-[#141414] border-gray-900'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-black ${i === 0 ? 'text-[#c5a059]' : 'text-gray-700'}`}>{i + 1}º</span>
                  <div>
                    <p className="font-bold text-gray-200">{c.nome}</p>
                    <p className="text-xs text-gray-500 font-mono">R$ {c.vgv.toLocaleString()}</p>
                  </div>
                </div>
                {i < 3 && <Award size={20} className={i === 0 ? 'text-[#c5a059]' : 'text-gray-800'} />}
              </div>
            </div>
          ))}
        </div>

        {/* DASHBOARD DINÂMICO LADO DIREITO */}
        <div className="col-span-8 bg-[#141414] rounded-[2.5rem] border border-gray-900 p-10 relative overflow-hidden">
          <div className={`transition-all duration-1000 ${abaAtiva === 0 ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold mb-10">Volume de Vendas <span className="text-[#c5a059]">Por Corretor</span></h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top5Corretores}>
                  <XAxis dataKey="nome" stroke="#333" fontSize={12} tickLine={false} axisLine={false} />
                  <Bar dataKey="vgv" radius={[8, 8, 0, 0]}>
                    {top5Corretores.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#c5a059' : '#222'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER TICKER */}
      <div className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee inline-block">
          {[...vendas, ...vendas].map((v, i) => (
            <span key={i} className="mx-12 text-black font-black text-xs uppercase italic">
              ✨ {v.corretor} ACABA DE FECHAR: {v.unidade} - R$ {v.valor.toLocaleString()} •
            </span>
          ))}
        </div>
      </div>

      {/* MODAL DE CADASTRO (POP-UP) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#c5a059]/40 w-full max-w-md rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,1)] relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white"
            >
              <X />
            </button>

            <h2 className="text-[#c5a059] text-2xl font-black mb-8 flex items-center gap-3">
              <Plus /> NOVO LANÇAMENTO
            </h2>

            <form onSubmit={handleSalvarVenda} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Corretor</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-600" size={18} />
                  <input 
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 pl-12 text-white focus:border-[#c5a059] outline-none transition-all"
                    placeholder="Nome completo"
                    value={novaVenda.corretor}
                    onChange={(e) => setNovaVenda({...novaVenda, corretor: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo</label>
                  <select 
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:border-[#c5a059] outline-none appearance-none"
                    value={novaVenda.unidade}
                    onChange={(e) => setNovaVenda({...novaVenda, unidade: e.target.value})}
                  >
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Lote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valor</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:border-[#c5a059] outline-none transition-all"
                    placeholder="R$ 0,00"
                    value={novaVenda.valor}
                    onChange={(e) => setNovaVenda({...novaVenda, valor: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Construtora</label>
                <input 
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:border-[#c5a059] outline-none transition-all"
                  placeholder="Ex: Moura Dubeux"
                  value={novaVenda.construtora}
                  onChange={(e) => setNovaVenda({...novaVenda, construtora: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#c5a059] text-black font-black py-4 rounded-2xl mt-4 hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> LANÇAR AGORA
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
};

export default InvestechV3;
