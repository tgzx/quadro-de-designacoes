//changeTextById('week-info', semanaInfo);

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
function changeTextById(elementId, newText) {
    // Obtém a referência para o elemento com base no ID
    const element = document.getElementById(elementId);

    // Verifica se o element foi encontrado
    if (element) {
        // Atualiza o conteúdo de texto do element
        element.textContent = newText;
    } else {
        console.error(`Elemento com ID '${elementId}' não encontrado.`);
    }
}

document.addEventListener('DOMContentLoaded', function() { // como se fosse o ConnectedCallBack
    // Código a ser executado quando o DOM estiver completamente carregado
    console.log('O DOM foi completamente carregado.');  
    // de tempos em tempos ele verifica o tema do navegador para trocar o tema do quadro juntamente
    updateDarkMode();
    setInterval(() => {
        console.log('Dark mode');
        updateDarkMode();
    }, 600);
});
  
function updateDarkMode() {
    //verifica se o navegador esta no modo escuro
    const loadingImage = document.getElementById('loadingImage');
    const body = document.getElementById('htmlBody');

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    loadingImage.style.filter = prefersDarkMode ? 'invert(0.86)' : 'invert(0)';
    body.style.backgroundColor = prefersDarkMode ? '#0f1114' : '#625298';

    console.log('prefersDarkMode => ' + JSON.stringify(prefersDarkMode));
  
    const cards = document.querySelectorAll('.card, .standard-color, .body-standard-text, .principal-title, .input-name');
    console.log('cards=> ' + JSON.stringify(cards));
    cards.forEach(card => {
            if(prefersDarkMode == true){
                card.style.backgroundColor = 'rgb(35, 37, 38)';

                if (card.classList.contains('principal-title')) {
                    card.style.borderBottom = '1px solid gray';
                }

                if(card.classList.contains('card')){
                    card.style.border = 'rgb(35, 37, 38)';
                }

                if(card.classList.contains('input-name')){
                    card.style.border = '1px solid #5b5b5b';
                    card.style.color = 'white';
                }

                if (card.classList.contains('body-standard-text')) {
                    card.style.color = 'white';
                } else if (card.classList.contains('standard-color')){
                    card.style.color = '#9271b7';
                }
            } else {
                card.style.backgroundColor = 'white';

                if (card.classList.contains('principal-title')) {
                    card.style.borderBottom = '1px solid gray';
                }

                if(card.classList.contains('card')){
                    card.style.border = 'white';
                }

                if(card.classList.contains('input-name')){
                    card.style.border = '1px solid black';
                    card.style.color = 'grey';
                }

                if (card.classList.contains('body-standard-text')) {
                    card.style.color = 'black';
                } else if (card.classList.contains('standard-color')){
                    card.style.color = '#330f5c';
                }
            }
        }
    );
}