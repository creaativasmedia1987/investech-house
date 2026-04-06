import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Zap, Plus, X, Building2, BarChart3, GitCompare, Settings, Trash2, Edit3, Lock, UserCircle2, Layers, PieChart as PieIcon, ListTodo, FileText, Printer, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, LabelList } from 'recharts';
import confetti from 'canvas-confetti';

const InvestechUltimate = () => {
  // 1. ESTADO DE DADOS
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Daniel Oliveira', foto: 'https://i.pravatar.cc/150?u=daniel', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, mes: 'Mar' },
    { id: 2, corretor: 'Ana Silva', foto: 'https://i.pravatar.cc/150?u=ana', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, mes: 'Mar' },
    { id: 3, corretor: 'Maíra Ribeiro', foto: 'https://i.pravatar.cc/150?u=maira', unidade: 'Casa', construtora: 'Junes', valor: 3500000, mes: 'Mar' },
    { id: 4, corretor: 'Bruno Costa', foto: 'https://i.pravatar.cc/150?u=bruno', unidade: 'Lote', construtora: 'Damha', valor: 450000, mes: 'Fev' }
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  
  const [mesSelecionado, setMesSelecionado] = useState('Mar');
  const [slideAtivo, setSlideAtivo] = useState(0); // 0: Corretores, 1: Tipos, 2: Construtoras, 3: Log de Vendas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ultimoVendedor, setUltimoVendedor] = useState('');

  const [mesA, setMesA] = useState('Fev');
  const [mesB, setMesB] = useState('Mar');

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // 2. ADMINISTRAÇÃO E MOTOR DO MODO TV
  const handleAdminLogin = () => {
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
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen && !isCompareOpen && !showCelebration && !showAdminLogin) {
        setSlideAtivo((prev) => (prev + 1) % 4);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isModalOpen, isCompareOpen, showCelebration, showAdminLogin]);

  // 3. PROCESSAMENTO DOS DADOS (GRÁFICOS, RANKING, VGV)
  const vendasFiltradas = useMemo(() => vendas.filter(v => v.mes === mesSelecionado), [vendas, mesSelecionado]);
  const vgvTotalMes = useMemo(() => vendasFiltradas.reduce((acc, v) => acc + Number(v.valor), 0), [vendasFiltradas]);

  const rankingCorretores = useMemo(() => {
    const map: Record<string, { nome: string, foto: string, valor: number }> = vendasFiltradas.reduce((acc, v) => {
      if (!acc[v.corretor]) acc[v.corretor] = { nome: v.corretor, foto: v.foto, valor: 0 };
      acc[v.corretor].valor += Number(v.valor);
      return acc;
    }, {} as Record<string, { nome: string, foto: string, valor: number }>);
    return Object.values(map).sort((a,b) => b.valor - a.valor);
  }, [vendasFiltradas]);

  const dadosCorretores = rankingCorretores.map(c => ({ name: c.nome, value: c.valor }));

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

  // Lógica do Comparativo
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

  const handlePrint = () => { window.print(); };

  const [novaVendaForm, setNovaVendaForm] = useState({ corretor: '', foto: '', unidade: 'Apartamento', construtora: '', valor: '' });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans flex flex-col relative overflow-hidden">
      
      {/* CELEBRAÇÃO */}
      {showCelebration && (
        <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl">
           <span className="text-9xl animate-bounce">🍾</span>
           <h2 className="text-[#c5a059] text-7xl font-black italic tracking-tighter">VENDA REGISTRADA!</h2>
           <p className="text-4xl text-white uppercase tracking-[0.5em] mt-4">{ultimoVendedor}</p>
        </div>
      )}

      {/* HEADER DA APLICAÇÃO */}
      <header className="mb-6 flex justify-between items-center print:hidden z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#c5a059] p-2 rounded-xl shadow-lg shadow-[#c5a059]/20"><Zap className="text-black fill-black" size={24} /></div>
          <h1 className="text-3xl font-black italic tracking-tighter">INVESTECH <span className="text-[#c5a059]">ULTIMATE</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#111] px-6 py-2 rounded-2xl border border-white/5">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">VGV {mesSelecionado}</p>
            <p className="text-2xl font-black text-[#c5a059]">R$ {(vgvTotalMes/1000000).toFixed(1)}M</p>
          </div>

          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${isAdmin ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            {isAdmin ? <Lock size={20} /> : <Settings size={20} />}
            <span className="text-[10px] font-black uppercase">{isAdmin ? 'Sair' : 'Gestão'}</span>
          </button>

          <button onClick={() => setIsCompareOpen(true)} className="bg-white/5 hover:bg-[#c5a059] hover:text-black border border-white/10 p-3 rounded-2xl transition-all flex items-center gap-2">
            <GitCompare size={20} />
            <span className="text-[10px] font-black uppercase">Comparativo</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] text-black p-3 rounded-2xl shadow-xl hover:scale-110 transition-all"><Plus size={28} /></button>
        </div>
      </header>

      {/* NAVEGAÇÃO DOS MESES NO TOPO (A QUE HAVIA SUMIDO) */}
      <nav className="flex bg-[#111] p-1 rounded-2xl border border-white/5 mb-8 print:hidden overflow-x-auto no-scrollbar z-10">
        {meses.map((m) => (
          <button key={m} onClick={() => setMesSelecionado(m)} className={`flex-1 py-3 text-xs font-black transition-all ${mesSelecionado === m ? 'bg-[#c5a059] text-black rounded-xl shadow-lg' : 'text-gray-600 hover:text-white'}`}>
            {m.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* DASHBOARD PRINCIPAL */}
      <main className="flex-1 grid grid-cols-12 gap-8 mb-16 print:hidden z-10">
        
        {/* RANKING VISUAL (Com fotos) (LADO ESQUERDO) */}
        <div className="col-span-4 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[#c5a059] font-black text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
              <Trophy size={16} /> Elite {mesSelecionado}
            </h3>
          </div>

          <div className="space-y-6 overflow-y-auto no-scrollbar flex-1 pb-4">
            {rankingCorretores.length > 0 ? rankingCorretores.map((c, i) => (
              <div key={i} className={`relative flex items-center p-4 rounded-[2rem] transition-all ${i === 0 ? 'bg-gradient-to-r from-[#c5a059]/15 to-transparent border border-[#c5a059]/30' : 'bg-[#111] border border-transparent'}`}>
                <div className="relative">
                  <img src={c.foto || 'https://via.placeholder.com/150'} alt={c.nome} className={`w-14 h-14 rounded-full object-cover border-2 ${i === 0 ? 'border-[#c5a059]' : 'border-gray-700'}`} />
                  {i === 0 && <div className="absolute -top-2 -left-2 bg-[#c5a059] text-black rounded-full p-1"><Trophy size={12} /></div>}
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-black text-sm uppercase tracking-tight">{c.nome}</p>
                  <p className="text-[#c5a059] font-black italic text-lg">R$ {(c.valor/1000).toFixed(0)}k</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-700 font-black italic text-2xl">#{i+1}</span>
                </div>
              </div>
            )) : <p className="text-center text-gray-700 py-10 italic">Nenhuma venda em {mesSelecionado}.</p>}
          </div>
        </div>

        {/* SLIDES ROTATIVOS (LADO DIREITO) */}
        <div className="col-span-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden h-[500px]">
          
          {/* SLIDE 0: GRÁFICO CORRETORES */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-10 italic flex items-center gap-3"><BarChart3 className="text-[#c5a059]" /> Performance <span className="text-[#c5a059]">Por Corretor</span></h2>
            <div className="h-full pb-20">
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
            <div className="h-full pb-20">
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

          {/* SLIDE 3: LOG DE VENDAS */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 ${slideAtivo === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-8 italic flex items-center gap-3">
              <ListTodo className="text-[#c5a059]" /> Log <span className="text-[#c5a059]">de Vendas</span>
            </h2>
            <div className="space-y-3 overflow-y-auto h-[320px] pr-4 custom-scroll">
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
                    
                    {/* BOTÕES DE GESTÃO (SÓ GESTOR) */}
                    {isAdmin && (
                      <div className="flex gap-2 animate-in slide-in-from-right">
                        <button className="p-2 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={16}/></button>
                        <button onClick={() => deletarVenda(v.id)} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                      </div>
                    )}
                  </div>
                </div>
              )) : <p className="text-gray-800 italic text-center py-20 uppercase font-black tracking-widest">Sem vendas no período</p>}
            </div>
          </div>
        </div>
      </main>

      {/* TICKER DE RODAPÉ (TICKER) */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-3 overflow-hidden border-t-4 border-black/20 z-10 print:hidden">
        <div className="whitespace-nowrap animate-marquee inline-block text-black font-black text-xs uppercase italic">
          {vendasFiltradas.length > 0 ? vendasFiltradas.map((v, i) => (
            <span key={i} className="mx-12">🔥 {v.corretor} vendeu {v.unidade} em {v.construtora} • R$ {v.valor.toLocaleString()} • </span>
          )) : <span className="mx-12">AGUARDANDO LANÇAMENTOS PARA {mesSelecionado.toUpperCase()}...</span>}
        </div>
      </footer>

      {/* MODAL DE LOGIN GESTOR */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[600] flex items-center justify-center p-6 print:hidden">
          <div className="bg-[#111] border border-white/10 w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl">
            <Lock className="mx-auto text-[#c5a059] mb-4" size={48} />
            <h2 className="text-2xl font-black italic mb-2">Acesso Restrito</h2>
            <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Apenas sócios e administradores</p>
            <input 
              type="password" 
              placeholder="Digite a Senha (1234)" 
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-center mb-6 outline-none focus:border-[#c5a059]"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowAdminLogin(false)} className="flex-1 text-gray-500 font-bold uppercase text-xs hover:text-white">Cancelar</button>
              <button onClick={handleAdminLogin} className="flex-1 bg-[#c5a059] text-black font-black py-4 rounded-2xl">Entrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO LANÇAMENTO (Ficou limpo agora) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 print:hidden">
          <div className="bg-[#111] border border-[#c5a059]/20 w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
            <h2 className="text-[#c5a059] text-3xl font-black italic mb-8">Registrar Venda</h2>
            <form onSubmit={handleSalvarVenda} className="space-y-4">
              <input required className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c5a059]" placeholder="Nome do Corretor" value={novaVendaForm.corretor} onChange={(e)=>setNovaVendaForm({...novaVendaForm, corretor: e.target.value})} />
              <input className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none text-xs focus:border-[#c5a059]" placeholder="URL da Foto (opcional, ex: https://i.pravatar.cc/150)" value={novaVendaForm.foto} onChange={(e)=>setNovaVendaForm({...novaVendaForm, foto: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c5a059]" value={novaVendaForm.unidade} onChange={(e)=>setNovaVendaForm({...novaVendaForm, unidade: e.target.value})}><option>Apartamento</option><option>Casa</option><option>Lote</option></select>
                <input required type="number" className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c5a059]" placeholder="Valor R$" value={novaVendaForm.valor} onChange={(e)=>setNovaVendaForm({...novaVendaForm, valor: e.target.value})} />
              </div>
              <input required className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none focus:border-[#c5a059]" placeholder="Construtora" value={novaVendaForm.construtora} onChange={(e)=>setNovaVendaForm({...novaVendaForm, construtora: e.target.value})} />
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl text-xl mt-2 hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all">SALVAR E CELEBRAR</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL COMPARATIVO / IMPRESSÃO PDf */}
      {isCompareOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[400] flex items-center justify-center p-6 animate-in fade-in duration-300 print:relative print:bg-white print:inset-auto print:p-0 print:z-0">
           <div id="printable-report" className="bg-[#111] border border-[#c5a059]/30 w-full max-w-5xl rounded-[3rem] p-12 shadow-2xl relative print:bg-white print:border-none print:shadow-none print:p-0 print:max-w-full">
              
              <button onClick={() => setIsCompareOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white print:hidden"><X size={32}/></button>
              
              <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-8 print:border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="bg-[#c5a059] p-3 rounded-2xl print:bg-black"><FileText className="text-black print:text-white" size={32} /></div>
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white print:text-black">RELATÓRIO DE PERFORMANCE</h2>
                        <p className="text-[#c5a059] font-bold tracking-[0.3em] uppercase text-xs print:text-gray-500">Investech Intelligence • {mesA} vs {mesB}</p>
                    </div>
                </div>
                
                <div className="flex gap-4 print:hidden">
                    <button onClick={handlePrint} className="bg-white text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-[#c5a059] transition-all">
                        <Printer size={20} /> IMPRIMIR / PDF
                    </button>
                </div>
              </div>

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
                <div className="space-y-6 max-h-60 overflow-y-auto custom-scroll print:max-h-full print:overflow-visible">
                   {relatorioComparativo.corretores.map((c, i) => (
                     <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 print:border-gray-200">
                        <div>
                            <p className="text-lg font-black text-white print:text-black">{c.nome}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Volume {mesA}: R$ {c.valorA.toLocaleString()}</p>
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
           </div>
        </div>
      )}

      {/* ESTILOS DE IMPRESSÃO, SCROLL, ETC */}
      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; color: black !important; }
        }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default InvestechUltimate;
