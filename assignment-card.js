//changeTextById('week-info', semanaInfo);

today = null;
onlyWeekPresentation = true;
savedTheme = '';
nameFound = false;
designationsMiddleWeek = '';
designationsEndWeek = '';
waitLoadTime = 1500;
findedUser = '';


function showLoading() {
    document.getElementById('loadingSection').style.display = 'block';
}
function hideLoading() {
    document.getElementById('loadingSection').style.display = 'none';
}

function checkBoxChange(){
    const checkbox = document.getElementById('checkBoxWeek').checked;
    const checkbox2 = document.getElementById('checkBoxWeek2').checked;
    let idSectionName = getActiveSection();
    if(idSectionName === 'assigmentsSection'){
        onlyWeekPresentation = checkbox2;
        document.getElementById('checkBoxWeek').checked = checkbox2;
    } else if(idSectionName === 'loginSection'){
        onlyWeekPresentation = checkbox;
        document.getElementById('checkBoxWeek2').checked = checkbox;
    } else {
        onlyWeekPresentation = checkbox;
    }
}

function getActiveSection(){
    divsComDisplayBlock = document.querySelectorAll('div[style*="display: block"]');
    let idName = 'not found';
    divsComDisplayBlock.forEach(div => {
        idName = div.id;
    });
    return idName;
}

function search() {
    let name = document.getElementById('inputName').value;
        
    if (name !== "" && name !== undefined) {
        hideElementLoad('loginSection');
        showElementLoad('assigmentsSection');
        showElementLoad('buttonBack');
        findUser(name);
        updateUserLogged();
        document.getElementById('inputName').value = "";
    } else {
        alert("Por favor, digite seu nome antes de buscar.");
    }    
}

function findUser(name) {
    generateAccessToken();
}

function isTokenExpired(token) {
    // Verifica se o token possui a propriedade 'expires_in'
    if (!token.expires_in) {
        return true; // Se não tiver, considera-se como expirado por precaução
    }
    
    // Obtém a data de expiração do token em milissegundos
    const expirationTime = token.created_at + (token.expires_in * 1000);
    
    // Obtém a data atual em milissegundos
    const currentTime = Date.now();
    
    // Compara a data atual com a data de expiração
    return currentTime >= expirationTime;
}


function generateAccessToken() {
    const url = 'https://login.salesforce.com/services/oauth2/token?';
    const body = 'grant_type=password' +
        '&username=designacao-tiago.z.x.g@gmail.com' +
        '&password=Batata2020salesforce' +
        '&client_id=3MVG9dqyJqDc8eKQAcqTfLAZP9rbFZrQkiNpXF7J9WfN_XTa9.z6SLocXY130UULhAAMFjOt._iObBAiVsyd8' +
        '&client_secret=3084CCF545CC7412DE5B0BFC7A0A9008CC9A83B0EE59B190F8953F26B892140C';

    console.log('body', body);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao gerar token de acesso');
        } else {
            console.log('DEU CERTO ', response)
        }
        return response.json();
    })
    .then(data => data.access_token)
    .catch(error => {
        throw error;
    });
}

function getUser(name, token) {
    const url = `https://nscara5-dev-ed.develop.my.salesforce.com/services/data/v56.0/query?q=SELECT+Id,Name+FROM+Account+WHERE+Name+LIKE+'%25${name}%25'`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao consultar Salesforce');
        }
        return response.json();
    })
    .then(data => {
        console.log('Contas encontradas:', data);
        if(data.lengh === 1){
            findedUser = data.Name;
        }
        // Faça o que precisar com os dados encontrados
    })
    .catch(error => console.error('Erro na consulta ao Salesforce:', error));
}


function backButton(home) {
    hideElementLoad('assigmentsSection');
    hideElementLoad('feedDataSection');
    showElementLoad(home);

    if(home === 'loginSection'){
        hideElementLoad('buttonBack');
        showElement('adminButton');
        changeTextById('meioDeSemana-assignment', 'Nenhuma designação encontrada.'); 
        changeTextById('fimDeSemana-assignment', 'Nenhuma designação encontrada.');
        activeFocusElement('inputName', 1800);
        changeTextById('head-title', '');
    }
}

function activeFocusElement(elementId, timeDelay = 0) {
    setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
        }
    }, timeDelay);
}

