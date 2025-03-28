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
            \x1b[33m2-\x1b[0m Buscar um pagamento via CPF
            \x1b[33m3-\x1b[0m Inserir um pagamento
            \x1b[33m4-\x1b[0m Atualizar um pagamento
            \x1b[33m5-\x1b[0m Deletar um pagamento
            \x1b[33m6-\x1b[0m Visualizar Inadimplentes
            \x1b[33m7-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
            `);
            
            
        let opcao = parseInt(this.prompt("O que deseja fazer?"));
        switch (opcao) {
            case 1:
                console.table(await this.pagamentos.listarPagamentos());
                return this.exibirMenu();
            case 2:
                let cpf = this.prompt("Insira o CPF do cliente que está vinculado o pagamento! ")
                console.table(await this.pagamentos.buscarPorCpf(cpf));
                return this.exibirMenu();
            case 3:
                let id_servico = parseInt(this.prompt("Qual o id do serviço?"));
                let valor_total = parseInt(this.prompt("Qual o valor total do pagamento?"));
                let forma_pagamento = this.prompt("Qual a forma de pagamento?");
                console.table(await this.pagamentos.inserirPagamento(id_servico, valor_total, forma_pagamento));
                return this.exibirMenu();
                case 4:
                    let cpfUpdate = this.prompt("Insira o CPF do cliente que realizou o serviço: ");
                let registrosExibir = await this.pagamentos.listarPagamentosEspecificos(cpfUpdate)    
                let registrosUpdate = await this.pagamentos.listarRegistros(cpfUpdate);

                if (registrosUpdate.length === 0) {
                    console.log("Nenhum serviço encontrado para este CPF.");
                    return this.exibirMenu();
                }

                let idUpdate: number;
                if (registrosUpdate.length === 1) {
                    idUpdate = await registrosUpdate[0].pegarId();
                } else {
                    console.log("Múltiplos pagamentos encontrados:");
                    console.table(registrosExibir);

                    idUpdate = parseInt(this.prompt("Digite o ID do pagamento que deseja atualizar: "));

                
                    const idsPermitidos = await Promise.all(registrosUpdate.map(a => a.pegarId()));

                    if (!idsPermitidos.includes(idUpdate)) {
                        console.log("ID inválido! Operação cancelada.");
                        return this.exibirMenu();
                    }
                }

                console.log(`\nEstas são as informações permitidas para atualização: valor_total | forma_pagamento`);
                let colunaUpdate = this.prompt("Qual informação deseja atualizar? ");

                const colunasPermitidas = ['valor_total', 'forma_pagamento'];
                if (!colunasPermitidas.includes(colunaUpdate)) {
                    console.log("Opção inválida! Atualização cancelada.");
                    return this.exibirMenu();
                }

                let novoValor = this.prompt(`Digite o novo valor para ${colunaUpdate}: `);

                await this.pagamentos.atualizarAgendamentoPorID(idUpdate, colunaUpdate, novoValor);
                console.log(`Pagamento ID ${idUpdate} atualizado com sucesso!`);

                return this.exibirMenu();
                case 5: 
                let cpfDelete = this.prompt("Insira o CPF do cliente que realizou o pagamento: ");
                let registros = await this.pagamentos.listarRegistros(cpfDelete);
                let listarRegistros = await this.pagamentos.listarPagamentosEspecificos(cpfDelete)

                if (registros.length === 0) {
                    console.log("Nenhum pagamento encontrado para este CPF.");
                    return this.exibirMenu();
                }

                if (registros.length === 1) {
                    await this.pagamentos.deletarPagamentoPorID(await registros[0].pegarId(), cpfDelete);
                    console.log("Pagamento deletado com sucesso!");
                    return this.exibirMenu();
                }

                console.log("Múltiplos pagamentos encontrados:");
                console.table(listarRegistros);

                let idDelete = parseInt(this.prompt("Digite o ID do agendamento que deseja deletar: "));

                const idsPermitidos = await Promise.all(registros.map(a => a.pegarId()));

                if (idsPermitidos.includes(idDelete)) {
                    await this.pagamentos.deletarPagamentoPorID(idDelete, cpfDelete);
                    console.log(`Pagamento ID ${idDelete} deletado com sucesso!`);
                } else {
                    console.log("ID inválido! Operação cancelada.");
                }

                return this.exibirMenu();   
                case 6:
                     console.table(await this.pagamentos.visualizarInadimplentes())
                     return this.exibirMenu()
                case 7:
                    console.log("Retornando ao menu principal")
                    return 
                default:
                    console.log("Numero inserido não existente no menu!")
                    break
        }
    }
}
