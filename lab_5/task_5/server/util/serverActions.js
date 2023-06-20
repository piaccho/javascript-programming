import fs from 'fs';
import qs from 'querystring';

export function initForm(req, res) {
    fs.readFile('./src/data/index.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500);
            console.log(err);
            res.end('An internal server error has occured');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        }
    });
}

export function addVehicle(req, res) {
    let body = "";
    req.on('data', (data) => {
        body += data;
    })
    req.on('end', () => {
        const data = qs.parse(body);

        const name = `${data.type} ${data.brand} ${data.model}` ;
        let buy_price = Number.parseInt(data.buy_price);
        if (buy_price === 0 || Number.isNaN(buy_price)) buy_price = null;
        let rent_price = Number.parseInt(data.rent_price);
        if (rent_price === 0 || Number.isNaN(rent_price)) rent_price = null;
        
        const vehicles = JSON.parse(fs.readFileSync('./src/data/vehicles.json', 'utf8'));
        
        let record = {
            vehicle_id: vehicles[vehicles.length - 1].vehicle_id + 1,
            type: data.type,
            brand: data.brand,
            model: data.model,
            name: name,
            buy_price: buy_price,
            rent_price: rent_price,
            img_url: data.img_url,
            rent_by: null,
            bought_by: null,
        };

        vehicles.push(record);
        
        fs.writeFile('./src/data/vehicles.json', JSON.stringify(vehicles), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end('A file save data error has occured');
            } else {
                res.writeHead(200);
                res.end(`Vehicle ID ${record.vehicle_id} - ${record.name} - has been added to database`);
            }
        });
    })
}

export function deleteVehicle(req, res) {
    let body = "";
    req.on('data', (data) => {
        body += data;
    })
    req.on('end', () => {
        const data = qs.parse(body);
        const deleteVehicleId = Number.parseInt(data.vehicle_id);
        const vehicles = JSON.parse(fs.readFileSync('./src/data/vehicles.json', 'utf8'));
        const vehicleIndex = vehicles.findIndex((v) => v.vehicle_id === deleteVehicleId);
        if (vehicleIndex === -1) {
            res.writeHead(404);
            res.end('Cannot find vehicle with that ID');
            return;
        }

        vehicles.splice(vehicleIndex, 1);
        fs.writeFile('./src/data/vehicles.json', JSON.stringify(vehicles), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end('A file save data error has occured');
            } else {
                res.writeHead(200);
                res.end(`Vehicle ID: ${deleteVehicleId} has been removed`);
            }
        });
    })
}


export function getVehicles(req, res) {
    fs.readFile('./src/data/vehicles.json', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500);
            console.log(err);
            res.end('An internal server error has occured');
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        }
    });
}

export function getCustomers(req, res) {
    fs.readFile('./src/data/customers.json', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500);
            console.log(err);
            res.end('An internal server error has occured');
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        }
    });
}

export function buyRentVehicle(req, res, mode) {
    let body = "";
    req.on('data', (data) => {
        body += data;
    })
    req.on('end', () => {
        console.log({body});
        
        //      from POST version
        const searchParams = new URLSearchParams(body.substring(body.indexOf('?')));
        const form_arguments = searchParams.get('arguments').split(', ');

        //      fetch POST version
        // const data = JSON.parse(body);
        // const form_arguments = data.arguments.split(', ');
        
        console.log({form_arguments});
        if (form_arguments.length != 3 || Number.isNaN(Number.parseInt(form_arguments[0]))) {
            res.writeHead(400);
            res.end('Invalid arguments.\nE.g.: \'23, Jan, Kowalski\'');
            return;
        }
        
        const targetVehicleId = Number.parseInt(form_arguments[0]);
        const ownerFirstName = form_arguments[1];
        const ownerLastName = form_arguments[2];

        const dbDataVehicles = JSON.parse(fs.readFileSync('./src/data/vehicles.json', 'utf8'));
       
        const vehicles = dbDataVehicles.vehicles;

        const vehicleObjectIndex = vehicles.findIndex((v) => v.vehicle_id === targetVehicleId);
        if (vehicleObjectIndex === -1) {
            res.writeHead(404);
            res.end('Cannot find vehicle with that ID');
            return;
        }
        
        const targetVehicle = vehicles[vehicleObjectIndex];

        const actionCondition = mode === "buy" ? targetVehicle.buy_price : targetVehicle.rent_price;
        if(targetVehicle.bought_by !== null || targetVehicle.rent_by !== null || actionCondition === null) {
            res.writeHead(403);
            res.end(`This vehicle cannot be ${mode === "buy" ? "purchased" : "rented"}`);
            return;
        }

        const dbDataCustomers = JSON.parse(fs.readFileSync('./src/data/customers.json', 'utf8'));
        const customers = dbDataCustomers.customers;
        const customerObjectIndex = customers.findIndex((c) => (c.first_name === ownerFirstName && c.last_name === ownerLastName));

        let ownerIndex;
        let newCustomerInfo = ""
        if (customerObjectIndex === -1) {
            let newCustomerRecord = {
                customer_id: customers[customers.length - 1].customer_id + 1,
                first_name: ownerFirstName,
                last_name: ownerLastName,
            };
            customers.push(newCustomerRecord);
            
            fs.writeFile('./src/data/customers.json', JSON.stringify(dbDataCustomers, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('A file save data error has occured');
            } else {
                console.log(`Customer ID ${newCustomerRecord.customer_id} - ${newCustomerRecord.first_name} ${newCustomerRecord.last_name} - has been added to database`);
                newCustomerInfo = `Customer ${newCustomerRecord.first_name} ${newCustomerRecord.last_name} has been added to database`;
            }
        });
            ownerIndex = newCustomerRecord.customer_id
        } else {
            ownerIndex = customers[customerObjectIndex].customer_id
        }

        if (mode === "buy") targetVehicle.bought_by = ownerIndex;
        else if (mode === "rent") targetVehicle.rent_by = ownerIndex;
        fs.writeFile('./src/data/vehicles.json', JSON.stringify(dbDataVehicles, null, 4), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end('A file save data error has occured');
            } else {
                res.writeHead(200);
                res.end(`Vehicle ID ${targetVehicleId} has been ${mode === "buy" ? "bought" : "rent"} by ${ownerFirstName} ${ownerLastName}\n${newCustomerInfo}`);
            }
        });
    })
}

