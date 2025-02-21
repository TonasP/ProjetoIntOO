export class Cliente {
    private id: number
    private nome: string
    private email: string
    private cpf: string
    private data_nascimento: Date
    private plano_id: Number
    private numero_celular: string
    constructor(id: number, nome: string, email: string, cpf: string, data_nascimento: Date, plano_id: number, numero_celular: string) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
        this.plano_id = plano_id;
        this.numero_celular = numero_celular;
    }
}
