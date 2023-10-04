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

                    var apiKey = '85765be5edbd4077b82457da5329452b';
                    var endereco = data.logradouro + ", " + data.localidade + ", " + data.uf + ", " + "Brasil";

                    $.ajax({
                        url: 'https://api.opencagedata.com/geocode/v1/json',
                        data: {
                            q: endereco,
                            key: apiKey
                        },
                        success: function (dataGeoCod) {
                            if (dataGeoCod.results.length > 0) {
                                var latitude = dataGeoCod.results[0].geometry.lat;
                                var longitude = dataGeoCod.results[0].geometry.lng;
                                
                                // Initialize and add the map
                                let map;

                                async function initMap() {
                                    // The location of Uluru
                                    const position = { lat: latitude, lng: longitude };
                                    // Request needed libraries.
                                    //@ts-ignore
                                    const { Map } = await google.maps.importLibrary("maps");

                                    // The map, centered at Uluru
                                    map = new Map(document.getElementById("map"), {
                                        zoom: 15,
                                        center: position,
                                        mapId: "DEMO_MAP_ID"
                                    });

                                    // O marcador, posicionado nas coordenadas obtidas pela geocodificação
                                    const marker = new google.maps.Marker({
                                        map: map,
                                        position: position,
                                        title: data.localidade
                                    });
                                    $('#map-container').show();
                                }

                                initMap();
                            } else {
                                $('#map-container').hide();
                            }
                        },
                        error: function () {
                            $('#map-container').hide();
                        }
                    });
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
    $('#map-container').hide();
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

