
interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}


//cria uma constate para não precisar ficar escrevendo querySelector
(function(){
    const $ = (query:string): HTMLInputElement | null => document.querySelector(query);

    //calcula o tempo que o carro permaneceu no estacionamento
    function calcTempo(mil: number){
        const min = Math.floor(mil/60000);
        const sec = Math.floor((mil%60000)/1000);

        return `${min}m e ${sec}s`;
    }

    //função com todas as funções utilizadas para o estacionamento
    function patio(){

        //Le os dados passados que serão salvos no localStorage
        function ler(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        //Salva os dados dos carros no localStorage
        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        //Adiciona o veículo ao patio, inserindo uma linha na tabela
        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement('tr')
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class='delete'  data-placa = "${veiculo.placa}">
                    X
                </button>
            </td>
          `;

          row.querySelector(".delete")?.addEventListener("click", function(){
              remover(this.dataset.placa);
          })
          $('#patio')?.appendChild(row);

        //Verifica se já foi salvo e se não salva o novo veículo junto ao array com os anteriores 
          if(salva){
            salvar([...ler(), veiculo])
          }          
        }

        //verifica se o veículo está no patio e remove, também calcula o tempo de permanência
        function remover(placa: string){
            const {entrada, nome} = ler().find((veiculo) => veiculo.placa === placa)
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if(
                !confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar`))
            return;

            //se remover o veiculo vai buscar apenas os veículos nào removidos e renderizar na página
            salvar(ler().filter(veiculo =>veiculo.placa !== placa))
            render();
        }

        //renderiza os dados dos veículos salvos na tela
        function render(){
           $("#patio")!.innerHTML=""
            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return {ler, adicionar, remover, salvar, render}
    }

    patio().render();


    //captura os dados de nome e placa ao clicar no botão cadastrar
    $('#cadastrar')?.addEventListener('click', ()=>{
        const nome = $('#nome')?.value;
        const placa = $('#placa')?.value;

        //Verifica caso algum campo esteja em branco e retorna um alerta
        if(!nome || !placa){
            alert('Os campos nome e placa são obrigatórios')
            return
        }

        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true)
    })
})()