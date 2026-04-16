import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Users, ClipboardCheck, CalendarCheck, Send, FileSearch,
  Download, TrendingUp, ChevronDown
} from 'lucide-react';

export default function MetricasMensais() {
  const [selectedMonth, setSelectedMonth] = useState('Abril');
  
  const [data] = useState({
    leads: 150,
    preCadastro: 85,
    visitas: 42,
    propostas: 12,
    documentacao: 5,
    concluidos: 3
  });

  const metrics = useMemo(() => {
    const calculateRate = (value: number) => ((value / data.leads) * 100).toFixed(1);
    
    return [
      { id: 'leads', label: 'Leads Recebidos', value: data.leads, rate: '100.0', icon: Users, colorClass: 'text-secondary-foreground' },
      { id: 'pre', label: 'Pré-Cadastros', value: data.preCadastro, rate: calculateRate(data.preCadastro), icon: ClipboardCheck, colorClass: 'text-blue-400' },
      { id: 'visitas', label: 'Visitas Marcadas', value: data.visitas, rate: calculateRate(data.visitas), icon: CalendarCheck, colorClass: 'text-primary' },
      { id: 'propostas', label: 'Propostas Enviadas', value: data.propostas, rate: calculateRate(data.propostas), icon: Send, colorClass: 'text-success' },
      { id: 'doc', label: 'Aguard. Documentação', value: data.documentacao, rate: calculateRate(data.documentacao), icon: FileSearch, colorClass: 'text-purple-400' },
    ];
  }, [data]);

  return (
    <div className="p-6 bg-background border border-border rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <BarChart3 className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Métricas de Performance</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Análise de Funil por Período</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-card border border-border text-foreground text-xs font-bold py-2.5 px-10 rounded-full focus:border-primary outline-none cursor-pointer transition-all"
            >
              <option>Janeiro</option>
              <option>Fevereiro</option>
              <option>Março</option>
              <option>Abril</option>
              <option>Maio</option>
              <option>Junho</option>
              <option>Julho</option>
              <option>Agosto</option>
              <option>Setembro</option>
              <option>Outubro</option>
              <option>Novembro</option>
              <option>Dezembro</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={14} />
          </div>
          
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground font-black text-[10px] px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
            <Download size={14} /> GERAR RELATÓRIO PDF
          </button>
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((item) => (
          <div key={item.id} className="bg-card/50 border border-border p-5 rounded-2xl hover:border-primary/40 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <item.icon className={`${item.colorClass} group-hover:scale-110 transition-transform`} size={20} />
              <div className="text-right">
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.rate}%
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">{item.label}</p>
            <h3 className="text-2xl font-black text-foreground">{item.value}</h3>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
              <div 
                className="h-full bg-primary opacity-30" 
                style={{ width: `${item.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* RELATÓRIO ESTRATÉGICO */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-primary" size={18} />
            <h4 className="text-sm font-bold text-foreground uppercase tracking-widest">Diagnóstico de Conversão</h4>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              No mês de <span className="text-foreground font-bold">{selectedMonth}</span>, a maior perda de leads ocorre entre 
              a etapa de <span className="text-primary font-bold">Pré-Cadastro</span> e <span className="text-primary font-bold">Visita</span>. 
              Sugerimos reforçar o follow-up humano nos primeiros 15 minutos após o recebimento do lead.
            </p>
            <div className="flex gap-4">
              <div className="text-center p-3 bg-background rounded-xl border border-border flex-1">
                <p className="text-[10px] text-muted-foreground uppercase">Eficiência Geral</p>
                <p className="text-lg font-black text-foreground">{(data.propostas / data.leads * 100).toFixed(1)}%</p>
              </div>
              <div className="text-center p-3 bg-background rounded-xl border border-border flex-1">
                <p className="text-[10px] text-muted-foreground uppercase">Ticket Médio Estimado</p>
                <p className="text-lg font-black text-foreground">R$ 450k</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-center">
          <h4 className="text-xs font-bold text-muted-foreground uppercase mb-4">Ação Requerida (Master)</h4>
          <div className="space-y-3">
            <button className="w-full flex justify-between items-center bg-background hover:bg-muted p-3 rounded-xl border border-border transition-colors group">
              <span className="text-xs text-secondary-foreground">Auditar leads parados em Pré-Cadastro</span>
              <ChevronDown className="-rotate-90 text-primary group-hover:translate-x-1 transition-transform" size={14} />
            </button>
            <button className="w-full flex justify-between items-center bg-background hover:bg-muted p-3 rounded-xl border border-border transition-colors group">
              <span className="text-xs text-secondary-foreground">Exportar relação para WhatsApp Marketing</span>
              <ChevronDown className="-rotate-90 text-primary group-hover:translate-x-1 transition-transform" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
