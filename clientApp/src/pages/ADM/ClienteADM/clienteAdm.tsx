import ADMNavBar from "../ADMNavBar";
import { useState } from "react";
import { FiUser, FiSearch, FiMapPin, FiPhone } from "react-icons/fi";
type ClienteType = { id: number, nome: string, email: string, tel: string, endereco: string }
const CLIENTES_MOCK: ClienteType[] = [
  { id: 1, nome: "João Silva", email: "joao.silva@email.com", tel: "(11) 98765-4321", endereco: "Av. Central, 123 - SP" },
  { id: 2, nome: "Maria Oliveira", email: "maria.oliveira@email.com", tel: "(21) 97531-6732", endereco: "Rua das Flores, 55 - RJ" },
  { id: 3, nome: "Paulo Fernandes", email: "paulo.fernandes@email.com", tel: "(31) 91234-5678", endereco: "Alameda dos Ipês, 82 - BH" },
];
function normaliza(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
export default function ClienteAdm() {
  const [clientes, setClientes] = useState(CLIENTES_MOCK);
  const [edita, setEdita] = useState<ClienteType | null>(null);
  const [modalPopup, setModalPopup] = useState<false|string>(false);
  const [pesquisa, setPesquisa] = useState("");
  const clientesFiltrados = clientes.filter(c =>
    normaliza(c.nome).includes(normaliza(pesquisa))
    || normaliza(c.email).includes(normaliza(pesquisa))
    || c.tel.replace(/\D/g,"").includes(pesquisa.replace(/\D/g,""))
  );
  function handleSalvar() {
    setClientes(list => list.map(c =>
      edita && c.id === edita.id ? edita : c
    ));
    setModalPopup("Dados alterados com sucesso!");
    setEdita(null);
  }
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Lista de Clientes</h2>
      <div className="mb-4 flex items-center gap-2 max-w-lg">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail ou celular..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-300 outline-none text-base shadow-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {clientesFiltrados.map(c => (
          <li
            key={c.id}
            className="flex items-center gap-4 px-3 py-3 bg-white rounded-lg shadow hover:bg-purple-50 transition cursor-pointer"
            tabIndex={0}
            onClick={() => setEdita({ ...c })}
          >
            <span className="avatar bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
              {c.nome.split(" ").map(p => p[0]).join("").toUpperCase()}
            </span>
            <div>
              <div className="font-bold">{c.nome}</div>
              <div className="text-gray-500 text-sm">{c.email}</div>
              <div className="text-gray-400 text-xs">{c.tel}</div>
            </div>
          </li>
        ))}
      </ul>
      {/* MODAL editar cliente */}
      {edita && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" tabIndex={-1}>
          <form
            className="bg-white max-w-sm w-full rounded-2xl shadow-2xl px-8 py-8 flex flex-col gap-5 animate-fadeIn"
            onSubmit={e => { e.preventDefault(); handleSalvar(); }}
            autoComplete="off"
          >
            <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">Editar Cliente</h2>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="nomeCliente"><FiUser className="inline mr-1" /> Nome</label>
              <input
                id="nomeCliente"
                value={edita.nome}
                onChange={e => setEdita(v => (v ? { ...v, nome: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="telefoneCliente"><FiPhone className="inline mr-1" /> Celular</label>
              <input
                id="telefoneCliente"
                value={edita.tel}
                onChange={e => setEdita(v => (v ? { ...v, tel: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoCliente"><FiMapPin className="inline mr-1" /> Endereço</label>
              <input
                id="enderecoCliente"
                value={edita.endereco}
                onChange={e => setEdita(v => (v ? { ...v, endereco: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div className="flex gap-4 mt-3 w-full">
              <button
                type="button"
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-red-200 transition cursor-pointer"
                onClick={() => setEdita(null)}>
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer">
                Salvar alteração
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Popup sucesso */}
      {modalPopup &&
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-4 text-center">{modalPopup}</span>
            <button
              className="px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setModalPopup(false)}>
              Ok
            </button>
          </div>
        </div>
      }
    </>
  );
}

// ==== Prestadores com Pesquisa & Modal ====
type PrestadorType = {
  id: number; avatar: string; nome: string; email: string; est: string; tel: string; endereco: string;
}
const PRESTADORES_MOCK: PrestadorType[] = [
  { id: 101, avatar: "ML", nome: "Marcos Lima", email: "marcos.lima@email.com", est: "Estetica", tel: "(11) 99432-8765", endereco: "Av. Central, 100 - SP" },
  { id: 102, avatar: "SC", nome: "Sandra Cunha", email: "sandra.cunha@email.com", est: "Salão de beleza", tel: "(21) 98761-1122", endereco: "Rio Branco, 999 - RJ" },
  { id: 103, avatar: "TR", nome: "Thiago Ramos", email: "thiago.ramos@email.com", est: "Cabeleleiro", tel: "(31) 95554-5555", endereco: "Av. dos Andradas, 123 - BH" },
  { id: 104, avatar: "FC", nome: "Fernanda Costa", email: "fernanda.costa@email.com", est: "Cabeleleiro", tel: "(21) 97666-4545", endereco: "Estr. da Luz, 42 - RJ" },
];
function ParceiroAdm() {
  const [prestadores, setPrestadores] = useState(PRESTADORES_MOCK);
  const [pesquisa, setPesquisa] = useState("");
  const [edita, setEdita] = useState<PrestadorType | null>(null);
  const [modalPopup, setModalPopup] = useState<false|string>(false);

  function normaliza(s: string) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  const filtrados = prestadores.filter(p =>
    normaliza(p.nome).includes(normaliza(pesquisa)) ||
    normaliza(p.est).includes(normaliza(pesquisa)) ||
    normaliza(p.email).includes(normaliza(pesquisa))
  );

  function handleSalvar() {
    setPrestadores(list => list.map(c =>
      edita && c.id === edita.id ? edita : c
    ));
    setModalPopup("Dados do prestador alterados!");
    setEdita(null);
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Lista de Prestadores</h2>
      <div className="mb-4 flex items-center gap-2 max-w-lg">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Pesquisar por nome, estabelecimento ou e-mail..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-300 outline-none text-base shadow-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {filtrados.map(p => (
          <li key={p.id}
            className="flex items-center gap-4 px-3 py-3 bg-white rounded-lg shadow hover:bg-purple-50 transition cursor-pointer"
            tabIndex={0}
            onClick={() => setEdita({ ...p })}
          >
            <span className="avatar bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
              {p.avatar}
            </span>
            <div>
              <div className="font-bold">{p.nome}</div>
              <div className="text-gray-500 text-sm">{p.email}</div>
              <div className="text-gray-400 text-xs">Estabelecimento: {p.est}</div>
            </div>
          </li>
        ))}
      </ul>

      {edita && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" tabIndex={-1}>
          <form
            className="bg-white max-w-sm w-full rounded-2xl shadow-2xl px-8 py-8 flex flex-col gap-5 animate-fadeIn"
            onSubmit={e => { e.preventDefault(); handleSalvar(); }}
            autoComplete="off"
          >
            <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">Editar Prestador</h2>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="nomePrestador"><FiUser className="inline mr-1" /> Nome</label>
              <input
                id="nomePrestador"
                value={edita.nome}
                onChange={e => setEdita(v => (v ? { ...v, nome: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="telefonePrestador"><FiPhone className="inline mr-1" /> Celular</label>
              <input
                id="telefonePrestador"
                value={edita.tel}
                onChange={e => setEdita(v => (v ? { ...v, tel: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="emailPrestador">Email</label>
              <input
                id="emailPrestador"
                value={edita.email}
                onChange={e => setEdita(v => (v ? { ...v, email: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoPrestador"><FiMapPin className="inline mr-1" /> Endereço</label>
              <input
                id="enderecoPrestador"
                value={edita.endereco}
                onChange={e => setEdita(v => (v ? { ...v, endereco: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="estabelecimentoPrestador">Nome do Estabelecimento</label>
              <input
                id="estabelecimentoPrestador"
                value={edita.est}
                onChange={e => setEdita(v => (v ? { ...v, est: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div className="flex gap-4 mt-3 w-full">
              <button
                type="button"
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-red-200 transition cursor-pointer"
                onClick={() => setEdita(null)}>
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer">
                Salvar alteração
              </button>
            </div>
          </form>
        </div>
      )}
      {modalPopup &&
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-4 text-center">{modalPopup}</span>
            <button
              className="px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setModalPopup(false)}>
              Ok
            </button>
          </div>
        </div>
      }
    </>
  );
}

function ServicosAdm() {/* ... Seu conteúdo de servicos ... */}
function ConfiguracaoAdm() {/* ... Seu conteúdo de config ... */}