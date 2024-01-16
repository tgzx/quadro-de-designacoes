let isLoading = false;

function showLoading() {
    document.getElementById('loadingSection').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingSection').style.display = 'none';
}

function buscar() {
    let nome = document.getElementById('inputName').value;

    if (nome !== "" && nome !== undefined) {
        document.getElementById('loginSection').style.display = 'none';
        showLoading();
        setTimeout(function() {
            hideLoading();
            document.getElementById('assigmentsSection').style.display = 'block';
        }, 1500);
    } else {
        alert("Por favor, digite seu nome antes de buscar.");
    }
}

function backButton(actual, before) {
    document.getElementById(actual).style.display = 'none';
    showLoading();
    setTimeout(function() {
        hideLoading();
        document.getElementById(before).style.display = 'block';
    }, 1500);
}
