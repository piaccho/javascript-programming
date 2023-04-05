function promptFourTimes() {
    for (let i = 0 ; i < 4 ; i++) {
        const input = window.prompt("Podaj wartość:");
        console.log(input + ":" + typeof(input));
    }
}

function btnClick() {
    const textVal = document.forms[0].pole_tekstowe.value;
    const numVal = document.forms[0].pole_liczbowe.value;
    console.log('%c Text value: %s \nType of value: %s ', 'font-weight: bold; color: lime', textVal, typeof(textVal));
    console.log('%c Text value: %i \nType of value: %s ', 'font-weight: bold; color: orange', numVal, typeof (numVal));
}
