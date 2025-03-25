import PromptSync, { Prompt } from "prompt-sync";
import { AgendamentosView } from "./AgendamentosView";
import { ClienteView } from "./ClienteView";
import { FuncionarioView } from "./FuncionarioView";
import { PagamentosView } from "./PagamentosView";
import { PlanosView } from "./PlanosView";
import { ServicosView } from "./ServicosView";

export class MenuPrincipal {
    private agendamentos: AgendamentosView
    private clientes: ClienteView
    private funcionarios: FuncionarioView
    private pagamentos: PagamentosView
    private planos: PlanosView
    private servicos: ServicosView
    private prompt: Prompt

    constructor() {
        this.agendamentos = new AgendamentosView();
        this.clientes = new ClienteView();
        this.funcionarios = new FuncionarioView();
        this.pagamentos = new PagamentosView();
        this.planos = new PlanosView();
        this.servicos = new ServicosView();
        this.prompt = PromptSync()
    }
    public async exibirMenu() {
        
        console.log(`
            \x1b[1m\x1b[34m=============================\x1b[0m
            \x1b[1m\x1b[32m        MENU PRINCIPAL\x1b[0m
            \x1b[1m\x1b[34m=============================\x1b[0m
            \x1b[33m1- \x1b[0mMenu de Clientes
            \x1b[33m2- \x1b[0mMenu de Funcionários
            \x1b[33m3- \x1b[0mMenu de Planos
            \x1b[33m4- \x1b[0mMenu de Serviços
            \x1b[33m5- \x1b[0mMenu de Agendamentos
            \x1b[33m6- \x1b[0mMenu de Pagamentos
            \x1b[33m7- \x1b[31mFechar o menu\x1b[0m
            \x1b[1m\x1b[34m=============================\x1b[0m
            `)
        let opcao = parseInt(this.prompt("Selecione um Menu para acessar!"))
        switch (opcao) {
            case 1:
                await this.clientes.exibirMenu()
                return this.exibirMenu()
            case 2:
                await this.funcionarios.exibirMenu()
                return this.exibirMenu()
            case 3:
                await this.planos.exibirMenu()
                return this.exibirMenu()
            case 4:
                await this.servicos.exibirMenu()
                return this.exibirMenu()
            case 5:
                await this.agendamentos.exibirMenu()
                return this.exibirMenu()
            case 6:
                await this.pagamentos.exibirMenu()
                return this.exibirMenu()
            case 7:
                console.log("Você escolheu fechar o menu!")
                break
            default:
                console.log("Opção inválida")
                return this.exibirMenu()
        }

    }

}