import { PlanosService } from "../service/PlanosService";
import PromptSync, { Prompt } from "prompt-sync";

export class PlanosView {
    private planos: PlanosService
    private prompt: Prompt

    constructor() {
        this.planos = new PlanosService()
        this.prompt = PromptSync()
    }
    public async exibirMenu() {
        console.log(`
            \x1b[1m\x1b[34m------ O que deseja fazer? ------\x1b[0m
            
            \x1b[33m1-\x1b[0m Visualizar os planos
            \x1b[33m2-\x1b[0m Buscar um plano via ID
            \x1b[33m3-\x1b[0m Inserir um novo plano
            \x1b[33m4-\x1b[0m Atualizar um plano
            \x1b[33m5-\x1b[0m Deletar um plano
            \x1b[33m6-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
            `)
        let opcao = parseInt(this.prompt("O que deseja fazer ?"))
        switch (opcao) {
            case 1:
                console.table(await this.planos.listarPlanos())
                return this.exibirMenu()
            case 2:
                let id = parseInt(this.prompt("Qual o ID do plano?"))
                console.table(await this.planos.buscarId(id))
                return this.exibirMenu()

            case 3:
                let nome= this.prompt("Insira o nome do plano: ")
                let valor = parseInt(this.prompt("Insira o valor do plano: "))
                await this.planos.inserirPlano(nome, valor)
                return this.exibirMenu()
            case 4:
                let identificacao = this.prompt('Qual o ID do plano que deseja atualizar? ')
                console.log(`Estas são as informações permitidas: nome | valor | `)
                let coluna = this.prompt(`Baseado nas informações permitidas, insira o que deseja atualizar! `)
                let registro = this.prompt(`Insira para o que deseja atualizar a informação: ${coluna}| `)
                await this.planos.atualizarInformacoes(coluna, registro, identificacao)
                return this.exibirMenu()
            case 5:
                let identificar = this.prompt("Insira o ID do plano que deseja deletar ")
                await this.planos.deletarPlano(identificar)
                return this.exibirMenu()
            case 6:
                console.log("Retornando ao menu principal")
                return
            default:
                console.log("Opção Inexistente!")
                return this.exibirMenu()
        }
    }
}