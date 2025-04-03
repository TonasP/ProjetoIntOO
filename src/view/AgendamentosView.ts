import PromptSync, { Prompt } from "prompt-sync";
import { AgendamentosService } from "../service/AgendamentosService";
import { FuncionarioService } from "../service/FuncionarioService";
import { ClienteService } from "../service/ClienteService";

export class AgendamentosView {
    private cliente : ClienteService
    private funcionario : FuncionarioService
    private agendamentos: AgendamentosService
    private prompt: Prompt

    constructor(cliente : ClienteService, funcionario: FuncionarioService) {
        this.cliente = cliente
        this.funcionario = funcionario
        this.agendamentos = new AgendamentosService()
        this.prompt = PromptSync()
    }
    public async exibirMenu() {
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
                console.table(await this.funcionario.listarFuncionario())
                let id_funcionario = parseInt(this.prompt("Qual o id do funcionário?"))
                console.table(await this.cliente.listarClientes())
                let id_cliente = parseInt(this.prompt("Qual o id do cliente?"))
                console.log(`
                    1-Aula de musculacao
                    2-Consulta nutricional
                    3-Avaliacao fisica
                `);
                let tipo = this.prompt("Insira o serviço realizado baseado na tabela acima!")
                let data_marcada = this.prompt("Para que dia deseja agendar ?")
                await this.agendamentos.inserirAgendamento(id_cliente, id_funcionario, data_marcada, tipo)
                return this.exibirMenu()
            case 4:
                let cpfUpdate = this.prompt("Insira o CPF do cliente que realizou o agendamento: ");
                let registrosUpdate = await this.agendamentos.listarRegistros(cpfUpdate);
                let registrosVisualizar = await this.agendamentos.listarAgendamentosEspecificos(cpfUpdate)

                if (registrosUpdate.length === 0) {
                    console.log("Nenhum agendamento encontrado para este CPF.");
                    return this.exibirMenu();
                }

                let idUpdate: number;
                if (registrosUpdate.length === 1) {
                    idUpdate = await registrosUpdate[0].pegarId();
                } else {
                    console.log("Múltiplos agendamentos encontrados:");
                    console.table(registrosVisualizar);

                    idUpdate = parseInt(this.prompt("Digite o ID do agendamento que deseja atualizar: "));

                
                    const idsPermitidos = await Promise.all(registrosUpdate.map(a => a.pegarId()));

                    if (!idsPermitidos.includes(idUpdate)) {
                        console.log("ID inválido! Operação cancelada.");
                        return this.exibirMenu();
                    }
                }

                console.log(`\nEstas são as informações permitidas para atualização: id_funcionario | data_marcada | tipo`);
                let colunaUpdate = this.prompt("Qual informação deseja atualizar? ");

                const colunasPermitidas = ['id_funcionario', 'data_marcada', 'tipo'];
                if (!colunasPermitidas.includes(colunaUpdate)) {
                    console.log("Opção inválida! Atualização cancelada.");
                    return this.exibirMenu();
                }

                let novoValor = this.prompt(`Digite o novo valor para ${colunaUpdate}: `);

                await this.agendamentos.atualizarAgendamentoPorID(idUpdate, colunaUpdate, novoValor);
                console.log(`Agendamento ID ${idUpdate} atualizado com sucesso!`);

                return this.exibirMenu();
            case 5:
                let cpfDelete = this.prompt("Insira o CPF do cliente que realizou o agendamento: ");
                let registros = await this.agendamentos.listarRegistros(cpfDelete);
                let registrosVs = await this.agendamentos.listarAgendamentosEspecificos(cpfDelete)

                if (registros.length === 0) {
                    console.log("Nenhum agendamento encontrado para este CPF.");
                    return this.exibirMenu();
                }

                if (registros.length === 1) {
                    await this.agendamentos.deletarAgendamentoPorID(await registros[0].pegarId(), cpfDelete);
                    console.log("Agendamento deletado com sucesso!");
                    return this.exibirMenu();
                }

                console.log("Múltiplos agendamentos encontrados:");
                console.table(registrosVs);

                let idDelete = parseInt(this.prompt("Digite o ID do agendamento que deseja deletar: "));

                const idsPermitidos = await Promise.all(registros.map(a => a.pegarId()));

                if (idsPermitidos.includes(idDelete)) {
                    await this.agendamentos.deletarAgendamentoPorID(idDelete, cpfDelete);
                    console.log(`Agendamento ID ${idDelete} deletado com sucesso!`);
                } else {
                    console.log("ID inválido! Operação cancelada.");
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