var enderecoContrato = "0x25C2b38766f4b6E57B1029360F5796a0C8459d1d";
var provedor = new ethers.providers.Web3Provider(web3.currentProvider);
ethereum.enable();
var signatario = provedor.getSigner();
var contrato = new ethers.Contract(enderecoContrato, abiContrato, signatario);

function registrarMudancaStatus() {
    var textoCampo = document.frmStatus.txtStatusPagamentoAluguel.value;
    var caixaStatusTx = document.getElementById("caixaStatusTx");
    if (textoCampo.length === 8) {
        caixaStatusTx.innerHTML = "Enviando transação...";
        contrato.mudaStatusPagamento(textoCampo)
        .then( (transacao) => {
            console.log("registrarMudancaStatus - Transacao ", transacao);   
            caixaStatusTx.innerHTML = "Transação enviada. Aguardando processamento...";
            transacao.wait()
            .then( (resultado) => {
                buscaStatusContrato();
                caixaStatusTx.innerHTML = "Transação realizada.";
            })        
            .catch( (err) => {
                console.error("registrarMudancaStatus - Aguardando tx ser minerada");
                console.error(err);
                caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
            })
        })
        .catch( (err) => {
            console.error("registrarMudancaStatus");
            console.error(err);
            caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
        })
    }
}

function buscaStatusContrato() {
    var status;
    var campoStatus = document.getElementById("campoStatus");     
    contrato.statusPagamentoAluguel()
    .then( (resultado) => {
        campoStatus.innerHTML = resultado;
    })
    .catch( (err) => {
        console.error(err);
        campoStatus.innerHTML = err;
    });
}

function encerrarContrato()
{
    var textoEncerrar = document.getElementById("encerrarContratoTx");

    textoEncerrar.innerHTML="conectando para encerramento de contrato ...";
    contrato.fimDoContrato()
    .then( (transacao)=>
    {
            console.log("encerrarContrato - Transacao", transacao);
            textoEncerrar.innerHTML="aguarde encerrando o contrato ...";
        
            transacao.wait()
            .then((resultado)=>
            {
                buscaFimContrato();
            })
            .catch((err) =>
            {
                console.error("encerrarContrato - Aguardando tx ser minerada");
                console.error(err);
                textoEncerrar.innerHTML="erro ao se conectar ...";
            })
     })
     .catch((err)=>
     {
            console.error("encerrarContrato - Aguardando tx ser minerada");
            console.error(err);
            textoEncerrar.innerHTML="erro ao se conectar ...";
     })
}

function buscaFimContrato() {
    var status;
    var campoStatus = document.getElementById("encerrarContratoTx");     
    contrato.contratoAtivo()
    .then( (resultado) => 
    {
        campoStatus.innerHTML = "contrato encerrado";
    })
    .catch( (err) => {
        console.error(err);
        campoStatus.innerHTML = err;
    });
}
