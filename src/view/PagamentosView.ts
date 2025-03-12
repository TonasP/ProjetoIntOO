import PromptSync, { Prompt } from "prompt-sync";
import { PagamentosService } from "../service/PagamentosService";

export class PagamentosView {
    private pagamentos: PagamentosService;
    private prompt: Prompt;

    constructor() {
        this.pagamentos = new PagamentosService();
        this.prompt = PromptSync();
    }

    public async exibirMenu() {
        console.log(`
            \x1b[1m\x1b[34m------ O que deseja fazer? ------\x1b[0m
            
            \x1b[33m1-\x1b[0m Visualizar os pagamentos
            \x1b[33m2-\x1b[0m Buscar um pagamento via ID
            \x1b[33m3-\x1b[0m Inserir um pagamento
            \x1b[33m4-\x1b[0m Atualizar um pagamento
            \x1b[33m5-\x1b[0m Deletar um pagamento
            \x1b[33m6-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
            `);
            
            
        let opcao = parseInt(this.prompt("O que deseja fazer?"));
        switch (opcao) {
            case 1:
                console.table(await this.pagamentos.listarPagamentos());
                break;
            case 2:
                let id = parseInt(this.prompt("Qual o ID do pagamento?"));
                console.table(await this.pagamentos.buscarID(id));
                break;
            case 3:
                let id_servico = parseInt(this.prompt("Qual o id do serviço?"));
                let valor_total = parseInt(this.prompt("Qual o valor total do pagamento?"));
                let forma_pagamento = this.prompt("Qual a forma de pagamento?");
                console.table(await this.pagamentos.inserirPagamento(id_servico, valor_total, forma_pagamento));
                break;
                case 4:
                    let identificacao = this.prompt('Qual o CPF do registro que deseja atualizar? ')
                    console.log(`Estas são as informações permitidas: nome | email | numero_celular | plano_id | `)
                    let coluna = this.prompt(`Baseado nas informações permitidas, insira o que deseja atualizar! `)
                    let registro = this.prompt(`Insira para o que deseja atualizar a informação: ${coluna}`)
                    await this.pagamentos.atualizarInformacoes(coluna, registro, identificacao)
                    return this.exibirMenu()
                case 5: 
                    let identificar= prompt("Insira o CPF do cliente que realizou o agendamento: ")
                    await this.pagamentos.deletarPagamento(identificar)
                    return this.exibirMenu()
                case 6:
                    console.log("Retornando ao menu principal")
                    return
                default:
                    console.log("Numero inserido não existente no menu!")
                    break
        }
    }
}