function hideElementLoad(element){
    document.getElementById(element).style.display = 'none';
    showLoading();
}
function showElementLoad(element){
    setTimeout(function() {
        document.getElementById(element).style.display = 'block';
        hideLoading();
    }, waitLoadTime);
}
function hideElement(element){
    document.getElementById(element).style.display = 'none';
}
function showElement(element){
    document.getElementById(element).style.display = '';
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

function readAssignmentsBD(name) {
    const bdJSONPath = 'data/bd.json';
    let bdJSON = {};

    fetch(bdJSONPath)
    .then(response => response.json())
    .then(data => {
        //console.log('Conteúdo do bdJSON:');
        //console.log(data);

        // Iterar sobre as designações semanais
        data.weeklyAssignments.forEach(assign => {
            // Converter a string de data para um objeto Date
            const datePresWork = new Date(stringToDate(assign.date));
            //console.log('datePresWork => ' + datePresWork);
        
            // Verificar se a data atual está na mesma semana da data da designação
            // if (sameWeek(today, datePresWork)) {
            //     //console.log(`A data atual ${today.toDateString()} está na mesma semana da designação em ${datePresWork.toDateString()}`);
            // } else {
            //     //console.log(`A data atual ${today.toDateString()} não está na mesma semana da designação em ${datePresWork.toDateString()}`);
            // }
        });

        bdJSON = data.weeklyAssignments;

        //console.log('bdJSON => ' + JSON.stringify(bdJSON));

        bdJSON.forEach(week => {
            //console.log('week => ' + JSON.stringify(week));

            //console.log('data de designação => ' + stringToDate(week.date));
            //console.log('data de hoje => ' + today);
            if(onlyWeekPresentation){
                console.log('UMA SEMANA')
                if (stringToDate(week.date) >= today && sameWeek(today, stringToDate(week.date))) {
                    findDesignations(week, name);
                }
            } else {
                console.log('TODAS AS SEMANAS')
                if (stringToDate(week.date) >= today){
                    findDesignations(week, name);
                }
            }
        });

        if(!nameFound){
            alert(`Não foi encontrado uma designação para "${name}".`);
        }
        
        nameFound = false;
        designationsMiddleWeek = '';
        designationsEndWeek = '';
    })
    .catch(error => 
        console.error('Erro ao carregar o arquivo JSON:', error)
    );
}

function findDesignations(week, name){
    console.log('week.presenters' + week.presenters);
    week.presenters.forEach(presenter => {
        //console.log('lista de presenter assign: => ' + JSON.stringify(presenter));
        console.log('presenter.name === name' + presenter.name + name)
        if(presenter.name === name){
            //console.log('presenter.name => ' + presenter.name);
            //console.log('name => ' + name);
            nameFound = true;
            presenter.presentations.forEach(presentation => {                            
                if(presentation.meetId === 'meioDeSemana'){
                    //console.log('presentation meioDeSemana => ' + JSON.stringify(presentation));
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

function sameWeek(date1, date2) {
    const diffInDays = Math.abs(Math.floor((date1 - date2) / (24 * 60 * 60 * 1000)));

    // Calcula a diferença de dias para a última segunda-feira a partir de date1
    const diffDaysToMonday = date1.getDay() === 1 ? 7 : date1.getDay() - 1;
    const monday = new Date(date1);
    monday.setDate(date1.getDate() - diffDaysToMonday);
    monday.setHours(0, 0, 0, 0);

    // Calcula a diferença de dias para o próximo domingo a partir de date1
    const diffDaysToSunday = date1.getDay() === 0 ? 0 : 7 - date1.getDay();
    const sunday = new Date(date1);
    sunday.setDate(date1.getDate() + diffDaysToSunday);
    sunday.setHours(23, 59, 59, 999);

    console.log('');
    console.log('date1:', date1);
    console.log('Monday:', monday);
    console.log('---------------------------');
    console.log('date2:', date2);
    console.log('Sunday:', sunday);
    console.log('');
    
    return date1 >= monday && date2 <= sunday && diffInDays < 7;
}
function getDaySevenDays(day){
    if(day != 0){
        return day = day + 1;
    } else {
        return 8;
    }
}

function stringToDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10); // Mês no JavaScript é baseado em zero
    const year = parseInt(parts[2], 10);

    const adjustedDate = new Date(year, month, day);
    adjustedDate.setHours(23, 59, 59, 999);

    return adjustedDate;
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

function saveNewAccount(newAccountName) { // pegar o value do input e jogar aqui
    // JSON file path
    const bdJSONPath = 'data/bd-accounts.json';

    // Load the existing JSON data
    fetch(bdJSONPath)
        .then(response => response.json())
        .then(data => {
            // Check if the account already exists
            if (accountExists(data.accounts, newAccountName)) {
                alert('This account already exists. Please choose another name.');
            } else {
                // Add the new account to the array of accounts
                data.accounts.push({ "name": newAccountName });

                // Write the updated data back to the JSON file
                const updatedData = JSON.stringify(data);

                // Update the JSON file with the new data
                fetch(bdJSONPath, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: updatedData,
                })
                .then(() => {
                    console.log('New account saved successfully.');
                    alert('New account saved successfully!');
                })
                .catch(error => {
                    console.error('Error saving the new account:', error);
                    alert('Error saving the new account. Please try again.');
                });
            }
        })
        .catch(error => console.error('Error loading the JSON file:', error));
}

function accountExists(accounts, accountName) {
    // Check if the account already exists in the array
    return accounts.some(account => account.name === accountName);
}

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

document.addEventListener('DOMContentLoaded', function() { // como se fosse o ConnectedCallBack
    showElementLoad('loginSection');
    today = new Date();
    // today.setDate(today.getDate() + 2); pra teste
    changeTextById('week-info', dateFormatter(today));
    // Carrega a preferência de tema salva no localStorage
    savedTheme = localStorage.getItem('theme');
    userLogged = localStorage.getItem('userLogged');
    console.log('userLogged' + userLogged);
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Se não houver preferência salva, aplica o tema com base na escolha do navegador
        updateDarkMode();
    }
    if (userLogged) {
        console.log('userLogged?' + userLogged);
        loadInfoUser(userLogged);
    }

    // Adiciona um evento de clique ao botão de tema
    const buttonDarkMode = document.getElementById('buttonDarkMode');
    if (buttonDarkMode) {
        buttonDarkMode.addEventListener('click', toggleTheme);
    }

    activeFocusElement('inputName', 1600);
});

function updateUserLogged() {
    let name = document.getElementById('inputName').value;
    localStorage.setItem('userLogged', name);
    setTimeout(() => {    
        changeTextById('head-title', name);
    }, waitLoadTime);
}
function loadInfoUser(userName){
    let name = document.getElementById('inputName').value = userName;
    setTimeout(() => {    
        search();
        changeTextById('head-title', name);
    }, waitLoadTime);
}

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
    //console.log('cards=> ' + JSON.stringify(cards));
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
        hideElementLoad('assigmentsSection');
        hideElementLoad('loginSection');
        hideElementLoad('adminButton');
        showElementLoad('feedDataSection');
        showElementLoad('buttonBack');
    } else {
        alert("Login ou senha incorretos. Tente novamente.");
    }
}

function simulateKey(elementId, key) {
    const element = document.getElementById(elementId);

    if (element) {
        const keyboardEvent = new KeyboardEvent('keydown', {
            keyCode: key
        });

        element.dispatchEvent(keyboardEvent);
    }
}

countLine = 0;

function addUserRow() {
    const userList = document.getElementById('user-list');

    const userRow = document.createElement('div');
    userRow.classList.add('user-row');
    userRow.classList.add('align-between-st');
    userRow.classList.add('autocomplete');
    userRow.classList.add('input-space');

    const nameInput = createInput('Nome', countLine++);
    const designation = createInput('Designação');
    const presentationTheme = createInput('Parte');

    const removeButton = document.createElement('span');
    removeButton.innerText = 'X';
    removeButton.classList.add('remove-btn');
    removeButton.onclick = function() {
        userList.removeChild(userRow);
    };

    userRow.appendChild(nameInput);
    userRow.appendChild(designation);
    userRow.appendChild(presentationTheme);
    userRow.appendChild(removeButton);

    userList.appendChild(userRow);

    applyTheme(savedTheme);
}

function createInput(placeholder, a) {
    const input = document.createElement('input');
    input.classList.add('input-name');
    input.type = 'text';
    input.placeholder = placeholder;
    if(placeholder = 'Nome'){
        input.id = `inputNameAssign${a + 1}`; // Adicionando o id único
    }
    if(placeholder = 'Designação'){
        input.id = `workAssign${a + 1}`; // Adicionando o id único
    }
    if(placeholder = 'Parte'){
        input.id = `presentationAssign${a + 1}`; // Adicionando o id único
    }
    return input;
}

function submitData() {

}