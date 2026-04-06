import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Award, Plus, X, Save, Building2, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, GitCompare, Users, Layers, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

const InvestechEliteV6 = () => {
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
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ultimoVendedor, setUltimoVendedor] = useState('');

  // Estados do Comparativo
  const [mesA, setMesA] = useState('Fev');
  const [mesB, setMesB] = useState('Mar');

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // 2. MOTOR DE ROTAÇÃO AUTOMÁTICA (MODO TV)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen && !isCompareOpen && !showCelebration) {
        setSlideAtivo((prev) => (prev + 1) % 3);
      }
    }, 10000); // Troca a cada 10 segundos
    return () => clearInterval(interval);
  }, [isModalOpen, isCompareOpen, showCelebration]);

  // 3. PROCESSAMENTO DE DADOS (FILTRADOS POR MÊS)
  const vendasFiltradas = useMemo(() => vendas.filter(v => v.mes === mesSelecionado), [vendas, mesSelecionado]);
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

  const dadosConstrutoras = useMemo(() => {
    const map: Record<string, number> = vendasFiltradas.reduce((acc, v) => {
      acc[v.construtora] = (acc[v.construtora] || 0) + Number(v.valor);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [vendasFiltradas]);

  // 4. LÓGICA DO COMPARATIVO
  const relatorioComparativo = useMemo(() => {
    const fA = vendas.filter(v => v.mes === mesA);
    const fB = vendas.filter(v => v.mes === mesB);
    const vA = fA.reduce((acc, v) => acc + v.valor, 0);
    const vB = fB.reduce((acc, v) => acc + v.valor, 0);
    const cVGV = vA === 0 ? 100 : ((vB - vA) / vA) * 100;

    const corrB: Record<string, number> = fB.reduce((acc, v) => { acc[v.corretor] = (acc[v.corretor] || 0) + v.valor; return acc; }, {} as Record<string, number>);
    const compCorr = Object.entries(corrB).map(([nome, valorB]) => ({ nome, valorB })).sort((a,b) => b.valorB - a.valorB);

    return { vgvA: vA, vgvB: vB, crescimento: cVGV, corretores: compCorr };
  }, [vendas, mesA, mesB]);

  // 5. AÇÕES
  const handleSalvarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    const novaV = { id: Date.now(), ...novaVendaForm, mes: mesSelecionado, valor: parseFloat(novaVendaForm.valor) };
    setVendas([...vendas, novaV]);
    setIsModalOpen(false);
    setUltimoVendedor(novaV.corretor);
    setShowCelebration(true);
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.8 }, colors: ['#c5a059', '#ffffff'] });
    setTimeout(() => setShowCelebration(false), 5000);
  };

  const [novaVendaForm, setNovaVendaForm] = useState({ corretor: '', unidade: 'Apartamento', construtora: '', valor: '' });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans overflow-hidden flex flex-col relative">
      
      {/* CELEBRAÇÃO 🍾 */}
      {showCelebration && (
        <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl">
           <span className="text-9xl animate-bounce">🍾</span>
           <h2 className="text-[#c5a059] text-7xl font-black italic tracking-tighter">VENDA REGISTRADA!</h2>
           <p className="text-4xl text-white uppercase tracking-[0.5em] mt-4">{ultimoVendedor}</p>
        </div>
      )}

      {/* HEADER E FILTROS */}
      <header className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#c5a059] p-2 rounded-xl"><Zap className="text-black fill-black" size={24} /></div>
            <h1 className="text-3xl font-black italic tracking-tighter">INVESTECH</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#111] px-6 py-2 rounded-2xl border border-white/5">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">VGV {mesSelecionado}</p>
              <p className="text-2xl font-black text-[#c5a059]">R$ {(vgvTotalMes/1000000).toFixed(1)}M</p>
            </div>
            
            <button onClick={() => setIsCompareOpen(true)} className="bg-white/5 hover:bg-[#c5a059] hover:text-black border border-white/10 p-3 rounded-2xl transition-all flex items-center gap-2 group">
              <GitCompare size={20} />
              <span className="text-xs font-black uppercase tracking-tighter">Comparativo</span>
            </button>

            <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] text-black p-3 rounded-2xl shadow-xl hover:scale-110 transition-all">
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>
        </div>

        <nav className="flex bg-[#111] p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {meses.map((m) => (
            <button key={m} onClick={() => setMesSelecionado(m)} className={`flex-1 py-3 text-xs font-black transition-all ${mesSelecionado === m ? 'bg-[#c5a059] text-black rounded-xl shadow-lg' : 'text-gray-600 hover:text-white'}`}>
              {m.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN CONTENT COM SLIDES */}
      <main className="flex-1 grid grid-cols-12 gap-8 mb-16 relative">
        
        {/* RANKING FIXO (ESQUERDA) */}
        <div className="col-span-4 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-8">
           <h3 className="text-[#c5a059] font-black text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-2">
             <Trophy size={16} /> Elite {mesSelecionado}
           </h3>
           <div className="space-y-4">
             {dadosCorretores.slice(0, 5).map((c, i) => (
               <div key={i} className={`flex justify-between items-center p-5 rounded-3xl transition-all ${i === 0 ? 'bg-[#c5a059]/10 border border-[#c5a059]/30' : 'bg-[#111]'}`}>
                  <span className={`text-xl font-black ${i === 0 ? 'text-[#c5a059]' : 'text-gray-700'}`}>{i+1}º</span>
                  <p className="font-bold flex-1 ml-4">{c.name}</p>
                  <p className="text-[#c5a059] font-black italic">R$ {(c.value/1000).toFixed(0)}k</p>
               </div>
             ))}
           </div>
        </div>

        {/* SLIDES ROTATIVOS (DIREITA) */}
        <div className="col-span-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden">
          
          {/* SLIDE 0: PERFORMANCE CORRETORES */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3"><BarChart3 className="text-[#c5a059]" /> VGV <span className="text-[#c5a059]">Por Corretor</span></h2>
            <div className="h-full pb-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosCorretores}>
                  <XAxis dataKey="name" stroke="#333" fontSize={12} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    <LabelList dataKey="value" position="top" formatter={(v: number) => `R$ ${(v/1000).toFixed(0)}k`} fill="#c5a059" fontSize={14} fontWeight="900" dy={-15} />
                    {dadosCorretores.map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#222'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLIDE 1: TIPOS DE IMÓVEL */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3"><PieIcon className="text-[#c5a059]" /> Mix <span className="text-[#c5a059]">de Unidades</span></h2>
            <div className="grid grid-cols-2 h-full pb-24 items-center gap-10">
                <div className="space-y-6">
                    {dadosTipos.map((t, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-4">
                            <span className="text-gray-400 font-black uppercase text-sm">{t.name}</span>
                            <span className="text-3xl font-black text-[#c5a059]">{t.value} un</span>
                        </div>
                    ))}
                </div>
                <div className="h-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={dadosTipos} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={8}>
                                {dadosTipos.map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#1a1a1a'} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>

          {/* SLIDE 2: CONSTRUTORAS */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3"><Building2 className="text-[#c5a059]" /> VGV <span className="text-[#c5a059]">Por Construtora</span></h2>
            <div className="h-full pb-24">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosConstrutoras} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#444" fontSize={12} width={100} axisLine={false} tickLine={false} />
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

      {/* TICKER RODAPÉ */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-3 overflow-hidden border-t-4 border-black/20">
        <div className="whitespace-nowrap animate-marquee inline-block text-black font-black text-xs uppercase italic">
          {vendasFiltradas.map((v, i) => (
            <span key={i} className="mx-12">🔥 {v.corretor} vendeu {v.unidade} em {v.construtora} • R$ {v.valor.toLocaleString()} • </span>
          ))}
        </div>
      </footer>

      {/* MODAL COMPARATIVO */}
      {isCompareOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[400] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[#111] border border-[#c5a059]/30 w-full max-w-4xl rounded-[3rem] p-12 relative shadow-2xl">
              <button onClick={() => setIsCompareOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32}/></button>
              <h2 className="text-3xl font-black italic mb-10 flex items-center gap-3 tracking-tighter uppercase">
                <GitCompare className="text-[#c5a059]" /> Cruzamento de <span className="text-[#c5a059]">Performance</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-10 mb-10">
                <select value={mesA} onChange={(e)=>setMesA(e.target.value)} className="bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none">{meses.map(m=><option key={m}>{m}</option>)}</select>
                <select value={mesB} onChange={(e)=>setMesB(e.target.value)} className="bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none">{meses.map(m=><option key={m}>{m}</option>)}</select>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10 text-center italic">
                <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1 tracking-widest italic">Crescimento VGV</p>
                  <p className={`text-4xl font-black ${relatorioComparativo.crescimento >= 0 ? 'text-green-500' : 'text-red-500'}`}>{relatorioComparativo.crescimento.toFixed(1)}%</p>
                </div>
                <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1 tracking-widest italic">VGV Bruto {mesB}</p>
                  <p className="text-4xl font-black text-white italic">R$ {(relatorioComparativo.vgvB/1000000).toFixed(2)}M</p>
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                {relatorioComparativo.corretores.map((c, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="font-bold text-gray-400">{c.nome}</span>
                    <span className="text-[#c5a059] font-black italic text-sm">R$ {(c.valorB/1000).toFixed(0)}k no mês alvo</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {/* MODAL NOVO LANÇAMENTO (Ficou limpo agora) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[400] flex items-center justify-center p-6">
          <div className="bg-[#111] border border-[#c5a059]/20 w-full max-w-lg rounded-[3rem] p-10 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500"><X /></button>
            <h2 className="text-[#c5a059] text-3xl font-black italic mb-8 flex items-center gap-3">Novo Lançamento</h2>
            <form onSubmit={handleSalvarVenda} className="space-y-6">
              <input required className="w-full bg-black border border-white/5 rounded-2xl p-4 outline-none focus:border-[#c5a059]" placeholder="Nome do Corretor" value={novaVendaForm.corretor} onChange={(e)=>setNovaVendaForm({...novaVendaForm, corretor: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black border border-white/5 rounded-2xl p-4 outline-none" value={novaVendaForm.unidade} onChange={(e)=>setNovaVendaForm({...novaVendaForm, unidade: e.target.value})}><option>Apartamento</option><option>Casa</option><option>Lote</option></select>
                <input required type="number" className="w-full bg-black border border-white/5 rounded-2xl p-4 outline-none focus:border-[#c5a059]" placeholder="Valor R$" value={novaVendaForm.valor} onChange={(e)=>setNovaVendaForm({...novaVendaForm, valor: e.target.value})} />
              </div>
              <input required className="w-full bg-black border border-white/5 rounded-2xl p-4 outline-none focus:border-[#c5a059]" placeholder="Construtora" value={novaVendaForm.construtora} onChange={(e)=>setNovaVendaForm({...novaVendaForm, construtora: e.target.value})} />
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl text-xl">SALVAR E CELEBRAR</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default InvestechEliteV6;
