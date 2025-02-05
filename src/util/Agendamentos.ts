export class Agendamentos{
    static dataAtual: Date = new Date()
    private id: number
    private cliente : string
    private funcionario : string
    private tipoAgendamento: string

    constructor(id: number, cliente: string, funcionario: string, tipoAgendamento: string) {
        this.id = id;
        this.cliente = cliente;
        this.funcionario = funcionario;
        this.tipoAgendamento = tipoAgendamento;
    }
    public criarAgendamento(dataDesejada: Date): void {
        
    }
    public desmarcarAgendamento(): void {
    
    }
    public alterarTipo(novoTipo: string): void {
    
    }
    public detalhesAgendamento(): string {
        return``
    }


}