import { useState } from 'react';
import { Save, PlusCircle } from 'lucide-react';

export interface Venda {
  corretor: string;
  unidade: string;
  empreendimento: string;
  construtora: string;
  valor: string;
  data: string;
}

interface CadastroVendaProps {
  onAdicionarVenda?: (venda: Venda) => void;
}

const CadastroVenda = ({ onAdicionarVenda }: CadastroVendaProps) => {
  const [venda, setVenda] = useState<Venda>({
    corretor: '',
    unidade: 'Apartamento',
    empreendimento: '',
    construtora: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdicionarVenda?.(venda);
    alert("Venda registrada com sucesso! O Dashboard será atualizado.");
    setVenda({ corretor: '', unidade: 'Apartamento', empreendimento: '', construtora: '', valor: '', data: venda.data });
  };

  return (
    <div className="bg-card border border-primary/30 p-8 rounded-xl mt-10 max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-primary text-2xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle /> NOVO LANÇAMENTO DE VENDA
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-secondary-foreground text-sm">Corretor</label>
          <input
            className="bg-background border border-muted rounded p-2 text-foreground focus:border-primary outline-none"
            type="text"
            placeholder="Nome do Corretor"
            value={venda.corretor}
            onChange={(e) => setVenda({ ...venda, corretor: e.target.value })}
            required
            maxLength={100}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-secondary-foreground text-sm">Tipo de Unidade</label>
          <select
            className="bg-background border border-muted rounded p-2 text-foreground focus:border-primary outline-none"
            value={venda.unidade}
            onChange={(e) => setVenda({ ...venda, unidade: e.target.value })}
          >
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Lote</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-secondary-foreground text-sm">Empreendimento</label>
          <input
            className="bg-background border border-muted rounded p-2 text-foreground focus:border-primary outline-none"
            type="text"
            placeholder="Nome do Empreendimento"
            value={venda.empreendimento}
            onChange={(e) => setVenda({ ...venda, empreendimento: e.target.value })}
            maxLength={100}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-secondary-foreground text-sm">Construtora</label>
          <input
            className="bg-background border border-muted rounded p-2 text-foreground focus:border-primary outline-none"
            type="text"
            placeholder="Ex: Moura Dubeux"
            value={venda.construtora}
            onChange={(e) => setVenda({ ...venda, construtora: e.target.value })}
            maxLength={100}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-secondary-foreground text-sm">Valor da Venda (R$)</label>
          <input
            className="bg-background border border-muted rounded p-2 text-foreground focus:border-primary outline-none"
            type="number"
            placeholder="0.00"
            value={venda.valor}
            onChange={(e) => setVenda({ ...venda, valor: e.target.value })}
            required
            min={0}
          />
        </div>
        <button
          type="submit"
          className="md:col-span-2 bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Save size={20} /> FINALIZAR E ATUALIZAR PAINEL
        </button>
      </form>
    </div>
  );
};

export default CadastroVenda;
