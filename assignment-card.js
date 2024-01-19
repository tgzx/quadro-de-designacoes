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
        hideElement('loginSection');
        showElement('assigmentsSection');
        showElement('buttonBack');
        document.getElementById('inputName').value = "";
    } else {
        alert("Por favor, digite seu nome antes de buscar.");
    }
}

function backButton(actual, before) {
    hideElement(actual);
    showElement(before);

    if(before === 'loginSection'){
        hideElement('buttonBack');
    }
}

function hideElement(element){
    document.getElementById(element).style.display = 'none';
    showLoading();
}
function showElement(element){
    setTimeout(function() {
        document.getElementById(element).style.display = 'block';
        hideLoading();
    }, 1500);
}
function changeTextById(elementId, newText) {
    const element = document.getElementById(elementId);
    if (element) {
        // Atualiza o conteúdo de texto do element
        element.textContent = newText;
    } else {
        console.error(`Elemento com ID '${elementId}' não encontrado.`);
    }
}
function changeCSSById(elementId, styleProperty, value) {
    const element = document.getElementById(elementId);

    if (element) {
        // Atualiza a propriedade de estilo do elemento
        element.style[styleProperty] = value;
    } else {
        console.error(`Elemento com ID '${elementId}' não encontrado.`);
    }
}

document.addEventListener('DOMContentLoaded', function() { // como se fosse o ConnectedCallBack
    console.log('O DOM foi completamente carregado.');  
    showElement('loginSection');
    // Carrega a preferência de tema salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Se não houver preferência salva, aplica o tema com base na escolha do navegador
        updateDarkMode();
    }

    // Função para aplicar o tema
    function applyTheme(theme) {
        const loadingImage = document.getElementById('loadingImage');
        const body = document.getElementById('htmlBody');
        const buttonDarkMode = document.getElementById('buttonDarkMode');

        if (theme === 'dark') {
            // Aplica o tema escuro
            changeTextById('buttonDarkMode', '☽');
            changeCSSById('buttonDarkMode', 'padding', '1px 8px 2px 8px');
            prefersDarkMode = true;

            loadingImage.style.filter = 'invert(0.86)';
            body.style.backgroundColor = '#0f1114';
        } else {
            // Aplica o tema claro
            changeTextById('buttonDarkMode', '☀');
            changeCSSById('buttonDarkMode', 'padding', '1px 5px 2px 5px');
            prefersDarkMode = false;

            loadingImage.style.filter = 'invert(0)';
            body.style.backgroundColor = '#625298';
        }

        // Atualiza o tema para outros elementos
        const cards = document.querySelectorAll('.card, .standard-color, .body-standard-text, .principal-title, .input-name');
        cards.forEach(card => {
            if (theme === 'dark') {
                darkMode(card);
            } else {
                lightMode(card);
            }
        });
    }

    // Função para alternar entre temas
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme === 'dark') {
            localStorage.setItem('theme', 'light');
            applyTheme('light');
        } else {
            localStorage.setItem('theme', 'dark');
            applyTheme('dark');
        }
    }

    // Adiciona um evento de clique ao botão de tema
    const buttonDarkMode = document.getElementById('buttonDarkMode');
    if (buttonDarkMode) {
        buttonDarkMode.addEventListener('click', toggleTheme);
    }
});
  
function updateDarkMode() {
    //verifica se o navegador esta no modo escuro
    const loadingImage = document.getElementById('loadingImage');
    const body = document.getElementById('htmlBody');

    //const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let prefersDarkMode = null;

    const card = document.querySelector('.card');

    if(getComputedStyle(card).backgroundColor == 'rgb(35, 37, 38)'){
        changeTextById('buttonDarkMode', '☀');
        changeCSSById('buttonDarkMode', 'padding', '1px 5px 2px 5px');
        prefersDarkMode = false;
    } else {
        changeTextById('buttonDarkMode', '☽');
        changeCSSById('buttonDarkMode', 'padding', '1px 8px 2px 8px');
        prefersDarkMode = true
    }

    loadingImage.style.filter = prefersDarkMode ? 'invert(0.86)' : 'invert(0)';
    body.style.backgroundColor = prefersDarkMode ? '#0f1114' : '#625298';
  
    const cards = document.querySelectorAll('.card, .standard-color, .body-standard-text, .principal-title, .input-name');
    console.log('cards=> ' + JSON.stringify(cards));
    cards.forEach(card => {
            if(prefersDarkMode == true){
                darkMode(card);
            } else {
                lightMode(card);
            }
        }
    );
}

function darkMode(card){
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
}
function lightMode(card){
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