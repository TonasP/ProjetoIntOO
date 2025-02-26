import PromptSync, { Prompt } from "prompt-sync";
import { ServicosService } from "../service/ServicosService";

export class ServicosView {
    private servicos: ServicosService
    private prompt: Prompt
    constructor() {
        this.servicos = new ServicosService()
        this.prompt = PromptSync()
    }
    public async exibirMenu() {
        console.log(`------O que deseja fazer ?------
            1- Visualizar os Serviços
            2- Buscar um Serviço via ID
            3- Inserir um serviço`)
        let opcao = parseInt(this.prompt("O que deseja fazer?"))
        switch (opcao) {
            case 1:
                console.table(await this.servicos.listarServicos)
            case 2:
                let id = parseInt(this.prompt("Qual o ID do serviço?"))
                console.table(await this.servicos.buscarID(id))
            case 3:
                let id_funcionario = parseInt(this.prompt("Qual o id do funcionário?"))
                let id_cliente = parseInt(this.prompt("Qual o id do cliente?"))
                let tipo_servico = this.prompt("Qual foi o tipo de serviço realizado ?")
                let data_servico = this.prompt("Qual a data em que foi realizado o serviço?")
                console.table(await this.servicos.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico))
            default:
                console.log("Numero inserido não existente no menu!")
        }
    }
}