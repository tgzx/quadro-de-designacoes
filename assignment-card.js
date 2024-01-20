//changeTextById('week-info', semanaInfo);

today = null;
onlyWeekPresentation = true;

function showLoading() {
    document.getElementById('loadingSection').style.display = 'block';
}
function hideLoading() {
    document.getElementById('loadingSection').style.display = 'none';
}

function checkBoxChange(){
    const checkbox = document.getElementById('checkBoxWeek').checked;
    onlyWeekPresentation = checkbox;
    console.log('onlyWeekPresentation => ' + onlyWeekPresentation);
}

function search() {
    let name = document.getElementById('inputName').value;

    if (name !== "" && name !== undefined) {
        hideElement('loginSection');
        showElement('assigmentsSection');
        showElement('buttonBack');
        readAssignmentsBD(name);
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
        activeFocusElement('inputName', 1800);
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



function getPresenter() {
    // let name = document.getElementById('inputNameAssign').value;
    // //console.log('name => ' + name);
    const bdJSONPath = 'data/bd-accounts.json';
    let bdJSON = {};

    fetch(bdJSONPath)
    .then(response => response.json())
    .then(data => {
        //console.log('Conteúdo do bdJSON:');
        //console.log(data);

        data.accounts.forEach(account => {
            presenters = presenters.concat(account.name);
        });

        //console.log('presenters => ' + JSON.stringify(presenters));
    });
} 


nameFound = false;
designationsMiddleWeek = '';
designationsEndWeek = '';

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

// function sameWeek(date1, date2) {
//     const oneWeek = 7 * 24 * 60 * 60 * 1000; // milissegundos em uma semana
//     const diff = Math.abs(date1 - date2);
  
//     return diff < oneWeek;
// }
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

document.addEventListener('DOMContentLoaded', function() { // como se fosse o ConnectedCallBack
    //console.log('O DOM foi completamente carregado.');
    showElement('loginSection');
    today = new Date();
    // today.setDate(today.getDate() + 2); pra teste
    changeTextById('week-info', dateFormatter(today));
    getPresenter(); // Chama a função para preencher presenters
    setTimeout(() => { // Aguarda um curto período antes de chamar a função autocomplete
        autocomplete(document.getElementById("inputNameAssign"), presenters);
        autocomplete(document.getElementById("inputName"), presenters);
    }, 1000); // Você pode ajustar o tempo de espera conforme necessário
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

    activeFocusElement('inputName', 1800);

    document.getElementById('inputName').addEventListener('keyup', function(event) {
        if(event.keyCode != '40' && event.keyCode != '38'){ // se for diferente de botao baixo e botao cima entra
            simulateKey('inputName', '40');
        }

        setTimeout(() => {
            if (event.key === 'Enter') {
                search();
            }
        }, 300);
    });

    document.getElementById('inputNameAssign').addEventListener('keyup', function(event) {
        if(event.keyCode != '40' && event.keyCode != '38'){ // se for diferente de botao baixo e botao cima entra
            simulateKey('inputNameAssign', '40');
        }
    });
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
        hideElement('assigmentsSection');
        hideElement('loginSection');
        showElement('feedDataSection');
        showElement('buttonBack');
    } else {
        alert("Login ou senha incorretos. Tente novamente.");
    }
}

let presenters = [];

function autocomplete(inp, arr) {
    //console.log('presenters 2=> ' + JSON.stringify(arr));
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        // Limitando a exibição aos primeiros 5 países
        var count = 0;
        for (i = 0; i < arr.length && count < 5; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });

                a.appendChild(b);
                count++;
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
        }
    });
    function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
    }
    function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
        }
    }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
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