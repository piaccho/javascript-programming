const quote = ["Natenczas Wojski chwycił na taśmie przypięty", "Swój róg bawoli, długi, cętkowany, kręty", "Jak wąż boa, oburącz do ust go przycisnął,", "Wzdął policzki jak banię, w oczach krwią zabłysnął,", "Zasunął wpół powieki, wciągnął w głąb pół brzucha", "I do płuc wysłał z niego cały zapas ducha,", "I zagrał: róg jak wicher, wirowatym dechem", "Niesie w puszczę muzykę i podwaja echem.", "<br>", "Umilkli strzelcy, stali szczwacze zadziwieni", "Mocą, czystością, dziwną harmoniją pieni.", "Starzec cały kunszt, którym niegdyś w lasach słynął,", "Jeszcze raz przed uszami myśliwców rozwinął;", "Napełnił wnet, ożywił knieje i dąbrowy,", "Jakby psiarnię w nie wpuścił i rozpoczął łowy.", "<br>", "Bo w graniu była łowów historyja krótka:", "Zrazu odzew dźwięczący, rześki: to pobudka;", "Potem jęki po jękach skomlą: to psów granie;", "A gdzieniegdzie ton twardszy jak grzmot: to strzelanie."]

let quote_idx = 0;

function noCSS() {
    state = false;
    document.querySelectorAll('*').forEach(element => {
        element.className = "";
        element.removeAttribute('style');
    });
}

// default look
let state = false;
window.addEventListener('load', noCSS)

// set css
document.getElementById("set").addEventListener('click', () => {
    state = true;
    document.querySelectorAll('h1').forEach(element => {
        element.style.fontSize = '2em';
        element.style.margin = '0';
        element.style.animationName = 'colorful-text-headers';
        element.style.animationDuration = '1s';
        element.style.animationIterationCount = 'infinite';
        element.style.animationDirection = 'alternate';
    });
    document.querySelectorAll('h2').forEach(element => {
        element.style.fontSize = '1.5em';
        element.style.margin = '0';
    }); 
    document.querySelectorAll('p').forEach(element => {
        element.style.margin = '0';
    }); 

    document.querySelector('blockquote').margin = '0 0 20px 0';
    document.querySelector('main h1').margin = '0 0 1vh 0';

    const DOM_header = document.querySelector('header');
    DOM_header.className = 'azure';
    DOM_header.style.flexBasis = "100%"

    const DOM_nav = document.querySelector('nav')
    DOM_nav.className = 'azure';
    DOM_nav.style.height = 'fit-content';

    const DOM_aside = document.querySelector('aside')
    DOM_aside.className = 'azure';
    DOM_aside.style.flexBasis = '50%';
    
    const DOM_main = document.querySelector('main')
    DOM_main.className = 'azure';
    DOM_main.style.flexBasis = '40%';

    const DOM_footer = document.querySelector('footer');
    DOM_footer.className = 'azure';
    DOM_footer.flexBasis = '100%';
    DOM_footer.style.width = '100%';

    const DOM_body = document.querySelector('body');
    DOM_body.style.display = 'flex';
    DOM_body.style.flexFlow = 'row wrap';
    DOM_body.style.justifyContent = 'space-between';

    document.querySelector('div').style.width = '100%';
});

// restore default look button
document.getElementById("delete").addEventListener('click', noCSS);


document.getElementById("add").addEventListener('click', () => {
    let p = document.createElement('p')
    if (state === true)
        p.style.margin = '0';
    const p_text = document.createTextNode(quote[quote_idx]);
    
    if (quote[quote_idx].localeCompare('<br>') == 0) {
        p = document.createElement('br');
    } else {
        p.appendChild(p_text);
    }
    
    quote_idx += 1;

    document.querySelector('blockquote').appendChild(p);
    if (quote_idx == quote.length) {
        document.getElementById("add").disabled = true;
    }
});
