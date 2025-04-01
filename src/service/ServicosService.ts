import { Servicos } from "../entity/Servicos";
import { ServicosRepository } from "../repository/ServicosRepository";
import { ServicosDTO } from "../entity/ServicosDTO";
import { FuncionarioService } from "./FuncionarioService";

export class ServicosService {
    private repo: ServicosRepository;
    private _funcionarioService: FuncionarioService;

    constructor() {
        this.repo = new ServicosRepository();
        this._funcionarioService = new FuncionarioService(this);  
    }

    private get funcionarioService(): FuncionarioService {
        if (!this._funcionarioService) {
            this._funcionarioService = new FuncionarioService(this);
        }
        return this._funcionarioService;
    }

    async listarServicos(): Promise<ServicosDTO[]> {
        return await this.repo.listarServicos();
    }
    async listarServicosFuncionario(id){
        return await this.repo.listarServicosFuncionarios(id)
    }
    async verificarId(id): Promise<boolean | void> {
        if (!id) {
            return
        }
        let lista = await this.repo.buscarID(id);
        return lista.length > 0;
    }
    public async pegarPlanoCliente(id){
        if (!id){
            console.log("ID inválido!")
            return
        }
        return this.repo.pegarPlanoCliente(id)
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
    async listarTipoServico(id) {
        return await this.repo.listarTipoServico(id)

    }

    async listarRegistros(cpf): Promise<Servicos[]> {
        return await this.repo.listarRegistros(cpf);
    }

    public async listarServicoEspecifico(cpf): Promise<ServicosDTO[]> {
        return await this.repo.listarServicosEspecificos(cpf);
    }

    async inserirServico(id_funcionario: number, id_cliente: number, tipo_servico: string, data_servico: Date) {
        let converterServico = parseInt(tipo_servico);


        if (isNaN(converterServico) || converterServico < 1 || converterServico > 4) {
            console.log("Erro: Serviço inválido.");
            return;
        }

        let indiceServico = converterServico - 1;
        const servicosFixos = ["Aula de Musculação", "Consulta Nutricional", "Avaliação Física", "Assinatura de plano"];
        let selecionarServico = servicosFixos[indiceServico];
        
        if (await this._funcionarioService!.pegarSituacaoEmpregado(id_funcionario) ===false){
            console.log("Você não pode ter realizado um serviço com um funcionário inativo no momento!")
            return
        }
        if (!selecionarServico) {
            console.log("Erro: Serviço selecionado não existe.");
            return;
        }

        if (!id_cliente || isNaN(id_cliente)) {
            console.log("Erro: ID do cliente inválido.");
            return;
        }


        await this.repo.inserirServico(id_funcionario, id_cliente, selecionarServico, data_servico);
        console.log(`Serviço '${selecionarServico}' inserido com sucesso!`);
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
