import { ClienteService } from "../service/ClienteService";
import PromptSync, { Prompt } from "prompt-sync";

export class ClienteView {
    private cliente: ClienteService
    private prompt: Prompt

    constructor() {
        this.cliente = new ClienteService()
        this.prompt = PromptSync()
    }
    public async exibirMenu() {
        console.log(`------O que deseja fazer ?------
            1- Visualizar os clientes
            2- Buscar um cliente via ID
            3- Cadastrar um novo cliente`)
        let opcao = parseInt(this.prompt("O que deseja fazer ?"))
        switch (opcao) {
            case 1:
                console.table(await this.cliente.listarClientes())
                break
            case 2:
                let id = parseInt(this.prompt("Qual o ID do funcionário?"))
                console.table(await this.cliente.buscarID(id))
                break
            case 3:
                let nome = this.prompt("Digite o nome do cliente")
                let cpf = this.prompt("Digite o cpf do cliente")
                let data_nascimento = this.prompt("Digite a data de nascimento do cliente")
                let plano_id = this.prompt("Digite o plano do cliente")
                let numero_celular = this.prompt("Digite o numero de celular do cliente")
                let email = this.prompt("Digite o email do cliente")
                await this.cliente.inserirCliente(nome, cpf, data_nascimento, plano_id, numero_celular, email)
                break
            default:
                console.log("numero errado")
        }
    }

}