export function returnVehicle(req, res) {
    let body = "";
    req.on('data', (data) => {
        body += data;
    })
    req.on('end', () => {
        console.log({body});
        const searchParams = new URLSearchParams(body.substring(body.indexOf('?')));
        const form_arguments = searchParams.get('arguments').split(', ');
        // const data = JSON.parse(body);
        // const form_arguments = data.arguments.split(', ');
        if (form_arguments.length != 3 || Number.isNaN(Number.parseInt(form_arguments[0]))) {
            res.writeHead(400);
            let msg = 'Invalid arguments.\nE.g.: \'23, Jan, Kowalski\'';
            res.end(msg);
            console.log(msg);
            return;
        }
        
        const targetVehicleId = Number.parseInt(form_arguments[0]);
        const ownerFirstName = form_arguments[1];
        const ownerLastName = form_arguments[2];

        const dbDataVehicles = JSON.parse(fs.readFileSync('./src/data/vehicles.json', 'utf8'));
        const vehicles = dbDataVehicles.vehicles;

        const vehicleObjectIndex = vehicles.findIndex((v) => v.vehicle_id === targetVehicleId);
        if (vehicleObjectIndex === -1) {
            res.writeHead(404);
            let msg = 'Cannot find vehicle with that ID';
            res.end(msg);
            console.log(msg);
            return;
        }    
        const targetVehicle = vehicles[vehicleObjectIndex];
        if(targetVehicle.bought_by !== null || targetVehicle.rent_by === null) {
            res.writeHead(403);
            let msg = `This vehicle cannot be returned`;
            res.end(msg);
            console.log(msg);
            return;
        }
    
        const dbDataCustomers = JSON.parse(fs.readFileSync('./src/data/customers.json', 'utf8'));
        const customers = dbDataCustomers.customers;
        const customerObjectIndex = customers.findIndex((c) => (c.first_name === ownerFirstName && c.last_name === ownerLastName));
        if (customerObjectIndex === -1) {
            res.writeHead(404);
            let msg = 'Cannot find given customer';
            res.end(msg);
            console.log(msg);
            return;
        }  
        const ownerIndex = customers[customerObjectIndex].customer_id;
        if(targetVehicle.rent_by !== ownerIndex) {
            res.writeHead(403);
            let msg = `This customer did not rent that vehicle`;
            res.end(msg);
            console.log(msg);
            return;
        }

        targetVehicle.rent_by = null;

        fs.writeFile('./src/data/vehicles.json', JSON.stringify(dbDataVehicles, null, 4), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                let msg = 'A file save data error has occured';
                res.end(msg);
                console.log(msg);
            } else {
                res.writeHead(200);
                let msg = `Vehicle ID ${targetVehicleId} has been returned`;
                res.end(msg);
                console.log(msg);
            }
        });
    })
}

export function returnAllVehicle(req, res) {
    const dbDataVehicles = JSON.parse(fs.readFileSync('./src/data/vehicles.json', 'utf8'));
    const vehicles = dbDataVehicles.vehicles;

    vehicles.forEach(item => {
        item.rent_by = null
        item.bought_by = null
    });
    
    fs.writeFile('./src/data/vehicles.json', JSON.stringify(dbDataVehicles, null, 4), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.writeHead(500);
            res.end('A file save data error has occured');
        } else {
            res.writeHead(200);
            res.end(`All vehicles have been returned`);
        }
    });
}
