import {
  FiUsers, FiBriefcase, FiClipboard, FiSettings,
  FiMenu, FiX
} from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import LogoutButton from "../../components/LogoutButton";

// Agora os caminhos são relativos ao /admin
const navs = [
  { path: "/admin/painelAdm", ico: <AiOutlineHome />, label: "Dashboard" },
  { path: "/admin/clienteAdm", ico: <FiUsers />, label: "Clientes" },
  { path: "/admin/parceiroAdm", ico: <FiBriefcase />, label: "Prestadores" },
  { path: "/admin/servicosAdm", ico: <FiClipboard />, label: "Serviços" },
  { path: "/admin/configuracaoAdm", ico: <FiSettings />, label: "Configurações" },
];

interface AdminData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  ativo: boolean;
}

export default function ADMNavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    async function buscarDadosAdmin() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get<AdminData>("/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setAdminData(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do admin:", err);
      }
    }

    buscarDadosAdmin();
  }, []);

  function getInitials(nome: string) {
    return nome
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }


  return (
    <div className="flex min-h-screen bg-[#f6f5fb]">
      <aside className={`
        fixed md:static z-30 left-0 top-0 bottom-0 flex flex-col p-4
        bg-gradient-to-b from-[#3825a6] to-[#7c4eff] text-white transition-all duration-300
        ${sidebarOpen ? "w-[240px] translate-x-0" : "-translate-x-full w-0"} md:w-[240px] md:translate-x-0
        h-full md:h-auto shadow-lg md:shadow-none
        ${sidebarOpen || "md:block hidden"}
      `}>
        <div className="brand flex items-center justify-between mb-5">
          <button
            className="btn-icon btn-collapse rounded-lg text-xl block md:hidden"
            aria-label="Fechar menu"
            title="Fechar menu"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </button>
          <div className="brand-id flex items-center gap-3">
            <div className="logo rounded-lg bg-purple-100 w-9 h-9 flex items-center justify-center font-extrabold text-purple-600 text-lg">A</div>
            <span className="brand-title font-bold text-xl md:block block">Admin Panel</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="menu flex flex-col gap-1 mt-2" aria-label="Navegação">
          {navs.map(btn => {
            const isActive = location.pathname.includes(btn.path);
            return (
              <button
                key={btn.label}
                className={`menu-item rounded flex items-center gap-3 px-3 py-2 
                  ${isActive ? "bg-white/30 text-white font-bold" : "hover:bg-white/10 text-white/80"}`}
                onClick={() => { navigate(btn.path); setSidebarOpen(false); }}
              >
                {btn.ico}<span className="label md:inline block">{btn.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer mt-auto">
          <div className="user flex items-center gap-2 py-3 pl-2 pr-0">
            <div className="avatar w-10 h-10 bg-purple-200 text-purple-700 flex items-center justify-center rounded-full font-bold">
              {adminData ? getInitials(adminData.nome) : "A"}
            </div>
            <div className="meta leading-tight hidden md:block">
              <strong>{adminData?.nome || "Admin"}</strong>
              <br /><small>{adminData?.email || "admin@sistema.com"}</small>
            </div>
          </div>
          <div className="hidden md:block mt-3">
            <LogoutButton variant="default" className="w-full" />
          </div>
        </div>
      </aside>

      {/* Conteúdo da Página */}
      <div className="flex-1 flex flex-col content">
        <header className="topbar flex items-center gap-2 bg-white px-6 shadow-md sticky top-0 z-10 h-[65px]">
          <button
            className="btn-icon btn-open mr-3 text-purple-600 bg-purple-50 p-2 rounded-md text-xl md:hidden block"
            aria-label="Abrir menu"
            title="Abrir menu"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>
          <h1 className="text-xl font-extrabold tracking-wide">
            {navs.find(n => location.pathname.includes(n.path))?.label ?? ""}
          </h1>
        </header>

        {/* Outlet ao invés de children */}
        <main className="main flex-1 p-6 md:p-10 bg-[#f6f5fb]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}




