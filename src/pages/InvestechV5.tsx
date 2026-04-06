import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Award, Plus, X, Save, Building2, PieChart as PieIcon, BarChart3, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

const InvestechV5 = () => {
  // 1. ESTADO DE DADOS (Simulando meses diferentes)
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Daniel Oliveira', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, mes: 'Mar' },
    { id: 2, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, mes: 'Mar' },
    { id: 3, corretor: 'Carla Souza', unidade: 'Casa', construtora: 'Junes', valor: 890000, mes: 'Fev' },
    { id: 4, corretor: 'Bruno Costa', unidade: 'Lote', construtora: 'Damha', valor: 450000, mes: 'Jan' },
  ]);

  const [mesSelecionado, setMesSelecionado] = useState('Mar');
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(0); 
  const [showCelebration, setShowCelebration] = useState(false);
  const [ultimoVendedor, setUltimoVendedor] = useState('');
  
  const [novaVenda, setNovaVenda] = useState({
    corretor: '', unidade: 'Apartamento', construtora: '', valor: '', mes: 'Mar'
  });

  // 2. FILTRAGEM DE DADOS POR MÊS
  const vendasFiltradas = useMemo(() => {
    return vendas.filter(v => v.mes === mesSelecionado);
  }, [vendas, mesSelecionado]);

  // Cálculos baseados no filtro
  const vgvTotalMes = useMemo(() => vendasFiltradas.reduce((acc, v) => acc + Number(v.valor), 0), [vendasFiltradas]);

  const dadosCorretores = useMemo(() => {
    const map: Record<string, number> = vendasFiltradas.reduce((acc, v) => {
      acc[v.corretor] = (acc[v.corretor] || 0) + Number(v.valor);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [vendasFiltradas]);

  const dadosTipos = useMemo(() => {
    const map: Record<string, number> = vendasFiltradas.reduce((acc, v) => {
      acc[v.unidade] = (acc[v.unidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [vendasFiltradas]);

  // 3. FUNÇÕES
  const dispararCelebracao = (nome: string) => {
    setUltimoVendedor(nome);
    setShowCelebration(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#c5a059', '#ffffff', '#d4af37'] });
    setTimeout(() => setShowCelebration(false), 5000);
  };

  const handleSalvarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    const vendaFormatada = { ...novaVenda, id: Date.now(), valor: parseFloat(novaVenda.valor) };
    setVendas([...vendas, vendaFormatada]);
    setIsModalOpen(false);
    if(novaVenda.mes === mesSelecionado) dispararCelebracao(novaVenda.corretor);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white p-6 font-sans overflow-hidden relative">
      
      {/* CELEBRAÇÃO */}
      {showCelebration && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-in zoom-in duration-300">
           <p className="text-[#c5a059] text-9xl mb-6">🍾</p>
           <h2 className="text-white text-7xl font-black italic tracking-tighter uppercase underline decoration-[#c5a059]">Venda Confirmada!</h2>
           <p className="text-4xl mt-4 font-light tracking-[1em] text-gray-400">{ultimoVendedor}</p>
        </div>
      )}

      {/* HEADER + FILTRO DE MESES */}
      <header className="mb-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#c5a059] p-2 rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.4)]"><Zap className="text-black fill-black" size={20} /></div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">Investech <span className="text-[#c5a059]">Dashboard</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-[#111] border border-white/5 px-6 py-2 rounded-2xl">
               <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">VGV {mesSelecionado}</p>
               <p className="text-2xl font-black text-[#c5a059]">R$ {vgvTotalMes.toLocaleString('pt-BR')}</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] hover:scale-110 text-black p-3 rounded-full transition-all active:scale-95 shadow-lg shadow-[#c5a059]/20">
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* TIMELINE DE MESES */}
        <div className="flex justify-between items-center bg-[#111] p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {meses.map((mes) => (
            <button
              key={mes}
              onClick={() => setMesSelecionado(mes)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                mesSelecionado === mes 
                ? 'bg-[#c5a059] text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]' 
                : 'text-gray-600 hover:text-gray-300'
              }`}
            >
              {mes}
            </button>
          ))}
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="grid grid-cols-12 gap-8">
        {/* RANKING */}
        <div className="col-span-4 bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
           <h3 className="text-[#c5a059] font-black text-xs tracking-[0.3em] uppercase mb-8 flex items-center gap-2">
             <Trophy size={14} /> Top Performance {mesSelecionado}
           </h3>
           <div className="space-y-4">
             {dadosCorretores.length > 0 ? dadosCorretores.slice(0, 5).map((c, i) => (
               <div key={i} className={`flex justify-between items-center p-4 rounded-2xl ${i === 0 ? 'bg-[#c5a059]/5 border border-[#c5a059]/20' : 'bg-black/20'}`}>
                 <span className={`text-xl font-black ${i === 0 ? 'text-[#c5a059]' : 'text-gray-700'}`}>{i+1}º</span>
                 <span className="font-bold flex-1 ml-4">{c.name}</span>
                 <span className="text-[#c5a059] font-mono font-bold text-sm">R$ {(c.value/1000).toFixed(0)}k</span>
               </div>
             )) : <p className="text-gray-700 italic text-center py-10">Nenhuma venda em {mesSelecionado}</p>}
           </div>
        </div>

        {/* GRÁFICO DINÂMICO */}
        <div className="col-span-8 bg-[#111] p-10 rounded-[2.5rem] border border-white/5 h-[500px] relative">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 italic">
               <BarChart3 className="text-[#c5a059]" /> Performance <span className="text-[#c5a059]">{mesSelecionado}</span>
            </h2>
            <div className="h-full pb-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosCorretores}>
                  <XAxis dataKey="name" stroke="#333" fontSize={12} tickLine={false} axisLine={false} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} animationDuration={1500}>
                    <LabelList dataKey="value" position="top" formatter={(val: number) => `R$ ${(val/1000).toFixed(0)}k`} fill="#c5a059" fontSize={12} fontWeight="bold" dy={-10} />
                    {dadosCorretores.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#c5a059' : '#222'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* TICKER RODAPÉ */}
      <div className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-3 overflow-hidden border-t-2 border-black/20">
        <div className="whitespace-nowrap animate-marquee inline-block text-black font-black text-xs uppercase tracking-tighter italic">
          {vendasFiltradas.length > 0 ? [...vendasFiltradas, ...vendasFiltradas].map((v, i) => (
            <span key={i} className="mx-10">🚀 {v.corretor} vendeu {v.unidade} - R$ {v.valor.toLocaleString()} •</span>
          )) : "AGUARDANDO LANÇAMENTOS PARA " + mesSelecionado + " •"}
        </div>
      </div>

      {/* MODAL LANÇAMENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[150] flex items-center justify-center p-6">
          <div className="bg-[#111] border border-[#c5a059]/20 w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
            <h2 className="text-[#c5a059] text-3xl font-black italic mb-8 flex items-center gap-3"><Calendar /> LANÇAR EM {mesSelecionado}</h2>
            <form onSubmit={handleSalvarVenda} className="space-y-6">
              <input required className="w-full bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" placeholder="Nome do Corretor" value={novaVenda.corretor} onChange={(e) => setNovaVenda({...novaVenda, corretor: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" value={novaVenda.unidade} onChange={(e) => setNovaVenda({...novaVenda, unidade: e.target.value})}>
                  <option>Apartamento</option><option>Casa</option><option>Lote</option>
                </select>
                <input required type="number" className="w-full bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" placeholder="Valor R$" value={novaVenda.valor} onChange={(e) => setNovaVenda({...novaVenda, valor: e.target.value})} />
              </div>
              <input className="w-full bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" placeholder="Construtora" value={novaVenda.construtora} onChange={(e) => setNovaVenda({...novaVenda, construtora: e.target.value})} />
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl text-lg hover:scale-[1.02] transition-all shadow-lg">CONFIRMAR VENDA</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default InvestechV5;
