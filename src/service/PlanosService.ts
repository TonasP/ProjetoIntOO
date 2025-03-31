import { Planos } from "../entity/Planos";
import { PlanosRepository } from "../repository/PlanosRepository";

export class PlanosService {
    private repo: PlanosRepository

    constructor() {
        this.repo = new PlanosRepository()
    }
    async listarPlanos(): Promise<Planos[]> {
        return await this.repo.listarPlanos()
    }
    async verificarId(id): Promise<boolean> {
        let lista: Planos[] = []
        lista = await this.repo.buscarID(id)
        return lista.length > 0;
        //Caso o ID exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    async pegarValor(id): Promise<number | void> {
        if (!id) {
            console.log("ID de plano inválido!");
            return;
        }
    
        const resultado = await this.repo.pegarValor(id);
    
        if (!resultado || resultado.length === 0) {
            console.log("Erro: Nenhum valor encontrado para o plano.");
            return;
        }
    
        return resultado[0].valor; 
    }
    
    async atualizarInformacoes(coluna, registro, id) {
        const colunasPermitidas = ['nome', 'valor']
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna não permitida!")
            return
        }
        if (!await this.verificarId(id)) {
            console.log("ID não encontrado!")
            return
        }
        if (!registro) {
            console.log("Registros nulos não são permitidos")
            return
        }
        await this.repo.atualizarInformacoes(coluna, registro, id)
        console.log("Atualização realiza com sucesso!")
    }
    public async deletarPlano(id) {
        if (!await this.verificarId(id)) {
            console.log("O ID inserido não foi encontrado!")
        }
        await this.repo.deletarPlano(id)
        console.log("Plano deletado com sucesso!")
    }
    public async inserirPlano(nome:string,valor:number){
        if (!nome){
            console.log("O plano deve ter um nome!")
            return
        }
        if (!valor || valor<= 0){
            console.log("O valor deve ter um valor maior que zero!")
            return
        }
        else{
            await this.repo.inserirPlano(nome, valor)
            console.log("Plano inserido com sucesso!")
        }

    }
}