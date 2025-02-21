
import { PlanosService } from "./service/PlanosService";
import { ClienteView } from "./view/ClienteView";
import { FuncionarioView } from "./view/FuncionarioView";
import { PlanosView } from "./view/PlanosView";
async function teste(){
let menu = new PlanosView()
await menu.exibirMenu()
}
teste()