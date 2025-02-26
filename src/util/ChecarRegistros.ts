import { Pool } from "pg";
import { Database } from "../repository/DataBase";

export class ChecarRegistros{
    private pool: Pool
    constructor(){
        this.pool = Database.iniciarConexao()
    }
    public async verificar
}