import { PlanosService } from "../service/PlanosService";
import PromptSync, { Prompt } from "prompt-sync";

export class PlanosView{
    private planos: PlanosService
    private prompt: Prompt

    constructor(){
        this.planos= new PlanosService()
        this.prompt = PromptSync()
    }
    public async exibirMenu() {
        console.log(`------O que deseja fazer ?------
            1- Visualizar os planos
            2- Buscar um plano via ID`)
        let opcao = parseInt(this.prompt("O que deseja fazer ?"))
        switch (opcao) {
            case 1:
                console.table(await this.planos.listarPlanos())
                break
            case 2:
                let id = parseInt(this.prompt("Qual o ID do funcionário?"))
                console.table(await this.planos.buscarID(id))
                break
            default:
                console.log("numero errado")
        }
    }
}