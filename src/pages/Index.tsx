import { useState, useMemo } from 'react';
import { Trophy, TrendingUp, Building2, DollarSign, Target, PlusCircle, Save, LayoutDashboard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VendaItem {
  id: number;
  corretor: string;
  unidade: string;
  construtora: string;
  valor: number;
  data: string;
}

const InvestechApp = () => {
  const [vendas, setVendas] = useState<VendaItem[]>([
    { id: 1, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, data: '2026-03-01' },
    { id: 2, corretor: 'Bruno Costa', unidade: 'Lote', construtora: 'Damha', valor: 450000, data: '2026-03-02' },
  ]);

  const [novaVenda, setNovaVenda] = useState({
    corretor: '', unidade: 'Apartamento', construtora: '', valor: '', data: new Date().toISOString().split('T')[0]
  });

  const vgvTotal = useMemo(() => vendas.reduce((acc, v) => acc + Number(v.valor), 0), [vendas]);

  const rankingCorretores = useMemo(() => {
    const counts: Record<string, number> = {};
    vendas.forEach((v) => {
      counts[v.corretor] = (counts[v.corretor] || 0) + Number(v.valor);
    });
    return Object.entries(counts)
      .map(([nome, vgv]) => ({ nome, vgv }))
      .sort((a, b) => b.vgv - a.vgv)
      .slice(0, 3);
  }, [vendas]);

  const adicionarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaVenda.corretor || !novaVenda.valor) return;

    const vendaComId: VendaItem = {
      ...novaVenda,
      id: Date.now(),
      valor: parseFloat(novaVenda.valor),
    };
    setVendas([vendaComId, ...vendas]);
    setNovaVenda({ corretor: '', unidade: 'Apartamento', construtora: '', valor: '', data: novaVenda.data });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-primary/20 pb-6 gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-primary flex items-center gap-3">
            <LayoutDashboard size={40} /> INVESTECH
          </h1>
          <p className="text-muted-foreground font-medium ml-1">IMOBILIÁRIA DIGITAL • PERFORMANCE EM TEMPO REAL</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-primary/10 text-right">
          <p className="text-primary font-bold text-2xl">R$ {vgvTotal.toLocaleString('pt-BR')}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">VGV Geral Acumulado</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-primary/30 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-primary text-xl font-bold mb-6 flex items-center gap-2">
              <PlusCircle size={20} /> LANÇAR VENDA
            </h2>
            <form onSubmit={adicionarVenda} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-muted-foreground px-1">Corretor</label>
                <input
                  className="w-full bg-background border border-muted rounded-lg p-3 text-foreground focus:border-primary transition-all outline-none"
                  placeholder="Nome do Corretor"
                  value={novaVenda.corretor}
                  onChange={(e) => setNovaVenda({ ...novaVenda, corretor: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-muted-foreground px-1">Tipo</label>
                  <select
                    className="w-full bg-background border border-muted rounded-lg p-3 text-foreground focus:border-primary outline-none"
                    value={novaVenda.unidade}
                    onChange={(e) => setNovaVenda({ ...novaVenda, unidade: e.target.value })}
                  >
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Lote</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground px-1">Valor (R$)</label>
                  <input
                    className="w-full bg-background border border-muted rounded-lg p-3 text-foreground focus:border-primary outline-none"
                    type="number"
                    placeholder="Ex: 500000"
                    value={novaVenda.valor}
                    onChange={(e) => setNovaVenda({ ...novaVenda, valor: e.target.value })}
                    min={0}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground px-1">Construtora</label>
                <input
                  className="w-full bg-background border border-muted rounded-lg p-3 text-foreground focus:border-primary outline-none"
                  placeholder="Ex: Moura Dubeux"
                  value={novaVenda.construtora}
                  onChange={(e) => setNovaVenda({ ...novaVenda, construtora: e.target.value })}
                  maxLength={100}
                />
              </div>
              <button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_hsl(var(--primary)/0.2)] mt-4">
                <Save size={20} /> REGISTRAR VENDA
              </button>
            </form>
          </div>

          {/* MINI RANKING */}
          <div className="bg-card p-6 rounded-2xl border border-muted">
            <h3 className="text-primary font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Trophy size={16} /> Top Performance
            </h3>
            {rankingCorretores.map((c, i) => (
              <div key={i} className="flex justify-between items-center mb-3 p-2 bg-background rounded-lg">
                <span className="text-secondary-foreground text-sm font-medium">{i + 1}º {c.nome}</span>
                <span className="text-primary font-bold">R$ {c.vgv.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: DASHBOARD */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-muted flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase">Último Lançamento</p>
                <h4 className="text-xl font-bold">{vendas[0]?.unidade || '---'}</h4>
                <p className="text-primary text-sm italic">{vendas[0]?.corretor}</p>
              </div>
              <Building2 size={40} className="text-primary opacity-20" />
            </div>

            <div className="bg-card p-6 rounded-2xl border border-muted">
              <div className="flex justify-between mb-2">
                <p className="text-muted-foreground text-xs font-bold uppercase">Meta Mensal</p>
                <p className="text-primary text-xs font-bold">R$ 5.0M</p>
              </div>
              <div className="w-full bg-background h-3 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full shadow-[0_0_15px_hsl(var(--primary)/0.6)]"
                  style={{ width: `${Math.min((vgvTotal / 5000000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* GRÁFICO */}
          <div className="bg-card p-6 rounded-2xl border border-muted h-[400px]">
            <h3 className="text-secondary-foreground font-bold mb-6 uppercase text-xs tracking-widest">Histórico de Volume de Vendas</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={vendas.slice(0, 8).reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 13%)" vertical={false} />
                <XAxis dataKey="corretor" stroke="hsl(0 0% 27%)" fontSize={10} />
                <YAxis stroke="hsl(0 0% 27%)" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(0 0% 15%)', border: '1px solid hsl(40 48% 56%)', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(40 48% 56%)' }}
                />
                <Bar dataKey="valor" fill="hsl(40 48% 56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestechApp;
