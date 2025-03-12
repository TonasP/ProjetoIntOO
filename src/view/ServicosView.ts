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
        console.log(`
            \x1b[1m\x1b[34m------ O que deseja fazer? ------\x1b[0m
            
            \x1b[33m1-\x1b[0m Visualizar os Serviços
            \x1b[33m2-\x1b[0m Buscar um Serviço via ID
            \x1b[33m3-\x1b[0m Inserir um serviço
            \x1b[33m4-\x1b[0m Atualizar um serviço
            \x1b[33m5-\x1b[0m Deletar um serviço
            \x1b[33m6-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
            `);
            
        let opcao = parseInt(this.prompt("O que deseja fazer?"))
        switch (opcao) {
            case 1:
                console.table(await this.servicos.listarServicos())
                return this.exibirMenu()
            case 2:
                let id = parseInt(this.prompt("Qual o ID do serviço?"))
                console.table(await this.servicos.buscarID(id))
                return this.exibirMenu()
            case 3:
                let id_funcionario = parseInt(this.prompt("Qual o id do funcionário?"))
                let id_cliente = parseInt(this.prompt("Qual o id do cliente?"))
                let tipo_servico = this.prompt("Qual foi o tipo de serviço realizado ?")
                let data_servico = this.prompt("Qual a data em que foi realizado o serviço?")
                console.table(await this.servicos.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico))
                return this.exibirMenu()
            case 4: 
            let identificacao = this.prompt('Qual o CPF do registro que deseja atualizar? ')
                console.log(`Estas são as informações permitidas: nome | email | numero_celular | plano_id | `)
                let coluna = this.prompt(`Baseado nas informações permitidas, insira o que deseja atualizar! `)
                let registro = this.prompt(`Insira para o que deseja atualizar a informação: ${coluna}| `)
                await this.servicos.atualizarInformacoes(coluna, registro, identificacao)
                return this.exibirMenu()
            case 5:
                let identificar= this.prompt("Insira o CPF do cliente que usufruiu do serviço: ")
                await this.servicos.deletarServicos(identificar)
                return this.exibirMenu()   
                case 6:
                    console.log("Retornando ao menu principal")
                    return 
            default:
                console.log("Numero inserido não existente no menu!")
        }
    }
}