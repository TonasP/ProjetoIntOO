
import { Planos } from "../entity/Planos";
import { Database } from "./DataBase";
import { Pool } from "pg";

export class PlanosRepository {
    private pool: Pool

    constructor() {
        this.pool = Database.iniciarConexao()
    }
    async listarPlanos(): Promise<Planos[]> {
        const query = 'SELECT * FROM "GymControl".planos'
        const result = await this.pool.query(query)

        const listaPlanos: Planos[] = []
        for (const row of result.rows) {
            const planos = new Planos(row.id, row.nome, row.valor)
            listaPlanos.push(planos)
        }

        return listaPlanos
    }
    async buscarID(id): Promise<Planos[]> {
        const query = 'SELECT * FROM "GymControl".planos where id = $1 ';
        const result = await this.pool.query(query, [id]);

        const listaPlanos: Planos[] = [];

        for (const row of result.rows) {
            const plano = new Planos(row.id, row.nome, row.valor);
            listaPlanos.push(plano);
        }
        return listaPlanos;
    }
    public async atualizarInformacoes(coluna, registro, id) {
        const query = `update "GymControl".planos set ${coluna} =$1  where id = $2`
        const result = await this.pool.query(query, [registro, id])
    }
    public async deletarPagamento(id) {
        const query = `delete from "GymControl".pagamentos where id = $1`
        const result = await this.pool.query(query, [id])
    }



}


