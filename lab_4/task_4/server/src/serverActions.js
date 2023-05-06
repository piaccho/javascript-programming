import fs from 'fs';
import qs from 'querystring';

function getVehicles(req, res) {
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

function getCustomers(req, res) {
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

function addVehicle(req, res) {
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

function deleteVehicle(req, res) {
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

function buyRentVehicle(req, res, mode) {
    console.log(mode);
    let body = "";
    req.on('data', (data) => {
        body += data;
    })
    req.on('end', () => {
        const data = qs.parse(body);
        const targetVehicleId = Number.parseInt(data.vehicle_id);
        const ownerFirstName = data.first_name;
        const ownerLastName = data.last_name;

        const vehicles = JSON.parse(fs.readFileSync('./src/data/vehicles.json', 'utf8'));
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

        const customers = JSON.parse(fs.readFileSync('./src/data/customers.json', 'utf8'));
        const customerObjectIndex = customers.findIndex((c) => (c.first_name === ownerFirstName && c.last_name === ownerLastName));

        let ownerIndex;

        if (customerObjectIndex === -1) {
            let newCustomerRecord = {
                customer_id: customers[customers.length - 1].customer_id + 1,
                first_name: ownerFirstName,
                last_name: ownerLastName,
            };
            customers.push(newCustomerRecord);
            
            fs.writeFile('./src/data/customers.json', JSON.stringify(customers), 'utf8', (err) => {
            if (err) {
                console.error('A file save data error has occured');
            } else {
                console.log(`Customer - ID ${newCustomerRecord.person_id} - ${newCustomerRecord.first_name} ${newCustomerRecord.last_name} - has been added to database`);
            }
        });
            ownerIndex = newCustomerRecord.customer_id
        } else {
            ownerIndex = customers[customerObjectIndex].customer_id
        }

        let actionPropertyToModify = mode === "buy" ? targetVehicle.bought_by: targetVehicle.rent_by; 
        actionPropertyToModify = ownerIndex;
        fs.writeFile('./src/data/vehicles.json', JSON.stringify(vehicles), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end('A file save data error has occured');
            } else {
                res.writeHead(200);
                res.end(`Vehicle ID: ${targetVehicleId} has been ${mode === "buy" ? "bought" : "rent"} by ${ownerFirstName} ${ownerLastName}`);
            }
        });
    })
}


export { getCustomers, getVehicles, addVehicle, deleteVehicle, buyRentVehicle }