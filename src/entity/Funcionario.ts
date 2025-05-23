export class Funcionario{
    private id : number
    private nome: string
    private cpf: string
    private data_nascimento: Date
    private funcao: string
    private numero_celular: string
    private email: string
    private situacao_empregado : string

    constructor(id: number, nome: string, cpf: string, data_nascimento: Date, funcao: string, numero_celular: string, email: string, situacao_empregado: string) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
        this.funcao = funcao;
        this.numero_celular = numero_celular;
        this.email = email;
        this.situacao_empregado = situacao_empregado
    }
    public async pegarSituacao(){
        return this.situacao_empregado
    }

}