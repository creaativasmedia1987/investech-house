import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Award, Plus, X, Save, Building2, PieChart as PieIcon, BarChart3, Calendar, Layers, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

const InvestechFinal = () => {
  // 1. ESTADO DE DADOS
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Daniel Oliveira', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, mes: 'Mar' },
    { id: 2, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, mes: 'Mar' },
    { id: 3, corretor: 'Carla Souza', unidade: 'Casa', construtora: 'Junes', valor: 890000, mes: 'Mar' },
    { id: 4, corretor: 'Bruno Costa', unidade: 'Lote', construtora: 'Damha', valor: 450000, mes: 'Fev' },
    { id: 5, corretor: 'Daniel Oliveira', unidade: 'Casa', construtora: 'Celi', valor: 950000, mes: 'Mar' },
  ]);

  const [mesSelecionado, setMesSelecionado] = useState('Mar');
  const [slideAtivo, setSlideAtivo] = useState(0); // 0: Corretores, 1: Tipos, 2: Construtoras
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ultimoVendedor, setUltimoVendedor] = useState('');
  
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Alternância Automática de Slides (Modo TV)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen && !showCelebration) {
        setSlideAtivo((prev) => (prev + 1) % 3);
      }
    }, 12000); // 12 segundos por slide
    return () => clearInterval(interval);
  }, [isModalOpen, showCelebration]);

  // 2. FILTRAGEM E PROCESSAMENTO
  const vendasFiltradas = useMemo(() => vendas.filter(v => v.mes === mesSelecionado), [vendas, mesSelecionado]);

  const vgvTotalMes = useMemo(() => vendasFiltradas.reduce((acc, v) => acc + Number(v.valor), 0), [vendasFiltradas]);
  const totalUnidadesMes = vendasFiltradas.length;

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

  const dadosConstrutoras = useMemo(() => {
    const map: Record<string, number> = vendasFiltradas.reduce((acc, v) => {
      acc[v.construtora] = (acc[v.construtora] || 0) + Number(v.valor);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [vendasFiltradas]);

  // 3. AÇÕES
  const handleSalvarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    const novaV = { id: Date.now(), ...novaVenda, valor: parseFloat(novaVenda.valor), mes: mesSelecionado };
    setVendas([...vendas, novaV]);
    setIsModalOpen(false);
    setUltimoVendedor(novaV.corretor);
    setShowCelebration(true);
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.7 }, colors: ['#c5a059', '#fff'] });
    setTimeout(() => setShowCelebration(false), 6000);
  };

  const [novaVenda, setNovaVenda] = useState({ corretor: '', unidade: 'Apartamento', construtora: '', valor: '' });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans overflow-hidden flex flex-col">
      
      {/* CELEBRAÇÃO */}
      {showCelebration && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl animate-in zoom-in duration-500">
           <span className="text-9xl animate-bounce">🍾</span>
           <h2 className="text-[#c5a059] text-7xl font-black italic tracking-tighter mt-4">VENDA REGISTRADA!</h2>
           <p className="text-4xl font-light text-white uppercase tracking-[0.5em] mt-2">{ultimoVendedor}</p>
        </div>
      )}

      {/* HEADER FIXO */}
      <header className="mb-6">
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#c5a059] p-3 rounded-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] rotate-3">
              <Zap className="text-black fill-black" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter">INVESTECH</h1>
              <p className="text-[10px] text-[#c5a059] font-bold tracking-[0.4em] uppercase">Aracaju • Real Estate Hub</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="bg-[#111] border border-white/5 px-8 py-3 rounded-2xl text-center min-w-[200px]">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">VGV {mesSelecionado}</p>
               <p className="text-3xl font-black text-white leading-none">R$ {(vgvTotalMes/1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-[#111] border border-white/5 px-6 py-3 rounded-2xl text-center">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Unidades</p>
               <p className="text-3xl font-black text-[#c5a059] leading-none">{totalUnidadesMes}</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] text-black p-4 rounded-2xl hover:scale-110 transition-all shadow-xl shadow-[#c5a059]/10">
              <Plus size={32} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO DE MESES */}
        <div className="flex bg-[#111] p-1 rounded-2xl border border-white/5">
          {meses.map((mes) => (
            <button key={mes} onClick={() => setMesSelecionado(mes)} className={`flex-1 py-3 text-xs font-black transition-all ${mesSelecionado === mes ? 'bg-[#c5a059] text-black rounded-xl shadow-lg' : 'text-gray-600 hover:text-white'}`}>
              {mes.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* ÁREA DE SLIDES DINÂMICOS */}
      <main className="flex-1 grid grid-cols-12 gap-8 mb-16 relative">
        
        {/* RANKING SEMPRE VISÍVEL (LADO ESQUERDO) */}
        <div className="col-span-4 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-8">
           <h3 className="text-[#c5a059] font-black text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-2">
             <Trophy size={16} /> Elite de Vendas {mesSelecionado}
           </h3>
           <div className="space-y-4">
             {dadosCorretores.slice(0, 5).map((c, i) => (
               <div key={i} className={`flex justify-between items-center p-5 rounded-3xl transition-all duration-500 ${i === 0 ? 'bg-[#c5a059]/10 border border-[#c5a059]/30' : 'bg-[#111] border border-transparent'}`}>
                 <div className="flex items-center gap-4">
                    <span className={`text-2xl font-black ${i === 0 ? 'text-[#c5a059]' : 'text-gray-700'}`}>{i+1}º</span>
                    <p className="font-bold text-gray-200">{c.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[#c5a059] font-black italic">R$ {(c.value/1000).toFixed(0)}k</p>
                    {i === 0 && <p className="text-[8px] text-[#c5a059] uppercase font-bold tracking-widest">Líder</p>}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* SLIDES ROTATIVOS (LADO DIREITO) */}
        <div className="col-span-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden">
          
          {/* SLIDE 1: GRÁFICO DE CORRETORES */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3"><BarChart3 className="text-[#c5a059]" /> Performance <span className="text-[#c5a059]">Por Corretor</span></h2>
            <div className="h-full pb-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosCorretores}>
                  <XAxis dataKey="name" stroke="#333" fontSize={12} tickLine={false} axisLine={false} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    <LabelList dataKey="value" position="top" formatter={(v: number) => `R$ ${(v/1000).toFixed(0)}k`} fill="#c5a059" fontSize={14} fontWeight="900" dy={-15} />
                    {dadosCorretores.map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#222'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLIDE 2: TIPOS DE IMÓVEIS */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3"><Layers className="text-[#c5a059]" /> Mix de Projetos <span className="text-[#c5a059]">Vendidos</span></h2>
            <div className="grid grid-cols-2 h-full pb-24 items-center gap-10">
                <div className="space-y-6">
                    {dadosTipos.map((t, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-4">
                            <span className="text-gray-400 font-black uppercase text-sm">{t.name}</span>
                            <span className="text-3xl font-black text-[#c5a059]">{t.value} <small className="text-[10px] text-gray-600">UNID</small></span>
                        </div>
                    ))}
                </div>
                <div className="h-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={dadosTipos} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={8} stroke="none">
                                {dadosTipos.map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#1a1a1a'} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total</p>
                        <p className="text-4xl font-black">{totalUnidadesMes}</p>
                    </div>
                </div>
            </div>
          </div>

          {/* SLIDE 3: CONSTRUTORAS */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3"><Building2 className="text-[#c5a059]" /> VGV <span className="text-[#c5a059]">Por Construtora</span></h2>
            <div className="h-full pb-24">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosConstrutoras} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#444" fontSize={12} width={120} axisLine={false} tickLine={false} />
                        <Bar dataKey="value" radius={[0, 15, 15, 0]}>
                            <LabelList dataKey="value" position="right" formatter={(v: number) => `R$ ${(v/1000).toFixed(0)}k`} fill="#c5a059" fontSize={14} fontWeight="900" dx={15} />
                            {dadosConstrutoras.map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#1a1a1a'} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>

      {/* TICKER DE RODAPÉ */}
      <div className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-3 overflow-hidden border-t-4 border-black/20">
        <div className="whitespace-nowrap animate-marquee inline-block text-black font-black text-[11px] uppercase italic tracking-widest">
          {vendasFiltradas.length > 0 ? [...vendasFiltradas, ...vendasFiltradas].map((v, i) => (
            <span key={i} className="mx-12">🔥 {v.corretor} VENDEU {v.unidade} ({v.construtora}) • R$ {v.valor.toLocaleString()} • </span>
          )) : `AGUARDANDO LANÇAMENTOS PARA ${mesSelecionado.toUpperCase()} • `}
        </div>
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[150] flex items-center justify-center p-6">
          <div className="bg-[#111] border border-[#c5a059]/20 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
            <h2 className="text-[#c5a059] text-3xl font-black italic mb-8 flex items-center gap-3"><CheckCircle2 /> LANÇAR EM {mesSelecionado}</h2>
            <form onSubmit={handleSalvarVenda} className="space-y-6">
              <input required className="w-full bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" placeholder="Nome do Corretor" value={novaVenda.corretor} onChange={(e) => setNovaVenda({...novaVenda, corretor: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" value={novaVenda.unidade} onChange={(e) => setNovaVenda({...novaVenda, unidade: e.target.value})}>
                  <option>Apartamento</option><option>Casa</option><option>Lote</option>
                </select>
                <input required type="number" className="w-full bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" placeholder="Valor da Venda R$" value={novaVenda.valor} onChange={(e) => setNovaVenda({...novaVenda, valor: e.target.value})} />
              </div>
              <input required className="w-full bg-black border border-white/5 rounded-2xl p-4 focus:border-[#c5a059] outline-none" placeholder="Qual a Construtora?" value={novaVenda.construtora} onChange={(e) => setNovaVenda({...novaVenda, construtora: e.target.value})} />
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl text-xl hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all">REGISTRAR VENDA</button>
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

export default InvestechFinal;
