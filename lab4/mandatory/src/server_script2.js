/**

    This script contains functions to implement a simple Node.js application with a synchronous and asynchronous reading of the counter.
    The user can select between sync and async counter mode or command execution mode.
    In the command execution mode, the user recive output from multiple shell commands passed as input separated by a newline character.
    @module server_script2
*/

/* eslint-disable no-undef */
import fs from "fs-extra";
import { exec } from "node:child_process";
const fileName = "./counter.txt";

import http from "node:http";
import { URL } from "node:url";

/**
    Reads and increments the counter synchronously from a file named 'counter.txt'
    If the file does not exist, creates it and returns 1.
    @function
    @returns {number} The incremented value of the counter.
*/
function read_sync() {
    console.log("START SYNC");
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, "1");
        return 1;
    } else {
        let counter = parseInt(fs.readFileSync(fileName, "utf8"));
        counter++;
        fs.writeFileSync(fileName, counter.toString());
        return counter;
    }
}

/**
    Reads and increments the counter asynchronously from a file named 'counter.txt'
    If the file does not exist, creates it and returns 1.
    @async
    @function
    @returns {Promise<number>} The incremented value of the counter.
*/
async function read_async() {
    console.log("START ASYNC");
    return new Promise((resolve) => {
        if (!fs.exists(fileName)) {
            fs.writeFile(fileName, 1, (err) => {
                if (err) throw err;
                resolve(1);
            });
        } else {
            fs.readFile(fileName, (err, data) => {
                if (err) throw err;
                let counter = parseInt(data);
                counter++;
                fs.writeFile(fileName, counter.toString(), (err) => {
                    if (err) throw err;
                });
                resolve(counter);
            });
        }
    });
}

/**
    Executes shell commands and returns their outputs as a concatenated string.
    @async
    @function
    @param {string} commands - A string containing multiple shell commands separated by a newline character.
    @returns {Promise<string>} The concatenated outputs of the executed commands.
*/
async function exec_commands(commands) {
    console.log("START COMMANDS");

    return new Promise((resolve) => {
        const cmds = commands.split("\r");
        // const cmds = commands.split("\r").map((str) => str.replace(/\s+/g, ""));
        if (cmds.length == 0) return "";

        const promises = cmds.map((command) => {
            if (command === "") return;
            return new Promise((resolve, reject) => {
                exec(command, (error, stdout) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ command, stdout });
                    }
                });
            });
        });

        Promise.all(promises)
            .then((results) => {
                const output = results
                    .map((result) => `${result.command}\n${result.stdout}\n`)
                    .join("");
                resolve(output);
            })
            .catch((error) => {
                console.error(`exec error: ${error}`);
                resolve("");
            });
    });
}

/**
    * Executes the corresponding function based on the given mode parameter and returns the output as an HTML string.
    * @async
    * @function
    * @param {string} mode - The selected mode of the application. Can be 'sync', 'async'
    * @param {string} commands - The commands to execute.
*/
async function exec_mode(mode, commands) {
    let value = "NULL";
    switch (mode) {
        case "sync":
            value = read_sync();
            return `<h2>Liczba uruchomień: ${value}</h2>`;
        case "async":
            value = await read_async();
            return `<h2>Liczba uruchomień: ${value}</h2>`;
        case "commands":
            value = await exec_commands(commands);
            return `<pre>${value}</pre>`;
    }
}

/**
     * Handles incoming requests.
     *
     * @param {IncomingMessage} request - Input stream — contains data received from the browser, e.g,. encoded contents of HTML form fields.
     * @param {ServerResponse} response - Output stream — put in it data that you want to send back to the browser.
     * The answer sent by this stream must consist of two parts: the header and the body.
     * <ul>
     *  <li>The header contains, among others, information about the type (MIME) of data contained in the body.
     *  <li>The body contains the correct data, e.g. a form definition.
     * </ul>
     * Depends on selected option in form, the body includes specific output. 
     * @author Stanisław Polak <polak@agh.edu.pl>
     * @author Sebastian Piaskowy
*/

function requestListener(request, response) {
    console.log("--------------------------------------");
    console.log(`The relative URL of the current request: ${request.url}`);
    console.log(`Access method: ${request.method}`);
    console.log("--------------------------------------");

    const url = new URL(request.url, `http://${request.headers.host}`);
    if (!request.headers["user-agent"]) console.log(url);

    // Routes

    // Route GET('/')
    if (url.pathname === "/" && request.method === "GET") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.write(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vanilla Node.js application</title>
  </head>
  <body>
    <main>
        <h1>Sync/Async Counter in Node.js</h1>
        <form method="GET" action="/submit">
            <label for="mode">Podaj tryb programu</label>
            <select id="modes" name="mode">
                <option value="sync" selected>sync</option>
                <option value="async">async</option>
                <option value="commands">—</option>
            </select>
            <br>
            <br>
            <label for="commands">Podaj komendy (odzielaj Enterem)</label>
            <br>
            <textarea id="commands-area" name="commands" cols='20' rows='5' disabled></textarea>
            <br>
            <br>
            <input type="submit">
            <input type="reset">
        </form> 
    </main>
    <script>
        const modes = document.getElementById('modes');
        const commandsArea = document.getElementById('commands-area');
        
        modes.addEventListener('change', () => {
            if (modes.value === 'commands') {  
                commandsArea.removeAttribute("disabled");
            } else {
                commandsArea.setAttribute("disabled", ""); 
            }
        });
    </script>
  </body>
</html>`);
        response.end();
    }

    // Route GET('/submit')
    else if (url.pathname === "/submit" && request.method === "GET") {
        exec_mode(url.searchParams.get("mode"), url.searchParams.get("commands"))
            .then((result) => {
                console.log({ result });
                response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                response.write(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vanilla Node.js application</title>
  </head>
  <body>
    <main>
        ${result}
    </main>
  </body>
</html>`);
                response.end();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // No implemented route
    else {
        response.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
        response.write("Error 501: Not implemented");
        response.end();
    }
}

const server = http.createServer(requestListener);
server.listen(3100);
console.log("The server was started on port 3100");
console.log('To stop the server, press "CTRL + C"');

process.on('SIGINT', () => {
    fs.unlink(fileName, (err) => {
        if (err) throw err;
    });

    console.log('Closing server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit();
    });
});