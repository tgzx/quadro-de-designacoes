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

// Verifica se o usuário está usando o modo escuro
// const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

document.addEventListener('DOMContentLoaded', function() { // como se fosse o ConnectedCallBack
    // Código a ser executado quando o DOM estiver completamente carregado
    console.log('O DOM foi completamente carregado.');  
    // Verifique a cor do cartão e inverte as cores do loading se necessário.
    checkCardColor();
});
  
function checkCardColor() {
    const card = document.querySelector('.card-principal');
    const loadingImage = document.getElementById('loadingImage');
  
    if (card) {
        // Obtenha a cor de fundo do cartão
      const cardColor = getComputedStyle(card).backgroundColor;  
      console.log('Cor do cartão:', cardColor);  
      // Verifique se a cor do cartão é diferente de branco (#ffffff)
      if (cardColor !== 'rgb(255, 255, 255)') {
            // Inverte as cores do loading com base no modo escuro
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            loadingImage.style.filter = prefersDarkMode ? 'invert(1)' : 'invert(0)';
        }
    }
}