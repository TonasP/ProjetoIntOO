import { ServicosService } from "./service/ServicosService";
import { ClienteService } from "./service/ClienteService";
import { PagamentosView } from "./view/PagamentosView";
import { AgendamentosView } from "./view/AgendamentosView";
import { ClienteView } from "./view/ClienteView";
import { FuncionarioView } from "./view/FuncionarioView";
import { MenuPrincipal } from "./view/MenuPrincipal";
import { PlanosView } from "./view/PlanosView";
import { ServicosView } from "./view/ServicosView";
import { FuncionarioService } from "./service/FuncionarioService";
const servicoService = new ServicosService
const funcionarioService = new FuncionarioService(servicoService)


const clienteService = new ClienteService(servicoService)
const clientesView = new ClienteView();
const funcionariosView = new FuncionarioView();
const pagamentosView = new PagamentosView();
const planosView = new PlanosView();
const servicosView = new ServicosView(funcionarioService, clienteService);
const agendamentosView = new AgendamentosView(clienteService, funcionarioService);

const menu = new MenuPrincipal(agendamentosView, servicosView, clientesView, funcionariosView, pagamentosView, planosView);
menu.exibirMenu();