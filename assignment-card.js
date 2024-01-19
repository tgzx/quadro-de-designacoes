//changeTextById('week-info', semanaInfo);

today = null;

function showLoading() {
    document.getElementById('loadingSection').style.display = 'block';
}
function hideLoading() {
    document.getElementById('loadingSection').style.display = 'none';
}

function search() {
    let name = document.getElementById('inputName').value;

    if (name !== "" && name !== undefined) {
        hideElement('loginSection');
        showElement('assigmentsSection');
        showElement('buttonBack');
        readBD(name);
        document.getElementById('inputName').value = "";
    } else {
        alert("Por favor, digite seu nome antes de buscar.");
    }
}

function backButton(home) {
    hideElement('assigmentsSection');
    hideElement('feedDataSection');
    showElement(home);

    if(home === 'loginSection'){
        hideElement('buttonBack');
        changeTextById('meioDeSemana-assignment', 'Nenhuma designação encontrada.'); 
        changeTextById('fimDeSemana-assignment', 'Nenhuma designação encontrada.');
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
        element.innerHTML = newText;
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

function readBD(name) {
    const bdJSONPath = 'data/bd.json';
    let bdJSON = {};

    fetch(bdJSONPath)
    .then(response => response.json())
    .then(data => {
        console.log('Conteúdo do bdJSON:');
        console.log(data);

        // Iterar sobre as designações semanais
        data.weeklyAssignments.forEach(assign => {
            // Converter a string de data para um objeto Date
            const datePresWork = new Date(stringToDate(assign.date));
            console.log('datePresWork => ' + datePresWork);
        
            // Verificar se a data atual está na mesma semana da data da designação
            if (sameWeek(today, datePresWork)) {
                console.log(`A data atual ${today.toDateString()} está na mesma semana da designação em ${datePresWork.toDateString()}`);
            } else {
                console.log(`A data atual ${today.toDateString()} não está na mesma semana da designação em ${datePresWork.toDateString()}`);
            }
        });

        bdJSON = data.weeklyAssignments;

        console.log('bdJSON => ' + JSON.stringify(bdJSON));
        
        let nameFound = false;

        bdJSON.forEach(week => {
            console.log('week => ' + JSON.stringify(week));
            if (stringToDate(week.date) >= today) {
                week.presenters.forEach(presenter => {
                    if(presenter.name === name){
                        nameFound = true;
                        let designationsMiddleWeek = '';
                        let designationsEndWeek = '';
                        presenter.presentations.forEach(presentation => {                            
                            if(presentation.meetId === 'meioDeSemana'){
                                designationsMiddleWeek = designationsMiddleWeek + presentation.name;

                                if (presentation.lesson) {
                                    designationsMiddleWeek += ' - ' + presentation.lesson;
                                }
                                designationsMiddleWeek += '<br>';
                            }
                            if(presentation.meetId === 'fimDeSemana'){
                                designationsEndWeek = designationsEndWeek + presentation.name;

                                if (presentation.lesson) {
                                    designationsEndWeek += ' - ' + presentation.lesson;
                                }
                                designationsEndWeek += '<br>';
                            }
                        })
                        presenter.works.forEach(work => {
                            if(work.meetId === 'meioDeSemana'){
                                designationsMiddleWeek = designationsMiddleWeek + ' ' + work.name + '<br>';
                            }
                            if(work.meetId === 'fimDeSemana'){
                                designationsEndWeek = designationsEndWeek + ' ' + work.name + '<br>';
                            }
                        })

                        changeTextById('meioDeSemana-assignment', designationsMiddleWeek); 
                        changeTextById('fimDeSemana-assignment', designationsEndWeek);
                    }
                })
            }
        });

        if(!nameFound){
            alert(`Não foi encontrado uma designação para "${name}".`);
        }
    })
    .catch(error => 
        console.error('Erro ao carregar o arquivo JSON:', error)
    );
}
function sameWeek(date1, date2) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // milissegundos em uma semana
    const diff = Math.abs(date1 - date2);
  
    return diff < oneWeek;
}
function stringToDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10); // Mês no JavaScript é baseado em zero
    const year = parseInt(parts[2], 10);
  
    return new Date(year, month, day);
}
function dateFormatter(data) {
    const months = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];
    const day = data.getDate();
    const weekDayIndex = data.getDay();
    const monthName = months[data.getMonth()];

    // Calcula o primeiro e último dia da semana
    const firstWeekDay = day - weekDayIndex + 1;
    const lastWeekDay = firstWeekDay + 6;

    return `Semana ${firstWeekDay}-${lastWeekDay} de ${monthName}`;
}

document.addEventListener('DOMContentLoaded', function() { // como se fosse o ConnectedCallBack
    console.log('O DOM foi completamente carregado.');
    showElement('loginSection');
    today = new Date();
    changeTextById('week-info', dateFormatter(today));
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
            //changeCSSById('buttonDarkMode', 'padding', '2px 9px 4px 9px');
            prefersDarkMode = true;

            loadingImage.style.filter = 'invert(0.86)';
            body.style.backgroundColor = '#0f1114';
        } else {
            // Aplica o tema claro
            changeTextById('buttonDarkMode', '☀');                //C   D   B    E
            //changeCSSById('buttonDarkMode', 'padding', '3px 7px 4px 7px');
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
        //changeCSSById('buttonDarkMode', 'padding', '1px 5px 2px 5px');
        prefersDarkMode = false;
    } else {
        changeTextById('buttonDarkMode', '☽');
        //changeCSSById('buttonDarkMode', 'padding', '1px 8px 2px 8px');
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

function adminLogin(){
    var username = prompt("Digite seu nome de usuário:");
    var password = prompt("Digite sua senha:");
    
    if (username === "admin" && password === "2024") {
      alert("Login bem-sucedido!");
      hideElement('loginSection');
      showElement('feedDataSection');
      showElement('buttonBack');
    } else {
      alert("Login ou senha incorretos. Tente novamente.");
    }
}