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
        console.log(`------O que deseja fazer ?------
            1- Visualizar os agendamentos
            2- Buscar um agendamento via ID
            3- Inserir um agendamento`)
        let opcao = parseInt(this.prompt("O que deseja fazer?"))
        switch (opcao) {
            case 1:
                console.table(await this.agendamentos.listarAgendamentos())
            case 2:
                let id = parseInt(this.prompt("Qual o ID do serviço?"))
                console.table(await this.agendamentos.buscarPorID(id))
            case 3:
                let id_funcionario = parseInt(this.prompt("Qual o id do funcionário?"))
                let id_cliente = parseInt(this.prompt("Qual o id do cliente?"))
                let tipo = this.prompt("Para serviço é o agendamento ?")
                let data_marcada = this.prompt("Para que dia foi agendado? ?")
                console.table(await this.agendamentos.inserirAgendamento(id_cliente, id_funcionario, data_marcada, tipo))
            default:
                console.log("Numero inserido não existente no menu!")
        }
    }
}