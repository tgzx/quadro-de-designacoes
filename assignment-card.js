isLoading;

function buscar() {
    let nome = document.getElementById('inputName').value;

    if (nome !== "" && nome !== undefined) {
        document.getElementById('loginSection').style.display = 'none';

        isLoading = true;

        setTimeout(function() {
            document.getElementById('assigmentsSection').style.display = 'block';
            isLoading = false;
        }, 500);
    } else {
        alert("Por favor, digite seu nome antes de buscar.");
    }
}

function backButton(actual, before) {
    document.getElementById(actual).style.display = 'none';

    isLoading = true;

    setTimeout(function() {
        document.getElementById(before).style.display = 'block';
        isLoading = false;
    }, 500); // Adicionando um atraso de 500 milissegundos (0,5 segundos)
}
