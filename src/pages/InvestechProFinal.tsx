import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Plus, X, Building2, BarChart3, GitCompare, Printer, Download, FileText, ArrowUpRight, ArrowDownRight, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

const InvestechProFinal = () => {
  // 1. ESTADO DE DADOS
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Daniel Oliveira', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, mes: 'Mar' },
    { id: 2, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, mes: 'Mar' },
    { id: 3, corretor: 'Carla Souza', unidade: 'Casa', construtora: 'Junes', valor: 890000, mes: 'Mar' },
    { id: 4, corretor: 'Bruno Costa', unidade: 'Lote', construtora: 'Damha', valor: 450000, mes: 'Fev' },
    { id: 5, corretor: 'Daniel Oliveira', unidade: 'Casa', construtora: 'Celi', valor: 950000, mes: 'Mar' },
  ]);

  const [mesSelecionado, setMesSelecionado] = useState('Mar');
  const [slideAtivo, setSlideAtivo] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ultimoVendedor, setUltimoVendedor] = useState('');

  const [mesA, setMesA] = useState('Fev');
  const [mesB, setMesB] = useState('Mar');

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // ROTAÇÃO AUTOMÁTICA
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen && !isCompareOpen && !showCelebration) {
        setSlideAtivo((prev) => (prev + 1) % 3);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isModalOpen, isCompareOpen, showCelebration]);

  // PROCESSAMENTO
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

  // LÓGICA COMPARATIVO
  const relatorioComparativo = useMemo(() => {
    const fA = vendas.filter(v => v.mes === mesA);
    const fB = vendas.filter(v => v.mes === mesB);
    const vA = fA.reduce((acc, v) => acc + v.valor, 0);
    const vB = fB.reduce((acc, v) => acc + v.valor, 0);
    const cVGV = vA === 0 ? 100 : ((vB - vA) / vA) * 100;

    const corrB: Record<string, number> = fB.reduce((acc, v) => { acc[v.corretor] = (acc[v.corretor] || 0) + v.valor; return acc; }, {} as Record<string, number>);
    const compCorr = Object.entries(corrB).map(([nome, valorB]) => ({ 
        nome, 
        valorB, 
        valorA: (fA.reduce((acc, v) => v.corretor === nome ? acc + v.valor : acc, 0)) 
    })).sort((a,b) => b.valorB - a.valorB);

    return { vgvA: vA, vgvB: vB, crescimento: cVGV, corretores: compCorr };
  }, [vendas, mesA, mesB]);

  // FUNÇÃO DE IMPRESSÃO
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans overflow-hidden flex flex-col relative">
      
      {/* HEADER PRINCIPAL */}
      <header className="mb-6 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-[#c5a059] p-2 rounded-xl"><Zap className="text-black fill-black" size={24} /></div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">INVESTECH</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsCompareOpen(true)} className="bg-white/5 hover:bg-[#c5a059] hover:text-black border border-white/10 p-3 rounded-2xl transition-all flex items-center gap-2 group">
            <GitCompare size={20} />
            <span className="text-xs font-black uppercase">Comparativo</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] text-black p-3 rounded-2xl shadow-xl hover:scale-110 transition-all"><Plus size={28} /></button>
        </div>
      </header>

      {/* TIMELINE MESES */}
      <nav className="flex bg-[#111] p-1 rounded-2xl border border-white/5 mb-10 print:hidden overflow-x-auto no-scrollbar">
        {meses.map((m) => (
          <button key={m} onClick={() => setMesSelecionado(m)} className={`flex-1 py-3 text-xs font-black transition-all ${mesSelecionado === m ? 'bg-[#c5a059] text-black rounded-xl' : 'text-gray-600'}`}>
            {m.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* DASHBOARD SLIDES (Sempre visível no Hall) */}
      <main className="flex-1 grid grid-cols-12 gap-8 mb-16 print:hidden">
        <div className="col-span-4 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-8">
            <h3 className="text-[#c5a059] font-black text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-2"><Trophy size={16} /> Elite {mesSelecionado}</h3>
            {dadosCorretores.slice(0, 5).map((c, i) => (
               <div key={i} className={`flex justify-between items-center p-5 rounded-3xl mb-4 ${i === 0 ? 'bg-[#c5a059]/10 border border-[#c5a059]/30' : 'bg-[#111]'}`}>
                  <span className="font-bold">{c.name}</span>
                  <span className="text-[#c5a059] font-black italic">R$ {(c.value/1000).toFixed(0)}k</span>
               </div>
            ))}
        </div>

        <div className="col-span-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden">
            {/* Slide de Gráfico (Simplificado para o código não ficar gigante) */}
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3">
                <BarChart3 className="text-[#c5a059]" /> Performance <span className="text-[#c5a059]">{slideAtivo === 0 ? 'Corretores' : slideAtivo === 1 ? 'Mix' : 'Construtoras'}</span>
            </h2>
            <div className="h-full pb-20">
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={slideAtivo === 0 ? dadosCorretores : dadosConstrutoras}>
                        <XAxis dataKey="name" stroke="#333" fontSize={12} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                            <LabelList dataKey="value" position="top" formatter={(v: number) => `R$ ${(v/1000).toFixed(0)}k`} fill="#c5a059" fontSize={12} fontWeight="900" />
                            {(slideAtivo === 0 ? dadosCorretores : dadosConstrutoras).map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#1a1a1a'} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </main>

      {/* MODAL DE COMPARATIVO COM FUNÇÃO DE IMPRESSÃO */}
      {isCompareOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[400] flex items-center justify-center p-6 animate-in fade-in duration-300 print:relative print:bg-white print:inset-auto print:p-0 print:z-0">
           <div id="printable-report" className="bg-[#111] border border-[#c5a059]/30 w-full max-w-5xl rounded-[3rem] p-12 shadow-2xl relative print:bg-white print:border-none print:shadow-none print:p-0 print:max-w-full">
              
              {/* Botão de Fechar (Escondido na impressão) */}
              <button onClick={() => setIsCompareOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white print:hidden"><X size={32}/></button>
              
              <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-8 print:border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="bg-[#c5a059] p-3 rounded-2xl print:bg-black"><FileText className="text-black print:text-white" size={32} /></div>
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white print:text-black">RELATÓRIO DE PERFORMANCE</h2>
                        <p className="text-[#c5a059] font-bold tracking-[0.3em] uppercase text-xs print:text-gray-500">Investech Intelligence • Cruzamento {mesA} vs {mesB}</p>
                    </div>
                </div>
                
                {/* BOTÕES DE AÇÃO (Escondidos na impressão) */}
                <div className="flex gap-4 print:hidden">
                    <button onClick={handlePrint} className="bg-white text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-[#c5a059] transition-all">
                        <Printer size={20} /> IMPRIMIR / PDF
                    </button>
                </div>
              </div>

              {/* SELETORES (Escondidos na impressão) */}
              <div className="grid grid-cols-2 gap-10 mb-10 print:hidden">
                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Mês Comparativo</label>
                    <select value={mesA} onChange={(e)=>setMesA(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none">{meses.map(m=><option key={m}>{m}</option>)}</select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Mês Alvo</label>
                    <select value={mesB} onChange={(e)=>setMesB(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none">{meses.map(m=><option key={m}>{m}</option>)}</select>
                </div>
              </div>

              {/* CONTEÚDO DO RELATÓRIO */}
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 print:bg-gray-100 print:border-gray-300">
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-2 print:text-gray-600">Crescimento VGV</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-4xl font-black ${relatorioComparativo.crescimento >= 0 ? 'text-green-500' : 'text-red-500'} print:text-black`}>
                        {relatorioComparativo.crescimento.toFixed(1)}%
                    </p>
                    {relatorioComparativo.crescimento >= 0 ? <ArrowUpRight className="text-green-500" /> : <ArrowDownRight className="text-red-500" />}
                  </div>
                </div>
                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 col-span-2 print:bg-gray-100 print:border-gray-300">
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-2 print:text-gray-600">Volume Total {mesB}</p>
                  <p className="text-4xl font-black text-white print:text-black italic">R$ {relatorioComparativo.vgvB.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5 print:bg-transparent print:border-gray-200">
                <h4 className="text-[#c5a059] font-black text-xs uppercase tracking-widest mb-8 print:text-black">Performance Detalhada por Corretor</h4>
                <div className="space-y-6">
                   {relatorioComparativo.corretores.map((c, i) => (
                     <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 print:border-gray-200">
                        <div>
                            <p className="text-lg font-black text-white print:text-black">{c.nome}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Volume no período anterior: R$ {c.valorA.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-[#c5a059] print:text-black">R$ {c.valorB.toLocaleString()}</p>
                            <span className={`text-[10px] font-bold ${c.valorB >= c.valorA ? 'text-green-500' : 'text-red-500'}`}>
                                {c.valorB >= c.valorA ? '↑ EVOLUÇÃO' : '↓ RETRAÇÃO'}
                            </span>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* Rodapé do PDF */}
              <div className="hidden print:block mt-12 text-center border-t border-gray-200 pt-8">
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Gerado automaticamente pelo Investech Intelligence • {new Date().toLocaleDateString()}</p>
              </div>
           </div>
        </div>
      )}

      {/* ESTILOS DE IMPRESSÃO */}
      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; color: black !important; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
};

export default InvestechProFinal;
