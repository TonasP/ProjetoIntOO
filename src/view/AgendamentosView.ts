import PromptSync, { Prompt } from "prompt-sync";
import { AgendamentosService } from "../service/AgendamentosService";

export class AgendamentosView{
    private agendamentos: AgendamentosService
    private prompt : Prompt

    constructor(){
        this.agendamentos= new AgendamentosService()
        this.prompt = PromptSync()
    }
    public async exibirMenu(){
        console.log(`
            \x1b[1m\x1b[34m------ O que deseja fazer? ------\x1b[0m
            
            \x1b[33m1-\x1b[0m Visualizar os agendamentos
            \x1b[33m2-\x1b[0m Buscar um agendamento via CPF
            \x1b[33m3-\x1b[0m Inserir um agendamento
            \x1b[33m4-\x1b[0m Atualizar informações
            \x1b[33m5-\x1b[0m Deletar um agendamento
            \x1b[33m6-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
            `);
            
        let opcao = parseInt(this.prompt("O que deseja fazer?"))
        switch (opcao) {
            case 1:
                console.table(await this.agendamentos.listarAgendamentos())
                return this.exibirMenu()
            case 2:
                let cpf = this.prompt("Qual o CPF do cliente que realizou o agendamento? ")
                console.table(await this.agendamentos.buscarPorCpf(cpf))
                return this.exibirMenu()
            case 3:
                let id_funcionario = parseInt(this.prompt("Qual o id do funcionário?"))
                let id_cliente = parseInt(this.prompt("Qual o id do cliente?"))
                let tipo = this.prompt("Para serviço é o agendamento ?")
                let data_marcada = new Date( this.prompt("Para que dia foi agendado? ?"))
                await this.agendamentos.inserirAgendamento(id_cliente, id_funcionario, data_marcada, tipo)
                return this.exibirMenu()
            case 4:
                let identificacao = this.prompt('Qual o CPF do registro que deseja atualizar? ')
                console.log(`Estas são as informações permitidas: nome | email | numero_celular | plano_id | `)
                let coluna = this.prompt(`Baseado nas informações permitidas, insira o que deseja atualizar! `)
                let registro = prompt(`Insira para o que deseja atualizar a informação: ${coluna}| `)
                await this.agendamentos.atualizarInformacoes(coluna, registro, identificacao)
                return this.exibirMenu()
            case 5: 
            let cpfDelete = this.prompt("Insira o CPF do cliente que realizou o agendamento: ");
            let registros = await this.agendamentos.listarRegistros(cpfDelete);

            if (registros.length === 0) {
                console.log("Nenhum agendamento encontrado para este CPF.");
                return this.exibirMenu();
            }

            if (registros.length === 1) {
                
                await this.agendamentos.deletarAgendamentoPorID(registros[0].pegarId(), cpfDelete);
                console.log("Agendamento deletado com sucesso!");
            } else {
               
                console.log("Múltiplos agendamentos encontrados:");
                console.table(registros);

                let idDelete = parseInt(this.prompt("Digite o ID do agendamento que deseja deletar: "));
                
                if (registros.some(async a => await a.pegarId() === idDelete)) {
                    await this.agendamentos.deletarAgendamentoPorID(idDelete, cpfDelete);
                    console.log(`Agendamento ID ${idDelete} deletado com sucesso!`);
                } else {
                    console.log("ID inválido! Operação cancelada.");
                }
            }
            return this.exibirMenu();
                case 6:
                    console.log("Retornando ao menu principal")
                    return 
            default:
                console.log("Numero inserido não existente no menu!")
                break
        }
    }
}