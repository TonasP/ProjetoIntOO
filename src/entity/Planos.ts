export class Planos{
    private id :number 
    private nome : string 
    public valor: number

    constructor(id: number, nome: string, valor: number) {
        this.id = id;
        this.nome = nome;
        this.valor = valor;
    }
    public  pegarID(){
        return this.id
    }
    public  getValor(): number{
        return this.valor
    }
}