export class Agendamentos{
    private id: number
    private id_cliente: number
    private id_funcionario: number
    private data_marcada: Date
    private tipo: string

    constructor( id: number, id_cliente: number, id_funcionario: number, data_marcada: Date, tipo: string) {
        this.id = id;
        this.id_cliente = id_cliente;
        this.id_funcionario = id_funcionario;
        this.data_marcada = data_marcada;
        this.tipo = tipo;
    }
}