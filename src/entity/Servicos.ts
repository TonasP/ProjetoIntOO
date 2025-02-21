export class Servicos{
    private id :number
    private id_funcionario: number
    private id_cliente: number
    private tipo_servico: string
    private data_servico: Date
    constructor(id: number,id_funcionario: number,id_cliente: number,tipo_servico: string,data_servico: Date) {
        this.id = id;
        this.id_funcionario = id_funcionario;
        this.id_cliente = id_cliente;
        this.tipo_servico = tipo_servico;
        this.data_servico = data_servico;
    }
}