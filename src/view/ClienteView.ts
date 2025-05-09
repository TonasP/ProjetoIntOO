import { ClienteService } from "../service/ClienteService";
import PromptSync, { Prompt } from "prompt-sync";
import { PlanosService } from "../service/PlanosService";
import { ServicosService } from "../service/ServicosService";


export class ClienteView {
    private plano: PlanosService;
    private cliente: ClienteService;
    private prompt: Prompt;

    constructor() {
        const servico = new ServicosService();  
        this.plano = new PlanosService();
        this.cliente = new ClienteService(servico);  
        this.prompt = PromptSync();
    }
    public async listarPlanos(){
        return await this.plano.listarPlanos()
    }

    public async exibirMenu() {
        console.log(`
            \x1b[1m\x1b[34m------ O que deseja fazer? ------\x1b[0m
            
            \x1b[33m1-\x1b[0m Visualizar os clientes
            \x1b[33m2-\x1b[0m Buscar um cliente via CPF
            \x1b[33m3-\x1b[0m Cadastrar um novo cliente
            \x1b[33m4-\x1b[0m Atualizar dados
            \x1b[33m5-\x1b[0m Deletar registro
            \x1b[33m6-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
            `);
            
        let opcao = parseInt(this.prompt("O que deseja fazer ?"))
        switch (opcao) {
            case 1:
                console.table(await this.cliente.listarClientes())
                return this.exibirMenu()
            case 2:
                let cpfCliente = this.prompt("Qual o CPF do cliente:")
                console.table(await this.cliente.buscarPorCpf(cpfCliente))
                return this.exibirMenu()
            case 3:
                let nome = this.prompt("Digite o nome do cliente: ")
                let cpf = this.prompt("Digite o cpf do cliente seguindo o seguinte modelo: 000.000.000-00: ")
                let data_nascimento = this.prompt("Digite a data de nascimento do cliente seguindo o modelo: DD/MM/AAAA : ")
                console.table(await this.listarPlanos())
                let plano_id = parseInt(this.prompt("Digite o plano do cliente: "))
                let numero_celular = this.prompt("Digite o numero de celular do cliente seguindo o modelo: (00) 00000-0000: ")
                let email = this.prompt("Digite o email do cliente: ")
                await this.cliente.inserirCliente(nome, cpf, data_nascimento, plano_id, numero_celular, email)
                return this.exibirMenu()
            case 4:
                let identificacao = this.prompt('Qual o CPF do registro que deseja atualizar? ')
                console.log(`Estas são as informações permitidas: nome | email | numero_celular | plano_id | `)
                let coluna = this.prompt(`Baseado nas informações permitidas, insira o que deseja atualizar! `)
                if (coluna == "plano_id"){
                   console.table (await this.plano.listarPlanos())
                }
                let registro = this.prompt(`Insira para o que deseja atualizar a informação: ${coluna}| `)
                await this.cliente.atualizarInformacoes(coluna, registro, identificacao)
                return this.exibirMenu()
            case 5:
                let identificar = this.prompt("Insira o CPF do cliente que deseja deletar! ")
                console.log("Deletar um cliente resultará em deletar todos os registros que o cliente está incluso, incluindo serviços, agendamentos e pagamentos!")
                let escolha = parseInt(this.prompt ("Deseja deletar o cliente sabendo das consequências ? 1- Sim | 2- Não" ))
                    if (escolha = 1){
                        await this.cliente.deletarCliente(identificar)
                        return this.exibirMenu()
                    }
                    if (escolha = 2){
                        console.log("Cancelando exclusão de registros e retornando ao menu !")
                        return this.exibirMenu()
                    }
                    else {
                        console.log("Opção inválida!")
                        return this.exibirMenu()
                    }
                
            case 6:
                console.log("Retornando ao menu principal")
                return 
            default:
                console.log("Opção inválida!")
                break
        }
    }

}