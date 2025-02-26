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
        console.log(`------O que deseja fazer ?------
            1- Visualizar os pagamentos
            2- Buscar um pagamento via ID
            3- Inserir um pagamento`);
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
            default:
                console.log("Número inserido não existente no menu!");
        }
    }
}
