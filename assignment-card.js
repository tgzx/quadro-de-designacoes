function showLoading() {
    document.getElementById('loadingSection').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingSection').style.display = 'none';
}

function search() {
    let nome = document.getElementById('inputName').value;

    if (nome !== "" && nome !== undefined) {
        hideSection('loginSection');
        showSection('assigmentsSection');
        document.getElementById('inputName').value = "";
    } else {
        alert("Por favor, digite seu nome antes de buscar.");
    }
}

function backButton(actual, before) {
    hideSection(actual);
    showSection(before);
}

function hideSection(section){
    document.getElementById(section).style.display = 'none';
    showLoading();
}

function showSection(section){
    setTimeout(function() {
        document.getElementById(section).style.display = 'block';
        hideLoading();
    }, 1500);
}