
import { FuncionarioView } from "./view/FuncionarioView";
async function teste(){
let menu = new FuncionarioView()
await menu.exibirMenu()
}
teste()