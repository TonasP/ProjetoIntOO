import { Servicos } from "../entity/Servicos";
import { ServicosRepository } from "../repository/ServicosRepository";
import { ServicosDTO } from "../entity/ServicosDTO";

export class ServicosService {
    private repo: ServicosRepository;

    constructor() {
        this.repo = new ServicosRepository();
    }

    async listarServicos(): Promise<ServicosDTO[]> {
        return await this.repo.listarServicos();
    }

    async verificarId(id): Promise<boolean> {
        let lista = await this.repo.buscarID(id);
        return lista.length > 0;
    }

    async buscarID(id): Promise<ServicosDTO[]> {
        let lista = await this.repo.buscarID(id);
        if (lista.length == 0) {
            console.log("Serviço não encontrado!");
            return [];
        } else {
            return lista;
        }
    }

    async listarRegistros(cpf): Promise<Servicos[]> {
        return await this.repo.listarRegistros(cpf);
    }

    public async listarServicoEspecifico(cpf): Promise<ServicosDTO[]> {
        return this.repo.listarServicosEspecificos(cpf);
    }

    async inserirServico(id_funcionario: number, id_cliente: number, tipo_servico: string, data_servico: Date) {
        const servicosFixos = ["Aula de Musculação", "Consulta Nutricional", "Avaliação física"]
            
        if (!servicosFixos[tipo_servico]) {
            console.log("Erro: Serviço inválido.");
            return;
        }

        const valorServico = servicosFixos[tipo_servico];
        await this.repo.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico);
        console.log(`Serviço '${tipo_servico}' inserido com sucesso!`);
    }

    public async atualizarServicoPorID(id: number, coluna: string, novoValor: string) {
        const colunasPermitidas = ['data_servico', 'tipo_servico'];
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna inválida! Atualização cancelada.");
            return;
        }
        await this.repo.atualizarServicoPorID(id, coluna, novoValor);
    }

    async atualizarInformacoes(coluna, registro, id) {
        const colunasPermitidas = ['data_servico', 'tipo_servico'];
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna não permitida!");
            return;
        }
        if (!await this.verificarId(id)) {
            console.log("Id não encontrado!");
            return;
        }
        if (!registro) {
            console.log("Registros nulos não são permitidos");
            return;
        }
        await this.repo.atualizarInformacoes(coluna, registro, id);
        console.log("Atualização realizada com sucesso!");
    }

    public async deletarServicoPorID(id: number, cpf: string) {
        const servicos = await this.listarRegistros(cpf);

        if (servicos.length === 0) {
            console.log("Nenhum agendamento encontrado para este CPF.");
            return;
        }

        const idsPermitidos = await Promise.all(servicos.map(async a => await a.pegarId()));
        if (!idsPermitidos.includes(id)) {
            console.log("O ID inserido não é compatível com os exibidos!");
            return;
        }
        await this.repo.deletarServicoPorID(id);
    }

    public async deletarServico(cpf: string, id: number): Promise<void> {
        if (!await this.verificarId(id)) {
            console.log("Serviço não encontrado!");
            return;
        }

        let servico = await this.listarRegistros(cpf);

        if (servico.length === 0) {
            console.log("Nenhum serviço encontrado para este CPF.");
            return;
        }

        const servicos = servico.find(async a => await a.pegarId() === id);

        if (!servicos) {
            console.log("ID inválido! Operação cancelada.");
            return;
        }
        await this.repo.deletarServicoPorID(id);
        console.log(`Serviço ID ${id} deletado com sucesso!`);
    }
}
