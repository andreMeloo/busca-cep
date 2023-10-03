const TAMANHO_CEP = 8;
let mensagemErro = "";

$(document).ready(() => {
    fechaErro();
    let campoCep = $('#cep');
    // Máscara para o CEP
    campoCep.inputmask('99999-999');

    // Função de click do botão
    $('#find-button').click(function (e) { 
        fechaErro();
        let valorCep = campoCep.val().replace(/\D/g, "");
    
        if (!validaDadosCEP(valorCep)) {
            return;
        }

        $.get("https://viacep.com.br/ws/" + valorCep + "/json/",
            function (data, textStatus, jqXHR) {
                if (!("erro" in data)) { // Verifica se não há a propriedade "erro" no objeto
                    $('#logradouro').val(data.logradouro);
                    $('#complemento').val(data.complemento);
                    $('#bairro').val(data.bairro);
                    $('#municipio').val(data.localidade);
                    $('#uf').val(data.uf);
                } else {
                    mensagemErro = "Nenhum endereço localizado com o CEP informado.";
                    ativaErro(mensagemErro);
                    limparCamposForm();
                }
            }
        );
    });

    $('#exit-msg').click( () => {
        fechaErro();
    } )
})

function validaDadosCEP(valorCep) {
    if (valorCep == null || valorCep == "") {
        mensagemErro = "Campo 'CEP' é obrigatório."
        ativaErro(mensagemErro);
        limparCamposForm();
        return false;
    }

    if (valorCep.length < TAMANHO_CEP) {
        mensagemErro = "Valor do CEP invalido."
        ativaErro(mensagemErro);
        limparCamposForm();
        return false;
    } 

    return true;
}

function ativaErro(msg) {
    $('#msgErro').text(msg);
    $('#blocoErros').show();
}

function fechaErro() {
    $('#msgErro').text("");
    $('#blocoErros').hide();
}

function limparCamposForm() {
    $('#logradouro').val("")
    $('#complemento').val("")
    $('#bairro').val("")
    $('#municipio').val("")
    $('#uf').val("")
}

