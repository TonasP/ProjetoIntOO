import { promises } from "dns";
import { FuncionarioService } from "../service/FuncionarioService";
import PromptSync, { Prompt } from "prompt-sync";
export class FuncionarioView {
    private Funcionario: FuncionarioService
    private prompt: Prompt

    constructor() {
        this.Funcionario = new FuncionarioService()
        this.prompt = PromptSync()
    }

    public async exibirMenu(): Promise<void> {
        console.log(`
            \x1b[1m\x1b[34m------ O que deseja fazer? ------\x1b[0m
            
            \x1b[33m1-\x1b[0m Visualizar os funcionários
            \x1b[33m2-\x1b[0m Buscar um funcionário via ID
            \x1b[33m3-\x1b[0m Cadastrar um novo funcionário
            \x1b[33m4-\x1b[0m Atualizar um funcionário
            \x1b[33m5-\x1b[0m Deletar um funcionário
            \x1b[33m6-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
            `);
            
        let opcao = parseInt(this.prompt("O que deseja fazer ?"))
        switch (opcao) {
            case 1:
                console.table(await this.Funcionario.listarFuncionario())
                break
            case 2:
                let cpf = this.prompt("Qual o CPF do funcionário? ")
                console.table(await this.Funcionario.buscarPorCpf(cpf))
                break
            case 3:
                let nome = this.prompt("Digite o nome do funcionário ")
                let cpfFuncionario = this.prompt("Digite o cpf do funcionário ")
                let data_nascimento = new Date(this.prompt("Digite a data de nascimento do funcionário "))
                let funcao = this.prompt("Digite a função do funcionário ")
                let numero_celular = this.prompt("Digite o numero de celular do funcionário ")
                let email = this.prompt("Digite o email do funcionário ")
                await this.Funcionario.inserirFuncionario(nome, cpfFuncionario, data_nascimento, funcao, numero_celular, email)
                break
            case 4:
                let identificacao = this.prompt('Qual o CPF do registro que deseja atualizar? ')
                console.log(`Estas são as informações permitidas: nome | email | numero_celular | funcao | `)
                let coluna = this.prompt(`Baseado nas informações permitidas, insira o que deseja atualizar! `)
                let registro = this.prompt(`Insira para o que deseja atualizar a informação: ${coluna}| `)
                await this.Funcionario.atualizarInformacoes(coluna, registro, identificacao)
                return this.exibirMenu()
            case 5:
                let identificar = this.prompt("Insira o CPF do cliente que deseja deletar! ")
                await this.Funcionario.deletarFuncionario(identificar)
                return this.exibirMenu()
            case 6:
                console.log("Retornando ao menu principal!")
                return 
            default:
                console.log("numero errado")
        }
    }
}