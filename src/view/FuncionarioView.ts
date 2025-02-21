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
        console.log(`------O que deseja fazer ?------
        1- Visualizar os funcionários
        2- Buscar um funcionário via ID
        3- Cadastrar um novo funcionário`)
        let opcao = parseInt(this.prompt("O que deseja fazer ?"))
        switch (opcao) {
            case 1:
                console.table(await this.Funcionario.listarFuncionario())
                break
            case 2:
                let ID = parseInt(this.prompt("Qual o ID do funcionário?"))
                console.table(await this.Funcionario.buscarPorID(ID))
                break
            case 3:
                let nome = this.prompt("Digite o nome do funcionário")
                let cpf = this.prompt("Digite o cpf do funcionário")
                let data_nascimento = this.prompt("Digite a data de nascimento do funcionário")
                let funcao = this.prompt("Digite a função do funcionário ")
                let numero_celular = this.prompt("Digite o numero de celular do funcionário")
                let email = this.prompt("Digite o email do funcionário")
                await this.Funcionario.inserirFuncionario(nome, cpf, data_nascimento, funcao, numero_celular, email)
                break
            default:
                console.log("numero errado")
        }
    }
}