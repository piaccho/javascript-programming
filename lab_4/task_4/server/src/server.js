import http from 'http';
import * as actions from './serverActions.js'
const port = 3333;

function requestListener(req, res) {
    console.log('--------------------------------------');
    console.log(`The relative URL of the current request: ${req.url}`);
    console.log(`Access method: ${req.method}`);
    console.log('--------------------------------------');

    // Routes   

    // Route GET('/')
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Wypożyczalnia server application</title>
  </head>
  <body>
    <main>
        <h1>REQUESTS TEST</h1>
        <form action="/delete" method="POST">
            <fieldset>
                <h3>Delete an vehicle</h3>
                <label>Vehicle ID</label>
                <input type="text" name="vehicle_id" required>
                <br><br>
                <button type="submit">Submit</button>
                <br><br>
            </fieldset>
        </form>
        <form action="/add" method="POST">
            <fieldset>
                <h3>Add an vehicle</h3>
                <label>type</label>
                <select name="type" required>
                    <option value="Hulajnoga">Hulajnoga</option>
                    <option value="Rower górski">Rower górski</option>
                </select>
                <br><br>
                <label>brand</label>
                <input type="text" name="brand" required>
                <br><br>
                <label>model</label>
                <input type="text" name="model" required>
                <br><br>
                <label>buy_price</label>
                <input type="text" name="buy_price">
                <br><br>
                <label>rent_price</label>
                <input type="text" name="rent_price">
                <br><br>
                <label>img_url</label>
                <input type="text" name="img_url" required>
                <br><br>
                <button type="submit">Submit</button>
                <br><br>
            </fieldset>
        </form>
        <form action="/buy" method="POST">
            <fieldset>
                <h3>Buy an vehicle</h3>
                <label>Vehicle ID</label>
                <input type="text" name="vehicle_id" required>
                <br><br>
                <label>First name</label>
                <input type="text" name="first_name" required>
                <br><br>
                <label>Last name</label>
                <input type="text" name="last_name" required>
                <br><br>
                <button type="submit">Submit</button>
                <br><br>
            </fieldset>
        </form>
        <form action="/rent" method="POST">
            <fieldset>
                <h3>Rent an vehicle</h3>
                <label>Vehicle ID</label>
                <input type="text" name="vehicle_id" required>
                <br><br>
                <label>First name</label>
                <input type="text" name="first_name" required>
                <br><br>
                <label>Last name</label>
                <input type="text" name="last_name" required>
                <br><br>
                <button type="submit">Submit</button>
                <br><br>
            </fieldset>
        </form>
    </main>
  </body>
</html>`);
        res.end();
    }

    // Route GET('/vehicles')
    else if (req.url === '/vehicles' && req.method === 'GET') {
        actions.getVehicles(req, res);
    }

    // Route GET('/customers')
    else if (req.url === '/customers' && req.method === 'GET') {
        actions.getCustomers(req, res);
    }

    // Route POST('/buy')
    else if (req.url === '/buy' && req.method === 'POST') {
        actions.buyRentVehicle(req, res, "buy");
    }

    // Route POST('/rent')
    else if (req.url === '/rent' && req.method === 'POST') {
        actions.buyRentVehicle(req, res, "rent");
    }

    // Route POST('/add')
    else if (req.url === '/add' && req.method === 'POST') {
        actions.addVehicle(req, res);
    }

    // Route POST('/delete')
    else if (req.url === '/delete' && req.method === 'POST') {
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
        console.log(`The server was started on port ${port}`);
        console.log('To stop the server, press "CTRL + C"');
    }
})

