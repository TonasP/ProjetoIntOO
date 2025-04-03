import PromptSync, { Prompt } from "prompt-sync";
import { ServicosService } from "../service/ServicosService";
import { ClienteService } from "../service/ClienteService";
import { FuncionarioService } from "../service/FuncionarioService";


export class ServicosView {
    private funcionario: FuncionarioService
    private cliente : ClienteService
    private servicos: ServicosService;
    private prompt: Prompt;

    constructor(funcionario : FuncionarioService, cliente: ClienteService) {
        this.funcionario = funcionario
        this.cliente = cliente
        this.servicos = new ServicosService();
        this.prompt = PromptSync();
    }

    public async exibirMenu() {
        console.log(`
            \x1b[1m\x1b[34m------ O que deseja fazer? ------\x1b[0m
            
            \x1b[33m1-\x1b[0m Visualizar os Serviços
            \x1b[33m2-\x1b[0m Buscar um Serviço via ID
            \x1b[33m3-\x1b[0m Inserir um serviço
            \x1b[33m4-\x1b[0m Atualizar um serviço
            \x1b[33m5-\x1b[0m Deletar um serviço
            \x1b[33m6-\x1b[0m Retornar ao menu principal
            
            \x1b[1m\x1b[34m----------------------------------\x1b[0m
        `);

        let opcao = parseInt(this.prompt("O que deseja fazer?"));
        switch (opcao) {
            case 1:
                console.table(await this.servicos.listarServicos());
                return this.exibirMenu();
            case 2:
                let id = parseInt(this.prompt("Qual o ID do serviço?"));
                console.table(await this.servicos.buscarID(id));
                return this.exibirMenu();
            case 3:
                console.table (await this.funcionario.listarFuncionario())
                let id_funcionario = parseInt( this.prompt("Qual o id do funcionário?"));
                console.table(await this.cliente.listarClientes())
                let id_cliente = parseInt(this.prompt("Qual o id do cliente?"));
                console.log(`
                    1-Aula de musculacao
                    2-Consulta nutricional
                    3-Avaliacao fisica
                `);
                let tipo_servico = this.prompt("Insira o serviço realizado baseado na tabela acima! ");
                let data_servico = new Date(this.prompt("Qual a data em que foi realizado o serviço? Utilize "));
                await this.servicos.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico);
                return this.exibirMenu();
            case 4:
                let cpfUpdate = this.prompt("Insira o CPF do cliente que realizou o serviço: ");
                let registrosUpdate = await this.servicos.listarRegistros(cpfUpdate);
                let registrosView = await this.servicos.listarServicoEspecifico(cpfUpdate);

                if (registrosUpdate.length === 0) {
                    console.log("Nenhum serviço encontrado para este CPF.");
                    return this.exibirMenu();
                }

                let idUpdate: number;
                if (registrosUpdate.length === 1) {
                    idUpdate = await registrosUpdate[0].pegarId();
                } else {
                    console.log("Múltiplos serviços encontrados:");
                    console.table(registrosView);

                    idUpdate = parseInt(this.prompt("Digite o ID do agendamento que deseja atualizar: "));

                    const idsPermitidos = await Promise.all(registrosUpdate.map(a => a.pegarId()));

                    if (!idsPermitidos.includes(idUpdate)) {
                        console.log("ID inválido! Operação cancelada.");
                        return this.exibirMenu();
                    }
                }

                console.log(`\nEstas são as informações permitidas para atualização: data_servico | tipo_servico`);
                let colunaUpdate = this.prompt("Qual informação deseja atualizar? ");

                const colunasPermitidas = ['data_servico', 'tipo_servico'];
                if (!colunasPermitidas.includes(colunaUpdate)) {
                    console.log("Opção inválida! Atualização cancelada.");
                    return this.exibirMenu();
                }

                let novoValor = this.prompt(`Digite o novo valor para ${colunaUpdate}: `);

                await this.servicos.atualizarInformacoes(idUpdate, colunaUpdate, novoValor);
                console.log(`Serviço ID ${idUpdate} atualizado com sucesso!`);

                return this.exibirMenu();
            case 5:
                let cpfDelete = this.prompt("Insira o CPF do cliente que realizou o serviço: ");
                let registros = await this.servicos.listarRegistros(cpfDelete);
                let registrosVs = await this.servicos.listarServicoEspecifico(cpfDelete);

                if (registros.length === 0) {
                    console.log("Nenhum serviço encontrado para este CPF.");
                    return this.exibirMenu();
                }

                if (registros.length === 1) {
                    await this.servicos.deletarServicoPorID(await registros[0].pegarId(), cpfDelete);
                    console.log("Serviço deletado com sucesso!");
                    return this.exibirMenu();
                }

                console.log("Múltiplos serviços encontrados:");
                console.table(registrosVs);

                let idDelete = parseInt(this.prompt("Digite o ID do agendamento que deseja deletar: "));

                const idsPermitidos = await Promise.all(registros.map(a => a.pegarId()));

                if (idsPermitidos.includes(idDelete)) {
                    await this.servicos.deletarServicoPorID(idDelete, cpfDelete);
                    console.log(`Serviço ID ${idDelete} deletado com sucesso!`);
                } else {
                    console.log("ID inválido! Operação cancelada.");
                }

                return this.exibirMenu();
            case 6:
                console.log("Retornando ao menu principal");
                return;
            default:
                console.log("Número inserido não existente no menu!");
                return this.exibirMenu();
        }
    }
}
