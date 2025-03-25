import { promises } from "dns";
import { Servicos } from "../entity/Servicos";
import { ServicosRepository } from "../repository/ServicosRepository";
import { ServicosDTO } from "../entity/ServicosDTO";
export class ServicosService{
    private repo: ServicosRepository
    constructor(){
        this.repo= new ServicosRepository()
    }
    async listarServicos():Promise<ServicosDTO[]>{
       return await this.repo.listarServicos()
    } 
    async verificarId(id){
        let lista = await this.repo.buscarID(id)
                
                return lista.length > 0;
                //Caso o ID exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    async buscarID(id): Promise<ServicosDTO[]>{
        let lista = await this.repo.buscarID(id)

        if (lista.length==0){
            console.log("Serviço não encontrado!")
            return []
        }
        else{
            return lista
        }
        

    }
    async verificarCpf(cpf): Promise<boolean> {
            let lista: Servicos[] = []
            lista = await this.repo.verificarCpf(cpf)
            return lista.length > 0;
            //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
        }
    public async listarRegistros(cpf): Promise<Servicos[]> {
            return await this.repo.listarRegistros(cpf)
        }
    async inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico){
        await this.repo.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico)
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
        const colunasPermitidas = ['data_servico', 'tipo_servico']
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
        if (!await this.verificarCpf(cpf)) {
            console.log("CPF inexistente!");
            return;
        }

        let servico = await this.listarRegistros(cpf);

        if (servico.length === 0) {
            console.log("Nenhum serviço encontrado para este CPF.");
            return;
        }


        const  servicos = servico.find(async a => await a.pegarId() === id);

        if (!servicos) {
            console.log("ID inválido! Operação cancelada.");
            return;
        }
        else {
            await this.repo.deletarServicoPorID(id);
            console.log(`Serviço ID ${id} deletado com sucesso!`)
        }
    }

}
