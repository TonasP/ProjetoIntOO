
import { Agendamentos } from "../entity/Agendamentos";
import { AgendamentosRepository } from "../repository/AgendamentosRepository";
import { AgendamentosDTO } from "../entity/AgendamentosDTO";

export class AgendamentosService {
    private repo: AgendamentosRepository

    constructor() {
        this.repo = new AgendamentosRepository
    }
    async listarAgendamentos(): Promise<AgendamentosDTO[]> {
        return await this.repo.listarAgendamentos()
    }

    async buscarPorCpf(cpf: string): Promise<AgendamentosDTO[]> {
        let lista = await this.repo.buscarPorCpf(cpf)


        if (lista.length == 0) {
            console.log("Agendamento não encontrado!")
            return []
        }
        else {
            return lista
        }
    }
    async listarAgendamentosEspecificos(cpf) {
        return this.repo.listarAgendamentosEspecificos(cpf)
    }
    async verificarCpf(cpf): Promise<boolean> {
        let lista: Agendamentos[] = []
        lista = await this.repo.verificarCpf(cpf)
        return lista.length > 0;
        //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    public async inserirAgendamento(id_cliente: number, id_funcionario: number, data_marcada: string , tipo: string) {
        let converterServico = parseInt(tipo);


        if (isNaN(converterServico) || converterServico < 1 || converterServico > 3) {
            console.log("Erro: Serviço inválido.");
            return;
        }

        let indiceServico = converterServico - 1;
        const servicosFixos = ["Aula de Musculação", "Consulta Nutricional", "Avaliação Física",];
        let selecionarServico = servicosFixos[indiceServico];


        if (!selecionarServico) {
            console.log("Erro: Serviço selecionado não existe.");
            return;
        }

        if (!id_cliente || isNaN(id_cliente)) {
            console.log("Erro: ID do cliente inválido.");
            return;
        }
        const partes = data_marcada.split("/");
        if (partes.length !== 3) {
            console.log("Erro: Formato de data inválido!");
            return;
        }
        const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`

        const dataMarcada = new Date(dataFormatada);
        if (isNaN(dataMarcada.getTime())) {
            console.log("Erro: Data inválida!");
            return;
        }

        if (dataMarcada < new Date()) {
            console.log("Agendamentos só podem serem marcados para o futuro! ")
            return
        }

        await this.repo.inserirAgendamento(id_cliente, id_funcionario, dataMarcada, selecionarServico)
        console.log("Agendamento inserido com sucesso! ")
    }
    public async atualizarAgendamentoPorID(id: number, coluna: string, novoValor: string) {
        const colunasPermitidas = ['id_funcionario', 'data_marcada', 'tipo'];

        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna inválida! Atualização cancelada.");
            return;
        }

        await this.repo.atualizarAgendamentoPorID(id, coluna, novoValor);
    }
    public async atualizarInformacoes(coluna, registro, cpf) {
        const colunasPermitidas = ['id_funcionario', 'data_marcada', 'tipo']
        console.log(`Estas são as informações permitidas: ${colunasPermitidas}`)
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Opção não permitida!")
            return
        }
        if (!await this.verificarCpf(cpf)) {
            console.log("Cpf não encontrado!")
            return
        }
        if (!registro) {
            console.log("Registros nulos não são permitidos")
            return
        }
        await this.repo.atualizarInformacoes(coluna, registro, cpf)
        console.log("Atualização realiza com sucesso!")
    }
    public async listarRegistros(cpf): Promise<Agendamentos[]> {
        return await this.repo.listarRegistros(cpf)
    }
    public async deletarAgendamentoPorID(id: number, cpf: string) {
        const agendamentos = await this.listarRegistros(cpf);


        if (agendamentos.length === 0) {
            console.log("Nenhum agendamento encontrado para este CPF.");
            return;
        }


        const idsPermitidos = await Promise.all(agendamentos.map(async a => await a.pegarId()));


        if (!idsPermitidos.includes(id)) {
            console.log("O ID inserido não é compatível com os exibidos!");
            return;
        }
        await this.repo.deletarAgendamentoPorID(id);

    }

    public async deletarAgendamento(cpf: string, id: number): Promise<void> {
        if (!await this.verificarCpf(cpf)) {
            console.log("CPF inexistente!");
            return;
        }

        let agendamentos = await this.listarRegistros(cpf);

        if (agendamentos.length === 0) {
            console.log("Nenhum agendamento encontrado para este CPF.");
            return;
        }


        const agendamento = agendamentos.find(async a => await a.pegarId() === id);

        if (!agendamento) {
            console.log("ID inválido! Operação cancelada.");
            return;
        }
        else {
            await this.repo.deletarAgendamentoPorID(id);
            console.log(`Agendamento ID ${id} deletado com sucesso!`)
        }
    }


}

