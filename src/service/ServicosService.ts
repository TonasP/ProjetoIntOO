import { promises } from "dns";
import { Servicos } from "../entity/Servicos";
import { ServicosRepository } from "../repository/ServicosRepository";
export class ServicosService{
    private repo: ServicosRepository
    constructor(){
        this.repo= new ServicosRepository()
    }
    async listarServicos():Promise<Servicos[]>{
       return await this.repo.listarServicos()
    }
    async verificarId(id){
        let lista: Servicos[] = []
                lista = await this.repo.buscarID(id)
                return lista.length > 0;
                //Caso o ID exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    async buscarID(id): Promise<Servicos[]>{
        let lista: Servicos[]= []
        lista = await this.repo.buscarID(id)

        if (lista.length==0){
            throw new Error("Serviço não encontrado!")
        }
        else{
            return lista
        }
        

    }
    async inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico){
        await this.repo.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico)
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
    public async deletarServicos(id) {
        if (!await this.verificarId(id)) {
            console.log("O ID inserido não foi encontrado!")
        }
        await this.repo.deletarPagamento(id)
        console.log("Cliente deletado com sucesso!")
    }

}
