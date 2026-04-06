import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Award, Plus, X, Save, User, Building2, PieChart as PieIcon, BarChart3, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, PieChart, Pie, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

const InvestechV4 = () => {
  // 1. ESTADO DE DADOS
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Daniel Oliveira', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000 },
    { id: 2, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000 },
    { id: 3, corretor: 'Carla Souza', unidade: 'Casa', construtora: 'Junes', valor: 890000 },
    { id: 4, corretor: 'Bruno Costa', unidade: 'Lote', construtora: 'Damha', valor: 450000 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(0); // 0: Corretores, 1: Tipos, 2: Construtoras
  const [showCelebration, setShowCelebration] = useState(false);
  const [ultimoVendedor, setUltimoVendedor] = useState('');
  const [novaVenda, setNovaVenda] = useState({
    corretor: '', unidade: 'Apartamento', construtora: '', valor: '', data: new Date().toISOString().split('T')[0]
  });

  // Alternância automática das visões (TV Mode)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen && !showCelebration) {
        setViewIndex((prev) => (prev + 1) % 3);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isModalOpen, showCelebration]);

  // 2. PROCESSAMENTO DE DADOS PARA GRÁFICOS
  const vgvTotal = useMemo(() => vendas.reduce((acc, v) => acc + Number(v.valor), 0), [vendas]);

  const dadosCorretores = useMemo(() => {
    const map: Record<string, number> = vendas.reduce((acc, v) => {
      acc[v.corretor] = (acc[v.corretor] || 0) + Number(v.valor);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [vendas]);

  const dadosTipos = useMemo(() => {
    const map: Record<string, number> = vendas.reduce((acc, v) => {
      acc[v.unidade] = (acc[v.unidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [vendas]);

  const dadosConstrutoras = useMemo(() => {
    const map: Record<string, number> = vendas.reduce((acc, v) => {
      acc[v.construtora] = (acc[v.construtora] || 0) + Number(v.valor);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [vendas]);

  // 3. ANIMAÇÃO DE CELEBRAÇÃO
  const dispararCelebracao = (nome: string) => {
    setUltimoVendedor(nome);
    setShowCelebration(true);
    
    // Confetes
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);

    setTimeout(() => setShowCelebration(false), 7000);
  };

  const handleSalvarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    const vendaFormatada = { ...novaVenda, id: Date.now(), valor: parseFloat(novaVenda.valor) };
    setVendas([vendaFormatada, ...vendas]);
    setIsModalOpen(false);
    dispararCelebracao(novaVenda.corretor);
    setNovaVenda({ corretor: '', unidade: 'Apartamento', construtora: '', valor: '', data: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans overflow-hidden relative">
      
      {/* CELEBRAÇÃO OVERLAY */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <div className="text-8xl mb-4 animate-bounce">🍾</div>
            <h2 className="text-[#c5a059] text-6xl font-black italic tracking-tighter animate-pulse">VENDA REALIZADA!</h2>
            <p className="text-4xl font-bold uppercase tracking-widest">{ultimoVendedor}</p>
            <div className="mt-8 bg-[#c5a059] text-black px-8 py-2 rounded-full font-black text-2xl">VGV ATUALIZADO</div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-[#c5a059] p-2 rounded-lg"><Zap className="text-black fill-black" /></div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">INVESTECH</h1>
            <p className="text-[10px] text-[#c5a059] font-bold tracking-[0.3em] uppercase leading-none">Intelligence Board</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-gray-500 text-[10px] font-bold uppercase">Volume Total Geral</p>
            <p className="text-4xl font-black text-white leading-none">R$ {vgvTotal.toLocaleString('pt-BR')}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white/5 hover:bg-[#c5a059] border border-[#c5a059]/30 text-[#c5a059] hover:text-black p-4 rounded-2xl transition-all shadow-xl group"
          >
            <Plus className="group-hover:scale-125 transition-transform" />
          </button>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-12 gap-10">
        
        {/* RANKING ELITE (LADO ESQUERDO) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <h3 className="text-[#c5a059] font-bold text-xs flex items-center gap-2 tracking-[0.2em] uppercase">
            <Trophy size={16} /> Elite de Performance
          </h3>
          <div className="space-y-4">
            {dadosCorretores.slice(0, 5).map((c, i) => (
              <div key={i} className={`p-5 rounded-3xl border transition-all duration-700 ${i === 0 ? 'bg-gradient-to-br from-[#c5a059]/20 to-transparent border-[#c5a059]' : 'bg-[#121212] border-gray-800'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-black ${i === 0 ? 'text-[#c5a059]' : 'text-gray-700'}`}>{i + 1}º</span>
                    <p className="font-bold text-lg">{c.name}</p>
                  </div>
                  <p className="text-[#c5a059] font-black italic">R$ {(c.value/1000).toFixed(0)}k</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ÁREA DE GRÁFICOS DINÂMICOS (CENTRO/DIREITA) */}
        <div className="col-span-12 lg:col-span-8 bg-[#121212] rounded-[3rem] border border-white/5 p-12 relative h-[550px] overflow-hidden">
          
          {/* VISÃO 1: VGV POR CORRETOR */}
          <div className={`absolute inset-0 p-12 transition-all duration-1000 ease-in-out ${viewIndex === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 italic"><BarChart3 className="text-[#c5a059]" /> Volume <span className="text-[#c5a059]">Por Corretor</span></h2>
            <div className="h-full pb-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosCorretores}>
                  <XAxis dataKey="name" stroke="#333" fontSize={14} tickLine={false} axisLine={false} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    <LabelList dataKey="value" position="top" formatter={(val: number) => `R$ ${(val/1000).toFixed(0)}k`} fill="#c5a059" fontSize={14} fontWeight="bold" dy={-10} />
                    {dadosCorretores.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#c5a059' : '#222'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* VISÃO 2: PROJETOS MAIS VENDIDOS */}
          <div className={`absolute inset-0 p-12 transition-all duration-1000 ease-in-out ${viewIndex === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 italic"><PieIcon className="text-[#c5a059]" /> Tipos <span className="text-[#c5a059]">de Imóveis</span></h2>
            <div className="grid grid-cols-2 h-full pb-20 items-center">
                <div className="space-y-6">
                    {dadosTipos.map((t, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400 font-bold uppercase text-sm">{t.name}</span>
                            <span className="text-2xl font-black text-[#c5a059]">{t.value}</span>
                        </div>
                    ))}
                </div>
                <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={dadosTipos} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={5}>
                                {dadosTipos.map((entry, index) => (
                                    <Cell key={index} fill={index === 0 ? '#c5a059' : '#333'} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>

          {/* VISÃO 3: RANKING CONSTRUTORAS */}
          <div className={`absolute inset-0 p-12 transition-all duration-1000 ease-in-out ${viewIndex === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 italic"><Building2 className="text-[#c5a059]" /> VGV <span className="text-[#c5a059]">Por Construtora</span></h2>
            <div className="h-full pb-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosConstrutoras} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#666" fontSize={12} width={100} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} fill="#222">
                    <LabelList dataKey="value" position="right" formatter={(val: number) => `R$ ${(val/1000).toFixed(0)}k`} fill="#c5a059" fontSize={12} fontWeight="bold" dx={10} />
                    {dadosConstrutoras.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#c5a059' : '#222'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* TICKER RODAPÉ */}
      <div className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-3 overflow-hidden border-t-4 border-black/10">
        <div className="whitespace-nowrap animate-marquee inline-block">
          {[...vendas, ...vendas].map((v, i) => (
            <span key={i} className="mx-12 text-black font-black text-sm uppercase italic">
              🚀 {v.corretor} VENDEU: {v.unidade} em {v.construtora} • R$ {v.valor.toLocaleString()} •
            </span>
          ))}
        </div>
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[150] flex items-center justify-center p-6">
          <div className="bg-[#121212] border border-[#c5a059]/30 w-full max-w-lg rounded-[2rem] p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
            <h2 className="text-[#c5a059] text-3xl font-black italic mb-8 flex items-center gap-3"><Plus /> NOVA VENDA</h2>
            <form onSubmit={handleSalvarVenda} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Corretor</label>
                <input required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-[#c5a059] outline-none" placeholder="Nome do Corretor" value={novaVenda.corretor} onChange={(e) => setNovaVenda({...novaVenda, corretor: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Tipo</label>
                  <select className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-[#c5a059] outline-none appearance-none" value={novaVenda.unidade} onChange={(e) => setNovaVenda({...novaVenda, unidade: e.target.value})}>
                    <option>Apartamento</option><option>Casa</option><option>Lote</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Valor</label>
                  <input required type="number" className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-[#c5a059] outline-none" placeholder="R$ Valor" value={novaVenda.valor} onChange={(e) => setNovaVenda({...novaVenda, valor: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Construtora</label>
                <input required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-[#c5a059] outline-none" placeholder="Ex: Celi" value={novaVenda.construtora} onChange={(e) => setNovaVenda({...novaVenda, construtora: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl mt-4 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-[#c5a059]/20">REGISTRAR E CELEBRAR</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 50s linear infinite; }
      `}</style>
    </div>
  );
};

export default InvestechV4;
