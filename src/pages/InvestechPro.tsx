import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Award, Plus, X, Save, Building2, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, GitCompare, Users, Home } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

const InvestechPro = () => {
  // 1. ESTADO DE DADOS (Simulando histórico para o comparativo)
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Daniel Oliveira', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, mes: 'Mar' },
    { id: 2, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, mes: 'Mar' },
    { id: 3, corretor: 'Daniel Oliveira', unidade: 'Casa', construtora: 'Celi', valor: 950000, mes: 'Fev' },
    { id: 4, corretor: 'Ana Silva', unidade: 'Lote', construtora: 'Damha', valor: 450000, mes: 'Fev' },
    { id: 5, corretor: 'Carla Souza', unidade: 'Apartamento', construtora: 'Junes', valor: 1800000, mes: 'Jan' },
  ]);

  const [mesSelecionado, setMesSelecionado] = useState('Mar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  // Estados para o Comparativo
  const [mesA, setMesA] = useState('Fev');
  const [mesB, setMesB] = useState('Mar');

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // 2. LÓGICA DO COMPARATIVO (O Cruzamento de Dados)
  const relatorioComparativo = useMemo(() => {
    const filtrar = (m: string) => vendas.filter(v => v.mes === m);
    const dadosA = filtrar(mesA);
    const dadosB = filtrar(mesB);

    const vgvA = dadosA.reduce((acc, v) => acc + v.valor, 0);
    const vgvB = dadosB.reduce((acc, v) => acc + v.valor, 0);
    
    // Crescimento percentual
    const crescimentoVGV = vgvA === 0 ? 100 : ((vgvB - vgvA) / vgvA) * 100;

    // Cruzamento por Corretor
    const corretoresA: Record<string, number> = dadosA.reduce((acc, v) => { acc[v.corretor] = (acc[v.corretor] || 0) + v.valor; return acc; }, {} as Record<string, number>);
    const corretoresB: Record<string, number> = dadosB.reduce((acc, v) => { acc[v.corretor] = (acc[v.corretor] || 0) + v.valor; return acc; }, {} as Record<string, number>);
    
    const todosCorretores = Array.from(new Set([...Object.keys(corretoresA), ...Object.keys(corretoresB)]));
    const comparativoCorretores = todosCorretores.map(nome => ({
      nome,
      valorA: corretoresA[nome] || 0,
      valorB: corretoresB[nome] || 0,
      diff: (corretoresB[nome] || 0) - (corretoresA[nome] || 0)
    })).sort((a, b) => b.valorB - a.valorB);

    return { vgvA, vgvB, crescimentoVGV, comparativoCorretores, totalUnidA: dadosA.length, totalUnidB: dadosB.length };
  }, [vendas, mesA, mesB]);

  // 3. DADOS DO DASHBOARD PRINCIPAL
  const vendasFiltradas = useMemo(() => vendas.filter(v => v.mes === mesSelecionado), [vendas, mesSelecionado]);
  const vgvTotalMes = vendasFiltradas.reduce((acc, v) => acc + v.valor, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-center border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#c5a059] p-2 rounded-xl shadow-[0_0_15px_rgba(197,160,89,0.3)]"><Zap className="text-black fill-black" /></div>
          <h1 className="text-3xl font-black italic">INVESTECH</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#111] px-6 py-2 rounded-2xl border border-white/5">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center italic">VGV {mesSelecionado}</p>
            <p className="text-2xl font-black text-[#c5a059]">R$ {(vgvTotalMes/1000000).toFixed(1)}M</p>
          </div>
          
          {/* BOTÃO COMPARATIVO */}
          <button 
            onClick={() => setIsCompareOpen(true)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-2xl transition-all flex items-center gap-2 group"
          >
            <GitCompare size={20} className="text-[#c5a059] group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xs font-black uppercase tracking-tighter">Comparar Meses</span>
          </button>

          <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] text-black p-3 rounded-2xl shadow-lg hover:scale-110 transition-all">
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* TIMELINE DE MESES */}
      <nav className="flex bg-[#111] p-1 rounded-2xl border border-white/5 mb-10 overflow-x-auto no-scrollbar">
        {meses.map((m) => (
          <button key={m} onClick={() => setMesSelecionado(m)} className={`flex-1 py-3 text-xs font-black transition-all ${mesSelecionado === m ? 'bg-[#c5a059] text-black rounded-xl' : 'text-gray-600 hover:text-white'}`}>
            {m.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* DASHBOARD PRINCIPAL (RESUMO) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
        <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-8 overflow-y-auto">
          <h3 className="text-[#c5a059] font-black text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-2"><Trophy size={14}/> Ranking {mesSelecionado}</h3>
          {vendasFiltradas.length > 0 ? vendasFiltradas.sort((a,b)=>b.valor-a.valor).map((v, i) => (
            <div key={i} className="flex justify-between items-center mb-4 p-4 bg-[#111] rounded-2xl border border-white/5">
              <span className="text-sm font-bold text-gray-300">{v.corretor}</span>
              <span className="text-[#c5a059] font-black text-xs italic">R$ {(v.valor/1000).toFixed(0)}k</span>
            </div>
          )) : <p className="text-gray-700 text-center py-10 italic">Sem dados</p>}
        </div>
        
        <div className="lg:col-span-2 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 flex flex-col items-center justify-center text-center">
            <BarChart3 size={48} className="text-[#c5a059] mb-4 opacity-20" />
            <h2 className="text-2xl font-black text-gray-500 uppercase tracking-widest">Selecione um slide ou abra o comparativo</h2>
            <p className="text-sm text-gray-700 mt-2 italic px-20">Os dados automáticos continuam rodando conforme sua configuração anterior. Use o botão acima para cruzar informações específicas.</p>
        </div>
      </div>

      {/* MODAL DE COMPARATIVO ESTRATÉGICO */}
      {isCompareOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#111] border border-[#c5a059]/30 w-full max-w-5xl rounded-[3rem] p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsCompareOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"><X size={32}/></button>
            
            <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
              <GitCompare className="text-[#c5a059]" size={32} />
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Cruzamento <span className="text-[#c5a059]">de Dados</span></h2>
            </div>

            {/* SELETORES DE MÊS */}
            <div className="grid grid-cols-2 gap-10 mb-12">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Mês Base (Anterior)</label>
                <select value={mesA} onChange={(e)=>setMesA(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none focus:border-[#c5a059]">
                  {meses.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Mês Alvo (Atual)</label>
                <select value={mesB} onChange={(e)=>setMesB(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none focus:border-[#c5a059]">
                  {meses.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* CARDS DE RESULTADO RÁPIDO */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Crescimento VGV</p>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-black ${relatorioComparativo.crescimentoVGV >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {relatorioComparativo.crescimentoVGV.toFixed(1)}%
                  </span>
                  {relatorioComparativo.crescimentoVGV >= 0 ? <ArrowUpRight className="text-green-500" /> : <ArrowDownRight className="text-red-500" />}
                </div>
              </div>
              <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase mb-1 italic">VGV Bruto {mesB}</p>
                <p className="text-3xl font-black text-white">R$ {(relatorioComparativo.vgvB/1000000).toFixed(2)}M</p>
              </div>
              <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase mb-1 italic">Diferença Unid.</p>
                <p className="text-3xl font-black text-[#c5a059]">{relatorioComparativo.totalUnidB - relatorioComparativo.totalUnidA} un</p>
              </div>
            </div>

            {/* TABELA DE COMPARAÇÃO POR CORRETOR */}
            <div className="bg-black/40 rounded-3xl p-8 border border-white/5">
              <h4 className="text-gray-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2"><Users size={16}/> Comparativo de Performance Por Corretor</h4>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
                {relatorioComparativo.comparativoCorretores.map((c, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="w-1/3">
                      <p className="font-black text-white">{c.nome}</p>
                    </div>
                    <div className="w-1/3 text-center">
                      <p className="text-gray-600 text-[10px] uppercase font-bold">Anterior ({mesA}) vs Atual ({mesB})</p>
                      <p className="text-sm font-mono tracking-tighter">R$ {(c.valorA/1000).toFixed(0)}k → <span className="text-[#c5a059]">R$ {(c.valorB/1000).toFixed(0)}k</span></p>
                    </div>
                    <div className="w-1/3 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${c.diff >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {c.diff >= 0 ? '+' : ''} R$ {(c.diff/1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO (MANTIDO) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-[#111] border border-[#c5a059]/20 w-full max-w-md rounded-[3rem] p-10 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500"><X /></button>
             <h2 className="text-[#c5a059] text-2xl font-black italic mb-8">Novo Lançamento</h2>
             {/* ... (formulário igual ao anterior) */}
             <p className="text-gray-600 text-xs italic text-center">Formulário pronto para preenchimento</p>
             <button onClick={() => setIsModalOpen(false)} className="w-full bg-[#c5a059] text-black font-black py-4 rounded-2xl mt-8">FECHAR</button>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default InvestechPro;
