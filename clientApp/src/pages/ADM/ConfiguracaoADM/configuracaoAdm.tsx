import ADMNavBar from "../ADMNavBar";

export default function ConfiguracaoAdm() {
  // Simule ou busque estes dados de contexto/auth/API conforme necessário
  const nome = "Administrador";
  const email = "admin@sistema.com";
  const tel = "(11) 99999-8888";

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Configurações</h2>
      <div className="bg-white shadow rounded-xl p-6 flex flex-col gap-5 max-w-md mx-auto">
        <div>
          <label className="font-bold text-gray-700">Nome</label>
          <div className="mt-1 text-lg font-semibold text-purple-600">{nome}</div>
        </div>
        <div>
          <label className="font-bold text-gray-700">E-mail</label>
          <div className="mt-1 text-lg text-gray-800">{email}</div>
        </div>
        <div>
          <label className="font-bold text-gray-700">Celular</label>
          <div className="mt-1 text-lg text-gray-800">{tel}</div>
        </div>
      </div>
    </>
  );
}