import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, TrendingUp, Building2, DollarSign, Target, PlusCircle, Save, LayoutDashboard, Zap, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const InvestechV2 = () => {
  // ESTADO DE DADOS
  const [vendas, setVendas] = useState([
    { id: 1, corretor: 'Ana Silva', unidade: 'Apartamento', construtora: 'Moura Dubeux', valor: 1200000, data: '2026-03-01' },
    { id: 2, corretor: 'Bruno Costa', unidade: 'Lote', construtora: 'Damha', valor: 450000, data: '2026-03-02' },
    { id: 3, corretor: 'Carla Souza', unidade: 'Casa', construtora: 'Alphabet', valor: 890000, data: '2026-03-05' },
    { id: 4, corretor: 'Daniel Oliveira', unidade: 'Apartamento', construtora: 'Celi', valor: 2100000, data: '2026-03-08' },
    { id: 5, corretor: 'Elena Rios', unidade: 'Lote', construtora: 'Alphaville', valor: 320000, data: '2026-03-09' },
  ]);

  const [abaAtiva, setAbaAtiva] = useState(0); // Para alternar as visões da TV

  // Efeito para alternar a visão da TV automaticamente (Dinamismo)
  useEffect(() => {
    const interval = setInterval(() => {
      setAbaAtiva((prev) => (prev === 0 ? 1 : 0));
    }, 10000); // Muda a cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  // CÁLCULOS
  const vgvTotal = useMemo(() => vendas.reduce((acc, v) => acc + Number(v.valor), 0), [vendas]);
  
  const top5Corretores = useMemo(() => {
    const counts: Record<string, number> = vendas.reduce((acc, v) => {
      acc[v.corretor] = (acc[v.corretor] || 0) + Number(v.valor);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts)
      .map(([nome, vgv]) => ({ nome, vgv }))
      .sort((a, b) => b.vgv - a.vgv)
      .slice(0, 5);
  }, [vendas]);

  const dadosPorTipo = useMemo(() => {
    const tipos: Record<string, number> = vendas.reduce((acc, v) => {
      acc[v.unidade] = (acc[v.unidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(tipos).map(([name, value]) => ({ name, value }));
  }, [vendas]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 overflow-hidden font-sans">
      
      {/* HEADER FIXO */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#c5a059] flex items-center gap-3">
            <Zap className="fill-[#c5a059]" /> INVESTECH
          </h1>
          <div className="flex gap-4 mt-1">
            <span className="text-xs text-gray-500 font-bold border-l-2 border-[#c5a059] pl-2 uppercase tracking-tighter">Performance Hub Aracaju</span>
            <span className="text-xs text-[#c5a059] animate-pulse">● LIVE UPDATE</span>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-gray-500 text-[10px] font-bold uppercase">VGV TOTAL MARÇO</p>
            <p className="text-3xl font-black text-white">R$ {(vgvTotal/1000000).toFixed(1)}M</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LADO ESQUERDO: RANKING TOP 5 (FIXO PARA MOTIVAÇÃO) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h3 className="text-[#c5a059] font-bold text-sm flex items-center gap-2 mb-4 tracking-widest uppercase">
            <Trophy size={18} /> Elite de Vendas
          </h3>
          {top5Corretores.map((corretor, index) => (
            <div key={index} className={`relative overflow-hidden p-4 rounded-xl border ${index === 0 ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent border-[#c5a059]' : 'bg-[#1a1a1a] border-gray-800'} transition-all duration-500`}>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-black ${index === 0 ? 'text-[#c5a059]' : 'text-gray-600'}`}>
                    {index + 1}º
                  </span>
                  <div>
                    <p className="font-bold text-lg">{corretor.nome}</p>
                    <p className="text-xs text-gray-500">VGV: R$ {corretor.vgv.toLocaleString()}</p>
                  </div>
                </div>
                {index < 3 && <Award className={index === 0 ? 'text-[#c5a059]' : 'text-gray-600'} />}
              </div>
            </div>
          ))}
        </div>

        {/* LADO DIREITO: ÁREA DINÂMICA (MODAL QUE TROCA SOZINHO) */}
        <div className="col-span-12 lg:col-span-8 relative min-h-[500px]">
          
          {/* VISÃO 1: GRÁFICO DE VGV POR CORRETOR */}
          <div className={`absolute inset-0 transition-all duration-1000 transform ${abaAtiva === 0 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 h-full">
              <h2 className="text-2xl font-bold mb-8 text-gray-200">Volume de Negócios <span className="text-[#c5a059]">/ Mensal</span></h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5Corretores}>
                    <XAxis dataKey="nome" stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '10px'}} />
                    <Bar dataKey="vgv" radius={[10, 10, 0, 0]}>
                      {top5Corretores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#c5a059' : '#333'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* VISÃO 2: MIX DE PRODUTOS & META */}
          <div className={`absolute inset-0 transition-all duration-1000 transform ${abaAtiva === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-200">Mix de Vendas <span className="text-[#c5a059]">/ Unidades</span></h2>
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    {dadosPorTipo.map((item, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-gray-400 font-medium">{item.name}</span>
                        <span className="text-[#c5a059] font-black text-xl">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-48 bg-[#0f0f0f] rounded-full flex items-center justify-center border-8 border-[#1a1a1a] outline outline-1 outline-[#c5a059]/20">
                     <div className="text-center">
                       <p className="text-gray-500 text-[10px] uppercase font-black">Meta Batida</p>
                       <p className="text-4xl font-black text-[#c5a059]">{((vgvTotal/5000000)*100).toFixed(0)}%</p>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#c5a059] p-6 rounded-2xl flex justify-between items-center">
                <div className="text-black">
                  <p className="font-black text-lg">PROJEÇÃO DE FINAL DE MÊS</p>
                  <p className="font-medium opacity-80 italic text-sm">Baseado na performance atual de Sergipe</p>
                </div>
                <p className="text-black text-3xl font-black italic">R$ 8.2M</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TICKER DE RODAPÉ (MOVIMENTO CONTÍNUO) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#c5a059] py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block text-black font-black text-sm uppercase tracking-tighter">
          {[...vendas, ...vendas].map((v, i) => (
            <span key={i} className="mx-8">
              🚀 {v.corretor} vendeu {v.unidade} em {v.construtora} • Valor: R$ {v.valor.toLocaleString()} • 
            </span>
          ))}
        </div>
      </div>

      {/* CSS PARA O TICKER */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default InvestechV2;
