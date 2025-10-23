import { useState } from "react";
import ADMNavBar from "../ADMNavBar";
import { FaStore, FaSearch, FaEllipsisV } from "react-icons/fa";
import { MdAttachMoney, MdOutlineStorefront } from "react-icons/md";
import { FaScissors } from "react-icons/fa6";

export default function PainelAdm() {
  return <><Dashboard /></>;
}

function Dashboard() {
  const [termoBusca, setTermoBusca] = useState("");

  // Mock de dados
  const resumoGeral = { totalServicos: 1847, totalParceiros: 124, lucroTotal: 389650.75 };
  const todosComercios = [
    { id: 1, nome: "Barbearia Estilo", servicosVendidos: 352, lucroTotal: 42480.00, servicoMaisVendido: "Corte Degradê", qtdServicoMaisVendido: 124 },
    { id: 2, nome: "Salão Beauty Gold", servicosVendidos: 278, lucroTotal: 36790.50, servicoMaisVendido: "Corte + Escova", qtdServicoMaisVendido: 98 },
    { id: 3, nome: "Salão Glamour", servicosVendidos: 412, lucroTotal: 51350.25, servicoMaisVendido: "Coloração Completa", qtdServicoMaisVendido: 87 },
    { id: 4, nome: "Barbearia Clássica", servicosVendidos: 305, lucroTotal: 32180.00, servicoMaisVendido: "Corte + Barba", qtdServicoMaisVendido: 145 },
    { id: 5, nome: "Studio Hair Design", servicosVendidos: 289, lucroTotal: 38750.00, servicoMaisVendido: "Mechas", qtdServicoMaisVendido: 67 },
  ];

  const comerciosFiltrados = todosComercios.filter(
    comercio =>
      termoBusca === "" ||
      comercio.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      comercio.id.toString().includes(termoBusca)
  );

  function formatarDinheiro(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <section className="w-full min-h-screen bg-gray-50">
      {/* Barra superior */}
      <div className="bg-white border-b p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Visualizar comercios</h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            value={termoBusca}
            onChange={e => setTermoBusca(e.target.value)}
            placeholder="Buscar por ID ou nome..."
            className="w-full sm:w-64 py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-indigo-500">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><FaScissors size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total de Serviços Finalizados</p>
            <p className="text-2xl font-bold text-gray-800">{resumoGeral.totalServicos}</p>
            <p className="text-xs text-green-600 font-medium mt-1">↑ 8.2% desde o último mês</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-purple-500">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><FaStore size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total de Parceiros</p>
            <p className="text-2xl font-bold text-gray-800">{resumoGeral.totalParceiros}</p>
            <p className="text-xs text-green-600 font-medium mt-1">↑ 3.5% desde o último mês</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-green-500">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><MdAttachMoney size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Lucro Total</p>
            <p className="text-2xl font-bold text-gray-800">{formatarDinheiro(resumoGeral.lucroTotal)}</p>
            <p className="text-xs text-green-600 font-medium mt-1">↑ 12.7% desde o último mês</p>
          </div>
        </div>
      </div>

      {/* Tabela/Card de comércios */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Desempenho dos Comércios</h2>
              <p className="text-sm text-gray-500">Listagem de todos os parceiros e seus resultados</p>
            </div>
            <div className="text-sm text-gray-500">{comerciosFiltrados.length} de {todosComercios.length} comércios</div>
          </div>
          {/* Tabela Desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-5 border-b bg-gray-50 py-3 px-6 text-sm font-medium text-gray-500">
              <div className="col-span-2">Comércio</div>
              <div className="text-center">Serviços</div>
              <div className="text-center">Serviço mais vendido</div>
              <div className="text-center">Lucro</div>
            </div>
            {comerciosFiltrados.length > 0 ? (
              comerciosFiltrados.map(comercio => (
                <div key={comercio.id} className="grid grid-cols-5 border-b py-4 px-6 hover:bg-gray-50 transition">
                  <div className="col-span-2 flex items-center">
                    <div className="p-2 mr-3 bg-indigo-100 text-indigo-600 rounded-md"><MdOutlineStorefront size={20} /></div>
                    <div>
                      <p className="font-medium text-gray-800">{comercio.nome}</p>
                      <p className="text-xs text-gray-500">ID: #{comercio.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="font-medium">{comercio.servicosVendidos}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-medium text-sm">{comercio.servicoMaisVendido}</span>
                    <span className="text-xs text-gray-500">{comercio.qtdServicoMaisVendido} vendas</span>
                  </div>
                  <div className="flex items-center justify-center font-medium">
                    {formatarDinheiro(comercio.lucroTotal)}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                Nenhum comércio encontrado para "{termoBusca}"
              </div>
            )}
          </div>
          {/* Card Mobile */}
          <div className="md:hidden">
            {comerciosFiltrados.length > 0 ? (
              comerciosFiltrados.map(comercio => (
                <div key={comercio.id} className="border-b p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 mr-3 bg-indigo-100 text-indigo-600 rounded-md"><MdOutlineStorefront size={20} /></div>
                      <div>
                        <p className="font-medium text-gray-800">{comercio.nome}</p>
                        <p className="text-xs text-gray-500">ID: #{comercio.id}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 rounded-full hover:bg-gray-100">
                      <FaEllipsisV size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 mb-1">Serviços</p>
                      <p className="font-bold">{comercio.servicosVendidos}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 mb-1">Mais vendido</p>
                      <p className="font-bold truncate">{comercio.servicoMaisVendido}</p>
                      <p className="text-xs text-gray-500">{comercio.qtdServicoMaisVendido}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 mb-1">Lucro</p>
                      <p className="font-bold">{formatarDinheiro(comercio.lucroTotal)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                Nenhum comércio encontrado para "{termoBusca}"
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}