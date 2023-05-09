import http from 'http';
import * as actions from './serverActions.js'
const port = 5501;

function requestListener(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true);

    console.log("=======================================");
    console.log(`Current request: ${req.url}`);
    console.log(`Access method: ${req.method}`);
    console.log(`IP address: ${req.socket.remoteAddress}`);
    console.log(`Port: ${req.socket.remotePort}`);
    console.log();

    // Routes   

    // Route GET('/')
    if (req.url === "/" && req.method === "GET") {
        actions.initForm(req, res);
    }

    // Route GET('/api/vehicles')
    else if (req.url === '/api/vehicles' && req.method === 'GET') {
        actions.getVehicles(req, res);
    }

    // Route GET('/api/customers')
    else if (req.url === '/api/customers' && req.method === 'GET') {
        actions.getCustomers(req, res);
    }

    // Route POST('/api/buy')
    else if (req.url === '/api/buy' && req.method === 'POST') {
        actions.buyRentVehicle(req, res, "buy");
    }

    // Route POST('/api/rent')
    else if (req.url === '/api/rent' && req.method === 'POST') {
        actions.buyRentVehicle(req, res, "rent");
    }

    // Route POST('/api/return')
    else if (req.url === '/api/return' && req.method === 'POST') {
        actions.returnVehicle(req, res);
    }

    // Route POST('/api/return-all')
    else if (req.url === '/api/return-all' && req.method === 'POST') {
        actions.returnAllVehicle(req, res);
    }

    // Route POST('/api/add')
    else if (req.url === '/api/add' && req.method === 'POST') {
        actions.addVehicle(req, res);
    }
    

    // Route POST('/api/delete')
    else if (req.url === '/api/delete' && req.method === 'POST') {
        actions.deleteVehicle(req, res);
    }

    // No route
    else {
        res.writeHead(501, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.write('Error 501: Not implemented');
        res.end();
    }
}

const server = http.createServer(requestListener)

server.listen(port, (err) => {
    if (err) {
        console.log('Something went wrong', err);
    } else {
        var port = server.address().port;
        // console.log('HTTP(s) proxy server listening on port %d', port)
        console.log(`The server was started on port ${port}`);
        console.log("Address:");
        console.log(`http://localhost:${port}/`);
        console.log('To stop the server, press "CTRL + C"');
    }
})

