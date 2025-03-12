

import { PlanosService } from "./service/PlanosService";
import { AgendamentosView } from "./view/AgendamentosView";
import { ClienteView } from "./view/ClienteView";
import { FuncionarioView } from "./view/FuncionarioView";
import { MenuPrincipal } from "./view/MenuPrincipal";
import { PlanosView } from "./view/PlanosView";
async function teste(){
let menu = new MenuPrincipal ()
await menu.exibirMenu()
}
teste()