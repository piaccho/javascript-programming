/* eslint-disable no-undef */
import fs from "fs-extra";
import { argv } from "node:process";
import { exec } from 'node:child_process'
const fileName = "./counter.txt";


function read_sync() {
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '1');
        console.log(`Liczba uruchomień: 1`);
    } else {
        let counter = parseInt(fs.readFileSync(fileName, "utf8"));
        counter++;
        fs.writeFileSync(fileName, counter.toString());
        console.log(`Liczba uruchomień: ${counter}`);
    }
}

function read_async() {
    if (!fs.exists(fileName)) {
        fs.writeFile(fileName, 1, (err) => {
            if (err) throw err;
            console.log(`Liczba uruchomień: 1`);
        });
    } else {
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            let counter = parseInt(data);
            counter++;
            fs.writeFile(fileName, counter.toString(), (err) => {
                if (err) throw err;
                console.log(`Liczba uruchomień: ${counter}`);
            });
        });
    }
}


if (argv[2] === "--sync") {
    read_sync();
} else if (argv[2] === "--async") {
    read_async();
} else if (argv.length === 2) {
    console.log("Wprowadź komendy — naciśnięcie Ctrl+D kończy wprowadzanie danych:");
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
        const command = data.trim();
        exec(command, (err, output) => {
            if (err) {
                console.error("Nie można wykonać komendy: ", err);
            } else {
                console.log(output);
            }
        });
    });
}
