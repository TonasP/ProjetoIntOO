import { Pool } from "pg";
import { Pagamentos } from "../entity/Pagamentos";
import { PagamentosRepository } from "../repository/PagamentosRepository";
import { Database } from "../repository/DataBase";
import { PagamentosDTO } from "../entity/PagamentosDTO";
import { InadimplentesDTO } from "../entity/InadimplentesDTO";
import { ServicosService } from "./ServicosService";
import { PlanosService } from "./PlanosService";

export class PagamentosService {
    private plano: PlanosService
    private servico: ServicosService
    private repo: PagamentosRepository
    constructor() {
        this.plano = new PlanosService()
        this.servico = new ServicosService()
        this.repo = new PagamentosRepository()
    }

    async listarPagamentos(): Promise<PagamentosDTO[]> {
        return await this.repo.listarPagamentos()
    }
    async listarPagamentosEspecificos(cpf) {
        return await this.repo.listarPagamentosEspecificos(cpf)
    }
    async verificarId(id): Promise<boolean> {
        let lista = await this.repo.buscarPorCpf(id)
        return lista.length > 0;
        //Caso o ID exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    async buscarPorCpf(id): Promise<PagamentosDTO[]> {
        let lista = await this.repo.buscarPorCpf(id)
        if (lista.length == 0) {
            console.log("Pagamento não encontrado")
            return []
        }
        else {
            return lista
        }
    }
    async verificarCpf(cpf): Promise<boolean> {
        let lista: Pagamentos[] = []
        lista = await this.repo.verificarCpf(cpf)
        return lista.length > 0;
        //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    public async listarRegistros(cpf): Promise<Pagamentos[]> {
        return await this.repo.listarRegistros(cpf)
    }


    async inserirPagamento(id_servico: Number, forma_pagamento: string) {
        const formasPagamento = ["Pix", "Debito", "Credito", "Dinheiro"]
        let planoCliente= await this.servico.pegarPlanoCliente(id_servico)
        let pegarValorPlano = await this.plano.pegarValor(planoCliente.plano_id);

        if (!pegarValorPlano) {
            console.log("Erro: Não foi possível recuperar o valor do plano.");
            return;
        }

        let valorPlano = pegarValorPlano;
        
        let converter = parseInt(forma_pagamento)
        let indiceFormaPagamento = converter - 1
        if (indiceFormaPagamento < 0 || indiceFormaPagamento >= formasPagamento.length) {
            console.log("Erro: Forma de pagamento inválida!");
            return;
        }
        let selecionarFormaPagamento = formasPagamento[indiceFormaPagamento]
        const servicos = [
            { nome: "Aula de Musculação", valor: 50 },
            { nome: "Consulta Nutricional", valor: 105 },
            { nome: "Avaliação Física", valor: 40 },
            { nome: "Assinatura de plano", valor: pegarValorPlano }
        ]
        let tabelaServico = await this.servico.listarTipoServico(id_servico)
        const servico = servicos.find(s => s.nome === tabelaServico.tipo_servico);
        
        if (!servico) {
            console.log("Serviço inexistente!")
            return
        }
        if (id_servico)
            if (!formasPagamento.includes(selecionarFormaPagamento)) {
                console.log("Forma de pagamento não inclusa!")
                return
            }
        
        const valor = servico.valor
        await this.repo.inserirPagamento(id_servico, valor, selecionarFormaPagamento)
        console.log(`Pagamento de valor R$${valor} efetuado com sucesso via ${selecionarFormaPagamento}`)
    }
    public async atualizarPagamentoPorID(id: number, coluna: string, novoValor: string) {
        const colunasPermitidas = ['forma_pagamento', 'valor_total'];

        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna inválida! Atualização cancelada.");
            return;
        }

        await this.repo.atualizarPagamentoPorID(id, coluna, novoValor);
    }
    async atualizarInformacoes(coluna, registro, id) {
        const colunasPermitidas = ['valor_total', 'forma_pagamento']
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna não permitida!")
            return
        }
        if (!await this.verificarId(id)) {
            console.log("Cpf não encontrado!")
            return
        }
        if (!registro) {
            console.log("Registros nulos não são permitidos")
            return
        }
        await this.repo.atualizarInformacoes(coluna, registro, id)
        console.log("Atualização realiza com sucesso!")
    }
    public async deletarPagamentoPorID(id: number, cpf: string) {
        const pagamentos = await this.listarRegistros(cpf);


        if (pagamentos.length === 0) {
            console.log("Nenhum Pagamento encontrado para este CPF.");
            return;
        }


        const idsPermitidos = await Promise.all(pagamentos.map(async a => await a.pegarId()));


        if (!idsPermitidos.includes(id)) {
            console.log("O ID inserido não é compatível com os exibidos!");
            return;
        }
        await this.repo.deletarPagamentoPorID(id);

    }

    public async deletarPagamento(cpf: string, id: number): Promise<void> {
        if (!await this.verificarCpf(cpf)) {
            console.log("CPF inexistente!");
            return;
        }

        let pagamento = await this.listarRegistros(cpf);

        if (pagamento.length === 0) {
            console.log("Nenhum Pagamento encontrado para este CPF.");
            return;
        }


        const pagamentos = pagamento.find(async a => await a.pegarId() === id);

        if (!pagamentos) {
            console.log("ID inválido! Operação cancelada.");
            return;
        }
        else {
            await this.repo.deletarPagamentoPorID(id);
            console.log(`Pagamento ID ${id} deletado com sucesso!`)
        }
    }

    public async visualizarInadimplentes(): Promise<InadimplentesDTO[]> {
        return await this.repo.visualizarInadimplentes()

    }



} 
