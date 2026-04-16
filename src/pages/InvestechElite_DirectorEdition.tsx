import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, Zap, Plus, X, Swords, Flame, Settings, Trash2, Edit3, Lock, Volume2, DollarSign, GitCompare, FileText, Printer, ArrowUpRight, ArrowDownRight, LogOut, Users, User, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList, PieChart, Pie } from 'recharts';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://ozgqkcprjlsihbqgxwjx.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_ZTochwiz1H3kqkA3Svnn-g_dnsbiwkK'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const InvestechElite_DirectorEdition = () => {
  // 1. ESTADO DE DADOS (Persistência com LocalStorage)
  const [vendas, setVendas] = useState(() => {
    try {
      const saved = localStorage.getItem('vendas_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [corretores, setCorretores] = useState(() => {
    try {
      const saved = localStorage.getItem('corretores_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const { logout, currentUser, users, addUser, removeUser } = useAuth();
  
  const isMasterUser = users.find(u => u.username === currentUser)?.role === 'master';
  const [newUserRole, setNewUserRole] = useState<'master' | 'user'>('user');
  
  const [mesSelecionado, setMesSelecionado] = useState('Jan');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCorretorModalOpen, setIsCorretorModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [slideAtivo, setSlideAtivo] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ultimaVenda, setUltimaVenda] = useState<{ corretor: string, valor: number } | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [mesA, setMesA] = useState('Jan');
  const [mesB, setMesB] = useState('Jan');
  const [valorFormatado, setValorFormatado] = useState('');
  const [fotoBase64, setFotoBase64] = useState<string>('');
  const [editingVenda, setEditingVenda] = useState<any>(null);

  const [vgvUsados, setVgvUsados] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('vgv_usados_v3');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [isVgvModalOpen, setIsVgvModalOpen] = useState(false);
  const [vgvUsadosTemp, setVgvUsadosTemp] = useState('');

  // 2. FUNÇÃO DE CELEBRAÇÃO
  const celebrarVenda = (dados?: { corretor: string, valor: number }) => {
    if (dados) {
      setUltimaVenda(dados);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 6000);
    }
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3');
    audio.play().catch(() => {});
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#c5a059', '#ffffff', '#ffd700']
    });
  };

  // 3. LOGICA DO MODO TV E PERSISTÊNCIA
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen && !isCorretorModalOpen && !isCompareOpen && !showCelebration) {
        setSlideAtivo((prev) => (prev + 1) % 6); 
      }
    }, 10000); 
    return () => clearInterval(interval);
  }, [isModalOpen, isCorretorModalOpen, isCompareOpen, showCelebration]);

  useEffect(() => {
    localStorage.setItem('vendas_v3', JSON.stringify(vendas));
  }, [vendas]);

  useEffect(() => {
    localStorage.setItem('corretores_v3', JSON.stringify(corretores));
  }, [corretores]);

  useEffect(() => {
    localStorage.setItem('vgv_usados_v3', JSON.stringify(vgvUsados));
  }, [vgvUsados]);

  // 4. PROCESSAMENTO DE DADOS
  const vendasFiltradas = useMemo(() => vendas.filter((v: any) => v.mes === mesSelecionado), [vendas, mesSelecionado]);

  const dadosRanking = useMemo(() => {
    try {
      const map: Record<string, { nome: string, valor: number, foto: string }> = vendasFiltradas.reduce((acc: any, v: any) => {
        if (!v || !v.corretor) return acc;
        if (!acc[v.corretor]) acc[v.corretor] = { nome: v.corretor, valor: 0, foto: v.foto || "" };
        const val = Number(v.valor) || 0;
        acc[v.corretor].valor += val;
        return acc;
      }, {} as Record<string, { nome: string, valor: number, foto: string }>);
      return Object.values(map).sort((a,b) => b.valor - a.valor);
    } catch (e) {
      return [];
    }
  }, [vendasFiltradas]);

  const dadosTipos = useMemo(() => {
    try {
      const map: Record<string, number> = vendasFiltradas.reduce((acc: any, v: any) => {
        if (!v || !v.unidade) return acc;
        acc[v.unidade] = (acc[v.unidade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    } catch (e) {
      return [];
    }
  }, [vendasFiltradas]);

  const dadosConstrutoras = useMemo(() => {
    try {
      const map: Record<string, number> = vendasFiltradas.reduce((acc: any, v: any) => {
        if (!v || !v.construtora) return acc;
        const val = Number(v.valor) || 0;
        acc[v.construtora] = (acc[v.construtora] || 0) + val;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    } catch (e) {
      return [];
    }
  }, [vendasFiltradas]);

  const duelo = useMemo(() => {
    if (dadosRanking.length < 2) return null;
    return { p1: dadosRanking[0], p2: dadosRanking[1], diff: dadosRanking[0].valor - dadosRanking[1].valor };
  }, [dadosRanking]);

  const relatorioComparativo = useMemo(() => {
    try {
      const fA = vendas.filter((v: any) => v.mes === mesA);
      const fB = vendas.filter((v: any) => v.mes === mesB);
      const vA = fA.reduce((acc: number, v: any) => acc + (Number(v.valor) || 0), 0);
      const vB = fB.reduce((acc: number, v: any) => acc + (Number(v.valor) || 0), 0);
      const cVGV = vA === 0 ? 100 : ((vB - vA) / vA) * 100;
      const corrB: Record<string, number> = fB.reduce((acc: any, v: any) => { 
        if(!v.corretor) return acc;
        acc[v.corretor] = (acc[v.corretor] || 0) + (Number(v.valor) || 0); 
        return acc; 
      }, {} as Record<string, number>);
      const compCorr = Object.entries(corrB).map(([nome, valorB]) => ({ 
          nome, 
          valorB: Number(valorB) || 0, 
          valorA: (fA.reduce((acc: number, v: any) => v.corretor === nome ? acc + (Number(v.valor) || 0) : acc, 0)) 
      })).sort((a,b) => b.valorB - a.valorB);
      return { vgvA: vA, vgvB: vB, crescimento: cVGV, corretores: compCorr };
    } catch (e) {
      return { vgvA: 0, vgvB: 0, crescimento: 0, corretores: [] };
    }
  }, [vendas, mesA, mesB]);

  const dadosVgvUsados = useMemo(() => {
    const mesesArr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return mesesArr.map(m => ({
      name: m,
      valor: vgvUsados[m] || 0
    }));
  }, [vgvUsados]);

  // 5. AÇÕES
  const handleLogout = () => {
    logout();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(newUsername && newPassword) {
      const exists = users.find(u => u.username.toLowerCase() === newUsername.trim().toLowerCase());
      if (exists) {
        alert('Este nome de usuário já existe!');
      } else {
        addUser(newUsername.trim(), newPassword, newUserRole);
        alert('Usuário adicionado com sucesso!');
        setNewUsername('');
        setNewPassword('');
        setNewUserRole('user');
      }
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(parseFloat(value) / 100);
    setValorFormatado(value ? "R$ " + result : "");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const deletarVenda = (id: number) => {
    if(window.confirm("Deseja realmente excluir esta venda?")) {
      setVendas(vendas.filter((v: any) => v.id !== id));
    }
  };

  const salvarCorretor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const novo = {
      id: Date.now(),
      nome: formData.get('nome') as string,
      foto: fotoBase64 || ""
    };
    setCorretores([...corretores, novo]);
    setFotoBase64('');
    setIsCorretorModalOpen(false);
  };

  const salvarNovaVenda = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const valorLimpo = valorFormatado.replace(/[R$\s.]/g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorLimpo);
    const corretorSelecionado = formData.get('corretor') as string;
    const infoCorretor = corretores.find((c: any) => c.nome === corretorSelecionado);

    const novaVenda = {
      id: editingVenda ? editingVenda.id : Date.now(),
      corretor: corretorSelecionado,
      valor: valorNumerico,
      unidade: formData.get('unidade') as string,
      empreendimento: formData.get('empreendimento') as string,
      construtora: formData.get('construtora') as string,
      data: formData.get('data') as string,
      mes: mesSelecionado,
      foto: infoCorretor?.foto || editingVenda?.foto || ""
    };

    if (editingVenda) {
      setVendas(vendas.map((v: any) => v.id === editingVenda.id ? novaVenda : v));
    } else {
      setVendas([...vendas, novaVenda]);
    }

    setValorFormatado('');
    setIsModalOpen(false);
    setEditingVenda(null);
    if (!editingVenda) celebrarVenda({ corretor: novaVenda.corretor, valor: novaVenda.valor });
    try { await supabase.from('vendas').upsert([novaVenda]); } catch (e) {}
  };

  const zerarDados = async () => {
    if (window.confirm("⚠️ ATENÇÃO: Isso apagará TODAS as vendas e CORRETORES do banco de dados e do seu navegador. Tem certeza?")) {
      setVendas([]);
      setCorretores([]);
      localStorage.removeItem('vendas_v3');
      localStorage.removeItem('corretores_v3');
      try {
        await supabase.from('vendas').delete().neq('id', 0);
        alert("Dados zerados com sucesso!");
      } catch (e) {
        alert("Erro ao zerar no banco, mas os dados foram limpos localmente.");
      }
    }
  };

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans flex flex-col relative overflow-hidden">
      
      {/* CELEBRAÇÃO */}
      {showCelebration && ultimaVenda && (
        <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl animate-in zoom-in duration-500">
           <button onClick={() => setShowCelebration(false)} className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
             <X size={48} />
           </button>
           <div className="text-center">
             <span className="text-[12rem] animate-bounce block mb-4">🍾</span>
             <p className="text-[12px] text-[#c5a059] font-black uppercase tracking-[0.4em]">Real-time Sales Intelligence</p>
             <h2 className="text-white text-8xl font-black italic tracking-tighter mb-4 shadow-xl uppercase">{ultimaVenda.corretor}</h2>
             <div className="bg-[#c5a059] text-black text-6xl font-black px-12 py-6 rounded-[2rem] inline-block shadow-[0_0_60px_rgba(197,160,89,0.5)] transform -rotate-3">
               R$ {ultimaVenda.valor.toLocaleString('pt-BR')}
             </div>
           </div>
        </div>
      )}

      {/* HEADER ESTRATÉGICO */}
      <header className="flex justify-between items-center mb-6 z-10 print:hidden">
        <div className="flex items-center">
          <img src="/logo.png" alt="InvestHouse Logo" className="w-[171px] h-auto object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => {
            setVgvUsadosTemp("R$ " + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(vgvUsados[mesSelecionado] || 0));
            setIsVgvModalOpen(true);
          }} className="bg-white/10 hover:bg-[#c5a059] hover:text-black border border-white/10 p-4 rounded-2xl transition-all flex items-center gap-2">
            <DollarSign size={18} />
            <span className="text-[10px] font-black uppercase hidden sm:block">
              VGV USADOS {mesSelecionado}: R$ {(vgvUsados[mesSelecionado] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </button>
          <Link to="/metricas" className="bg-white/10 hover:bg-[#c5a059] hover:text-black border border-white/10 p-4 rounded-2xl transition-all flex items-center gap-2">
            <BarChart3 size={18} /><span className="text-[10px] font-black uppercase hidden sm:block">MÉTRICAS</span>
          </Link>
          <button onClick={() => setIsCompareOpen(true)} className="bg-white/5 hover:bg-[#c5a059] hover:text-black border border-white/10 p-4 rounded-2xl transition-all flex items-center gap-2">
            <GitCompare size={20} /><span className="text-[10px] font-black uppercase">Comparativo</span>
          </button>
          <button onClick={() => setIsCorretorModalOpen(true)} className="bg-white/10 hover:bg-white hover:text-black border border-white/10 p-4 rounded-2xl transition-all flex items-center gap-2">
            <Plus size={18} /><span className="text-[10px] font-black uppercase">CADASTRAR CORRETOR</span>
          </button>
          {isMasterUser && (
            <button onClick={() => setIsUsersModalOpen(true)} className="bg-white/10 hover:bg-[#c5a059] hover:text-black border border-white/10 p-4 rounded-2xl transition-all flex items-center gap-2">
              <Users size={18} /><span className="text-[10px] font-black uppercase hidden sm:block">ACESSOS</span>
            </button>
          )}
          <button onClick={zerarDados} className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/30 p-4 rounded-2xl transition-all flex items-center gap-2" title="Zerar Dados">
            <Trash2 size={18} />
          </button>
          <button onClick={handleLogout} className="p-4 rounded-2xl border transition-all bg-white/5 border-white/10 hover:border-red-500 hover:text-red-500 text-gray-400 group flex items-center gap-2">
            <LogOut size={18} className="group-hover:text-red-500" />
            <span className="text-[10px] font-black uppercase hidden sm:block">Sair</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#c5a059] hover:scale-105 transition-transform text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-[#c5a059]/20">
            <Plus strokeWidth={4} /> LANÇAR VENDA
          </button>
        </div>
      </header>

      {/* NAVEGAÇÃO DOS MESES */}
      <nav className="flex bg-[#111] p-1 rounded-2xl border border-white/5 mb-8 print:hidden overflow-x-auto no-scrollbar z-10 w-full">
        {meses.map((m) => (
          <button key={m} onClick={() => setMesSelecionado(m)} className={`flex-1 py-4 text-sm font-black transition-all ${mesSelecionado === m ? 'bg-[#c5a059] text-black rounded-xl shadow-lg' : 'text-gray-500 hover:text-white'}`}>
            {m.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 grid grid-cols-12 gap-8 mb-16 relative z-10 print:hidden">
        <div className="col-span-4 bg-[#0a0a0a] rounded-[3rem] border border-white/5 p-10 flex flex-col">
           <h2 className="text-[#c5a059] font-black text-sm uppercase tracking-[0.3em] mb-10 flex items-center gap-2"><Trophy size={18}/> Elite {mesSelecionado}</h2>
           <div className="space-y-6 overflow-y-auto no-scrollbar flex-1 pb-4">
              {dadosRanking.slice(0, 5).map((c, i) => (
                <div key={i} className={`flex items-center p-5 rounded-3xl relative ${i === 0 ? 'bg-white/5 border border-[#c5a059]/30' : 'bg-[#111]'}`}>
                  <div className="relative">
                    {c.foto ? <img src={c.foto} className="w-14 h-14 rounded-full border-2 border-[#c5a059] object-cover" /> : <div className="w-14 h-14 rounded-full border-2 border-[#c5a059] bg-[#111] flex items-center justify-center text-gray-500"><User size={20}/></div>}
                    {i === 0 && <span className="absolute -top-2 -left-2 text-2xl">🥇</span>}{i === 1 && <span className="absolute -top-2 -left-2 text-2xl">🥈</span>}{i === 2 && <span className="absolute -top-2 -left-2 text-2xl">🥉</span>}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-black text-lg uppercase tracking-tight">{c.nome}</p>
                    <p className="text-[#c5a059] font-black italic text-2xl">R$ {c.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="col-span-8 bg-[#0a0a0a] rounded-[3rem] border border-white/5 p-10 relative overflow-hidden h-[500px]">
          {/* SLIDE 0: DUELO */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 flex flex-col items-center justify-center ${slideAtivo === 0 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}>
            <Swords className="text-[#c5a059] animate-spin-slow mb-10" size={48} />
            {duelo ? (
              <div className="flex items-center gap-24">
                <div className="text-center">{duelo.p1.foto ? <img src={duelo.p1.foto} className="w-64 h-64 rounded-full border-8 border-[#c5a059] object-cover shadow-[0_0_60px_rgba(197,160,89,0.3)] mb-6" /> : <div className="w-64 h-64 mx-auto rounded-full border-8 border-[#c5a059] bg-[#111] flex items-center justify-center shadow-[0_0_60px_rgba(197,160,89,0.3)] mb-6 text-[#c5a059]"><User size={80}/></div>}<h3 className="text-4xl font-black italic uppercase tracking-tighter">{duelo.p1.nome}</h3><p className="text-[#c5a059] text-2xl font-black mt-2">R$ {duelo.p1.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                <div className="bg-white text-black text-5xl font-black italic w-28 h-28 rounded-full flex items-center justify-center border-8 border-[#050505] shadow-2xl relative z-10">VS</div>
                <div className="text-center opacity-50">{duelo.p2.foto ? <img src={duelo.p2.foto} className="w-64 h-64 rounded-full border-8 border-gray-800 object-cover mb-6 grayscale" /> : <div className="w-64 h-64 mx-auto rounded-full border-8 border-gray-800 bg-[#111] flex items-center justify-center mb-6 text-gray-500"><User size={80}/></div>}<h3 className="text-4xl font-black italic uppercase tracking-tighter">{duelo.p2.nome}</h3><p className="text-gray-500 text-2xl font-black mt-2">R$ {duelo.p2.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
              </div>
            ) : <p className="text-gray-700 italic">Aguardando desafiantes...</p>}
          </div>

          {/* SLIDE 1: GRÁFICO CORRETORES */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 flex flex-col ${slideAtivo === 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}>
             <h2 className="text-4xl font-black italic mb-10 text-white/50">Performance <span className="text-white">Corretores</span></h2>
             <div className="flex-1"><ResponsiveContainer width="100%" height="100%"><BarChart data={dadosRanking}><XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 12}} /><Bar dataKey="valor" radius={[15, 15, 0, 0]}><LabelList dataKey="valor" position="top" formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} fill="#c5a059" fontWeight="900" dy={-10} />{dadosRanking.map((entry, index) => <Cell key={index} fill={index === 0 ? '#c5a059' : '#1a1a1a'} />)}</Bar></BarChart></ResponsiveContainer></div>
          </div>

          {/* SLIDE 2: MIX UNIDADES */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 flex flex-col ${slideAtivo === 2 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}>
             <h2 className="text-3xl font-black italic mb-10 text-white/50">Mix de <span className="text-white">Unidades</span></h2>
             <div className="grid grid-cols-2 h-full items-center gap-10">
                  <div className="space-y-6">{dadosTipos.map((t, i) => (<div key={i} className="flex justify-between border-b border-white/5 pb-4"><span className="text-gray-300 font-black uppercase text-base">{t.name}</span><span className="text-4xl font-black text-[#c5a059]">{t.value} un</span></div>))}</div>
                 <div className="h-full relative flex items-center justify-center"><ResponsiveContainer width="100%" height="80%"><PieChart><Pie data={dadosTipos} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={8}>{dadosTipos.map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#1a1a1a'} />)}</Pie></PieChart></ResponsiveContainer></div>
             </div>
          </div>

          {/* SLIDE 3: CONSTRUTORAS */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 flex flex-col ${slideAtivo === 3 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}>
             <h2 className="text-3xl font-black italic mb-10 text-white/50">Volume por <span className="text-white">Construtora</span></h2>
             <div className="flex-1"><ResponsiveContainer width="100%" height="100%"><BarChart data={dadosConstrutoras} layout="vertical"><XAxis type="number" hide /><YAxis dataKey="name" type="category" stroke="#444" fontSize={12} width={120} axisLine={false} tickLine={false} /><Bar dataKey="value" radius={[0, 15, 15, 0]}><LabelList dataKey="value" position="right" formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} fill="#c5a059" fontSize={14} fontWeight="900" dx={15} />{dadosConstrutoras.map((e, i) => <Cell key={i} fill={i === 0 ? '#c5a059' : '#1a1a1a'} />)}</Bar></BarChart></ResponsiveContainer></div>
          </div>

          {/* SLIDE 4: LOG VENDAS */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 flex flex-col ${slideAtivo === 4 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}>
             <h2 className="text-3xl font-black italic mb-8 text-white/50">Log de <span className="text-white">Vendas ({mesSelecionado})</span></h2>
             <div className="space-y-3 overflow-y-auto h-[320px] pr-4 custom-scroll">
               {vendasFiltradas.length > 0 ? vendasFiltradas.map((v: any) => (
                 <div key={v.id} className="flex justify-between items-center p-5 bg-[#111] hover:bg-[#151515] rounded-3xl border border-white/5 transition-all">
                   <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-[#c5a059]"></div>
                     <div><p className="font-black text-xl text-gray-200">{v.corretor} <span className="text-gray-500 font-normal ml-2">vendeu</span> {v.unidade} no {v.empreendimento}</p><p className="text-xs text-[#c5a059] uppercase font-black tracking-widest mt-1">{v.construtora}</p></div>
                   </div>
                   <div className="flex items-center gap-6">
                     <p className="font-black text-3xl text-white italic">R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                     <div className="flex gap-2">
                       <button onClick={() => { setEditingVenda(v); setValorFormatado("R$ " + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v.valor)); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:text-blue-400"><Edit3 size={24}/></button>
                       <button onClick={() => deletarVenda(v.id)} className="p-2 text-red-500 hover:text-red-400"><Trash2 size={24}/></button>
                     </div>
                   </div>
                 </div>
               )) : <p className="text-gray-800 italic text-center py-20 uppercase font-black">Sem vendas no período</p>}
             </div>
          </div>

          {/* SLIDE 5: COMPARATIVO VGV USADOS */}
          <div className={`absolute inset-0 p-10 transition-all duration-1000 flex flex-col ${slideAtivo === 5 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}>
             <h2 className="text-4xl font-black italic mb-10 text-white/50">VGV <span className="text-white">Usados (Ano)</span></h2>
             <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dadosVgvUsados}>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 12}} />
                   <Bar dataKey="valor" radius={[15, 15, 0, 0]}>
                     <LabelList dataKey="valor" position="top" formatter={(v: number) => v > 0 ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''} fill="#c5a059" fontWeight="900" dy={-10} />
                     {dadosVgvUsados.map((entry, index) => <Cell key={index} fill={entry.valor > 0 ? '#c5a059' : '#1a1a1a'} />)}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      </main>

      {/* TICKER DE RODAPÉ */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-3 overflow-hidden border-t-4 border-black/20 z-20 print:hidden flex items-center justify-between">
        <div className="whitespace-nowrap animate-marquee inline-block text-black font-black text-sm uppercase italic flex-1">
          {vendasFiltradas.length > 0 ? vendasFiltradas.map((v: any, i: number) => (
            <span key={i} className="mx-12">🔥 {v.corretor} vendeu {v.unidade} no {v.empreendimento} em {v.construtora} • R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • </span>
          )) : <span className="mx-12">AGUARDANDO LANÇAMENTOS PARA {mesSelecionado.toUpperCase()}...</span>}
        </div>
        <div className="bg-black/20 px-4 py-1 flex items-center gap-2 mr-4 rounded-full text-[10px] text-black font-black uppercase"><div className="w-2 h-2 rounded-full bg-green-900 animate-pulse"></div> Live DB</div>
      </footer>

      {/* MODAL COMPARATIVO */}
      {isCompareOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[400] flex items-center justify-center p-6 animate-in fade-in duration-300 print:relative print:bg-white print:inset-auto print:p-0 print:z-0">
           <div id="printable-report" className="bg-[#111] border border-[#c5a059]/30 w-full max-w-5xl rounded-[3rem] p-12 shadow-2xl relative print:bg-white print:border-none print:shadow-none print:p-0 print:max-w-full">
              <button onClick={() => setIsCompareOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white print:hidden"><X size={32}/></button>
              <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-8 print:border-gray-200">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="InvestHouse Logo" className="h-16 w-auto print:brightness-0" />
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white print:text-black">RELATÓRIO DE PERFORMANCE</h2>
                    <p className="text-[#c5a059] font-bold tracking-[0.3em] uppercase text-[10px] print:text-gray-500">{mesA} vs {mesB}</p>
                  </div>
                </div>
                <div className="flex gap-4 print:hidden"><button onClick={handlePrint} className="bg-white text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-[#c5a059] transition-all"><Printer size={20} /> IMPRIMIR / PDF</button></div>
              </div>
              <div className="grid grid-cols-2 gap-10 mb-10 print:hidden">
                <div className="space-y-2"><label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Mês Comparativo</label><select value={mesA} onChange={(e)=>setMesA(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none">{meses.map(m=><option key={m}>{m}</option>)}</select></div>
                <div className="space-y-2"><label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Mês Alvo</label><select value={mesB} onChange={(e)=>setMesB(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[#c5a059] font-black outline-none">{meses.map(m=><option key={m}>{m}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 print:bg-gray-100 print:border-gray-300"><p className="text-gray-500 text-[10px] font-black uppercase mb-2 print:text-gray-600">Crescimento VGV</p><div className="flex items-center gap-2"><p className={`text-4xl font-black ${relatorioComparativo.crescimento >= 0 ? 'text-green-500' : 'text-red-500'} print:text-black`}>{relatorioComparativo.crescimento.toFixed(1)}%</p>{relatorioComparativo.crescimento >= 0 ? <ArrowUpRight className="text-green-500" /> : <ArrowDownRight className="text-red-500" />}</div></div>
                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 col-span-2 print:bg-gray-100 print:border-gray-300"><p className="text-gray-500 text-[10px] font-black uppercase mb-2 print:text-gray-600">Volume Total {mesB}</p><p className="text-4xl font-black text-white print:text-black italic">R$ {relatorioComparativo.vgvB.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
              </div>
              <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5 print:bg-transparent print:border-gray-200">
                <h4 className="text-[#c5a059] font-black text-xs uppercase tracking-widest mb-8 print:text-black">Performance Detalhada por Corretor</h4>
                <div className="space-y-6 max-h-60 overflow-y-auto custom-scroll print:max-h-full print:overflow-visible">
                   {relatorioComparativo.corretores.map((c, i) => (<div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 print:border-gray-200"><div><p className="text-lg font-black text-white print:text-black">{c.nome}</p><p className="text-[10px] text-gray-500 uppercase font-bold">Volume {mesA}: R$ {c.valorA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div><div className="text-right"><p className="text-2xl font-black text-[#c5a059] print:text-black">R$ {c.valorB.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><span className={`text-[10px] font-bold ${c.valorB >= c.valorA ? 'text-green-500' : 'text-red-500'}`}>{c.valorB >= c.valorA ? '↑ EVOLUÇÃO' : '↓ RETRAÇÃO'}</span></div></div>))}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL LANÇAMENTO E HISTÓRICO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[500] flex items-center justify-center p-6 print:hidden">
          <div className="bg-[#111] border border-white/5 w-full max-w-5xl rounded-[3.5rem] p-12 relative shadow-2xl flex gap-12 max-h-[90vh]">
            <button onClick={() => { setIsModalOpen(false); setEditingVenda(null); setValorFormatado(''); }} className="absolute top-10 right-10 text-gray-500 hover:text-white z-10"><X size={32}/></button>
            
            {/* LADO ESQUERDO: FORMULÁRIO */}
            <div className="flex-1 overflow-y-auto no-scrollbar pr-4">
              <h2 className="text-4xl font-black italic mb-8 flex items-center gap-3">{editingVenda ? 'Editar' : 'Lançar'} <span className="text-[#c5a059]">Venda</span></h2>
              <form onSubmit={salvarNovaVenda} className="space-y-6">
                {corretores.length > 0 ? (
                  <select name="corretor" required defaultValue={editingVenda?.corretor || ''} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059] font-bold">
                    <option value="">Selecione o Corretor</option>
                    {corretores.map((c: any) => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                  </select>
                ) : <input name="corretor" required defaultValue={editingVenda?.corretor || ''} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059]" placeholder="Nome do Corretor" />}
                <div className="grid grid-cols-2 gap-4">
                  <select name="unidade" defaultValue={editingVenda?.unidade || 'Apartamento'} className="bg-black border border-white/10 rounded-2xl p-5 outline-none font-bold"><option>Apartamento</option><option>Casa</option><option>Lote</option></select>
                  <input name="valor" value={valorFormatado} onChange={handleValorChange} required className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059] font-bold" placeholder="Valor R$ 0,00" />
                </div>
                <input name="data" type="date" required defaultValue={editingVenda?.data || new Date().toISOString().split('T')[0]} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059] font-bold uppercase" />
                <input name="empreendimento" required defaultValue={editingVenda?.empreendimento || ''} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059]" placeholder="Nome do Empreendimento" />
                <input name="construtora" required defaultValue={editingVenda?.construtora || ''} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059]" placeholder="Construtora" />
                <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-5 rounded-2xl text-xl shadow-2xl hover:bg-white transition-colors uppercase tracking-widest">{editingVenda ? 'SALVAR ALTERAÇÕES' : 'SALVAR E CELEBRAR'}</button>
                {editingVenda && (
                  <button type="button" onClick={() => { setEditingVenda(null); setValorFormatado(""); }} className="w-full text-center text-xs text-gray-500 font-bold hover:text-white uppercase tracking-widest pt-2">CANCELAR EDIÇÃO</button>
                )}
              </form>
            </div>

            {/* LADO DIREITO: HISTÓRICO RECENTE */}
            <div className="flex-1 border-l border-white/5 pl-12 flex flex-col pt-2">
              <h2 className="text-2xl font-black italic mb-6 text-white/50">Histórico de <span className="text-white">Lançamentos</span></h2>
              <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-4 custom-scroll">
                {vendas.length > 0 ? [...vendas].reverse().map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center p-4 bg-black/50 hover:bg-[#151515] rounded-2xl border border-white/5 transition-all">
                    <div>
                      <p className="font-black text-sm text-gray-200">{v.corretor}</p>
                      <p className="text-[10px] text-[#c5a059] uppercase font-black tracking-widest">{v.empreendimento} • R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                       <button onClick={() => { setEditingVenda(v); setValorFormatado("R$ " + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v.valor)); }} className="p-2 text-blue-500 hover:text-blue-400 bg-blue-500/10 rounded-lg transition-colors"><Edit3 size={16}/></button>
                       <button onClick={() => deletarVenda(v.id)} className="p-2 text-red-500 hover:text-red-400 bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                )) : <p className="text-gray-800 italic text-sm uppercase font-black text-center mt-10">Nenhuma venda na base</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR CORRETOR */}
      {isCorretorModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[500] flex items-center justify-center p-6 print:hidden">
          <div className="bg-[#111] border border-white/5 w-full max-w-lg rounded-[3.5rem] p-12 relative shadow-2xl">
            <button onClick={() => setIsCorretorModalOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32}/></button>
            <h2 className="text-4xl font-black italic mb-8 flex items-center gap-3">Novo <span className="text-[#c5a059]">Corretor</span></h2>
            <form onSubmit={salvarCorretor} className="space-y-6">
              <input name="nome" required className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059]" placeholder="Nome do Corretor" />
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Foto do Corretor</label>
                <div className="flex items-center gap-4 bg-black border border-white/10 rounded-2xl p-4">
                  {fotoBase64 ? <img src={fotoBase64} className="w-16 h-16 rounded-full object-cover border-2 border-[#c5a059]" /> : <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 font-bold">?</div>}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs file:bg-[#c5a059] file:text-black file:border-none file:px-4 file:py-2 file:rounded-xl file:font-black file:cursor-pointer hover:file:bg-white transition-all"/>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-6 rounded-2xl text-2xl shadow-2xl hover:bg-white transition-colors uppercase tracking-widest">CADASTRAR</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GERENCIAR ACESSOS */}
      {isUsersModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[500] flex items-center justify-center p-6 print:hidden">
          <div className="bg-[#111] border border-white/5 w-full max-w-lg rounded-[3.5rem] p-12 relative shadow-2xl">
            <button onClick={() => setIsUsersModalOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32}/></button>
            <h2 className="text-3xl font-black italic mb-2">Gerenciar <span className="text-[#c5a059]">Acessos</span></h2>
            <p className="text-gray-500 text-sm mb-8 font-bold">Crie logins exclusivos para seus colaboradores.</p>
            
            <div className="space-y-4 mb-8 max-h-48 overflow-y-auto custom-scroll pr-2">
              {users.map((u, i) => (
                <div key={i} className="flex justify-between items-center bg-black/50 border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059]"><Users size={18}/></div>
                    <div>
                      <p className="font-black text-white flex items-center gap-2">
                        {u.username}
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full ${u.role === 'master' ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'bg-gray-500/20 text-gray-400'}`}>
                          {u.role === 'master' ? 'Master' : 'User'}
                        </span>
                      </p>
                      {u.username === currentUser && <span className="text-[10px] text-green-500 uppercase font-black tracking-widest">Você</span>}
                    </div>
                  </div>
                  {u.username !== currentUser && (
                    <button onClick={() => removeUser(u.username)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={18}/></button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 border-t border-white/10 pt-8 mt-4">
              <h3 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Novo Acesso</h3>
              <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059]" placeholder="Nome de usuário" />
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required type="password" className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059]" placeholder="Senha de acesso" />
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-bold ml-2">Nível de Acesso (Cargo)</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as 'master' | 'user')} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059] font-bold text-gray-200">
                  <option value="user">Usuário Padrão</option>
                  <option value="master">Administrador (Master)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-4 rounded-2xl text-xl shadow-2xl hover:bg-white transition-colors uppercase tracking-widest mt-2">ADICIONAR ACESSO</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VGV USADOS */}
      {isVgvModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[500] flex items-center justify-center p-6 print:hidden">
          <div className="bg-[#111] border border-white/5 w-full max-w-lg rounded-[3.5rem] p-12 relative shadow-2xl">
            <button onClick={() => setIsVgvModalOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32}/></button>
            <h2 className="text-4xl font-black italic mb-2 flex items-center gap-3">VGV <span className="text-[#c5a059]">Usados</span></h2>
            <p className="text-gray-500 text-sm mb-8 font-bold">Atualize o VGV de Usados para {mesSelecionado}.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const valorLimpo = vgvUsadosTemp.replace(/[R$\s.]/g, '').replace(',', '.');
              const valorNumerico = parseFloat(valorLimpo);
              setVgvUsados({
                ...vgvUsados,
                [mesSelecionado]: isNaN(valorNumerico) ? 0 : valorNumerico
              });
              setIsVgvModalOpen(false);
            }} className="space-y-6">
              <input 
                value={vgvUsadosTemp} 
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  const options = { minimumFractionDigits: 2 };
                  const result = new Intl.NumberFormat('pt-BR', options).format(parseFloat(value) / 100);
                  setVgvUsadosTemp(value ? "R$ " + result : "");
                }} 
                required 
                className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-[#c5a059] font-bold text-2xl" 
                placeholder="R$ 0,00" 
              />
              <button type="submit" className="w-full bg-[#c5a059] text-black font-black py-6 rounded-2xl text-2xl shadow-2xl hover:bg-white transition-colors uppercase tracking-widest">SALVAR VGV</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        @media print { body * { visibility: hidden; background: white !important; } #printable-report, #printable-report * { visibility: visible; } #printable-report { position: absolute; left: 0; top: 0; width: 100%; color: black !important; } }
      `}</style>
    </div>
  );
};

export default InvestechElite_DirectorEdition;
