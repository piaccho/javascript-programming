function vehicleCardAction(request, mode, vehicle_id, owner) {
    // mode = 0 - rent
    // mode = 1 - buy
    const input = document.getElementById('rent-vehicle-input');
    const form_arguments = input.value.split(', ');
    if (form_arguments.length != 2) {
        console.log("%c Niepoprawna ilość argumentów. Oczekiwano 2.\nPrzykład argumentów: '23, Jan Kowalski'\n", "color: orange; font-size: 16px; font-weight: bold");
        return
    }

    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const objectStore = transaction.objectStore("vehicles");

    const vehicleToUpdate = objectStore.get(vehicle_id);

    vehicleToUpdate.onsuccess = () => {
        const updateData = vehicleToUpdate.result;
        if (updateData != undefined) {
            if (updateData.rent_by === null & updateData.bought_by === null) {
                let text;
                if (mode == 0) {
                    updateData.rent_by = owner;
                    text = "wypożyczony";
                }
                else {
                    updateData.bought_by = owner;
                    text = "kupiony";
                }

                const updateRequest = objectStore.put(updateData);
                updateRequest.onsuccess = () => {
                    console.log(`%c ${updateData.type} marki ${updateData.brand} o numerze ID ${vehicle_id} został/a ${text} na nazwisko ${owner.split(" ")[1]}\n`, 'color: green; font-size: 16px; font-weight: bold');
                };

            } else {
                console.log("%c Pojazd ten jest zajęty\n", 'color: red; font-size: 16px; font-weight: bold');
            }
        } else {
            console.log("%c Pojazd o takim numerze ID nie istnieje\n", 'color: red; font-size: 16px; font-weight: bold');
        }
    };

    vehicleToUpdate.onerror = () => {
        console.log("Błąd operacji GET");
    };
}


function rentVehicle(request, event) {
    event.preventDefault();
    plotChart([], true);

    const input = document.getElementById('rent-vehicle-input');
    const form_arguments = input.value.split(', ');
    if (form_arguments.length != 2) {
        console.log("%c Niepoprawna ilość argumentów. Oczekiwano 2.\nPrzykład argumentów: '23, Jan Kowalski'\n", "color: orange; font-size: 16px; font-weight: bold");
        return
    }
    const vehicle_id = Number.parseInt(form_arguments[0]);
    const borrower_name = form_arguments[1];


    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const objectStore = transaction.objectStore("vehicles");

    const vehicleToUpdate = objectStore.get(vehicle_id);

    vehicleToUpdate.onsuccess = () => {
        const updateData = vehicleToUpdate.result;
        // console.log("GET result: ", updateData);
        if (updateData != undefined) {
            if (updateData.rent_by === null & updateData.bought_by === null) {
                updateData.rent_by = borrower_name;
                const updateRequest = objectStore.put(updateData);
                updateRequest.onsuccess = () => {
                    console.log(`%c ${updateData.type} marki ${updateData.brand} o numerze ID ${vehicle_id} został/a wypożyczony na nazwisko ${borrower_name.split(" ")[1]}\n`, 'color: green; font-size: 16px; font-weight: bold');
                };

            } else {
                console.log("%c Pojazd ten już został przez kogoś wypożyczony\n", 'color: red; font-size: 16px; font-weight: bold');
            }
        } else {
            console.log("%c Pojazd o takim numerze ID nie istnieje\n", 'color: red; font-size: 16px; font-weight: bold');
        }
    };

    vehicleToUpdate.onerror = () => {
        console.log("Błąd operacji GET");
    };
}

function buyVehicle(request, event) {
    event.preventDefault();
    plotChart([], true);

    const input = document.getElementById('buy-vehicle-input');
    const form_arguments = input.value.split(', ');
    if (form_arguments.length != 2) {
        console.log("%c Niepoprawna ilość argumentów. Oczekiwano 2.\nPrzykład argumentów: '23, Jan Kowalski'\n", "color: orange; font-size: 16px; font-weight: bold");
        return
    }
    const vehicle_id = Number.parseInt(form_arguments[0]);
    const borrower_name = form_arguments[1];


    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const objectStore = transaction.objectStore("vehicles");

    const vehicleToUpdate = objectStore.get(vehicle_id);

    vehicleToUpdate.onsuccess = () => {
        const updateData = vehicleToUpdate.result;
        if (updateData != undefined) {
            if (updateData.rent_by === null && updateData.bought_by === null) {
                updateData.bought_by = borrower_name;
                const updateRequest = objectStore.put(updateData);
                updateRequest.onsuccess = () => {
                    console.log(`%c ${updateData.type} marki ${updateData.brand} o numerze ID ${vehicle_id} został/a kupiony na nazwisko ${borrower_name.split(" ")[1]}\n`, 'color: green; font-size: 16px; font-weight: bold');
                };

            } else {
                console.log("%c Pojazd ten już został przez kogoś kupiony\n", 'color: red; font-size: 16px; font-weight: bold');
            }
        } else {
            console.log("%c Pojazd o takim numerze ID nie istnieje\n", 'color: red; font-size: 16px; font-weight: bold');
        }
    };

    vehicleToUpdate.onerror = () => {
        console.log("Błąd operacji GET");
    };
}

function returnVehicle(request, event) {
    event.preventDefault();
    plotChart([], true);

    const input = document.getElementById('return-vehicle-input');
    const form_arguments = input.value.split(', ');
    if (form_arguments.length != 2) {
        console.log("%c Niepoprawna ilość argumentów. Oczekiwano 2.\nPrzykład argumentów: '11, Janusz Tracz'\n", "color: orange; font-size: 16px; font-weight: bold");
        return
    }

    const vehicle_id = Number.parseInt(form_arguments[0]);
    const borrower_name = form_arguments[1];

    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const objectStore = transaction.objectStore("vehicles");

    const vehicleToUpdate = objectStore.get(vehicle_id);

    vehicleToUpdate.onsuccess = () => {
        const updateData = vehicleToUpdate.result;
        // console.log("GET result: ", updateData);
        if (updateData != undefined) {
            if (borrower_name.localeCompare(updateData.rent_by) == 0) {
                updateData.rent_by = null;
                const updateRequest = objectStore.put(updateData);
                updateRequest.onsuccess = () => {
                    console.log(`%c Pan/Pani ${borrower_name} zwraca ${updateData.type} marki ${updateData.brand} o numerze ID: ${vehicle_id}\n`, 'color: green; font-size: 16px; font-weight: bold');
                };
            } else {
                console.log(`%c Pan/Pani ${borrower_name} nie wypożyczył/a tego pojazdu\n`, "color: red; font-size: 16px; font-weight: bold");
            }
        } else {
            console.log("%c Pojazd o takim numerze ID nie istnieje\n", 'color: red; font-size: 16px; font-weight: bold');
        }
    };

    vehicleToUpdate.onerror = () => {
        console.log("Błąd operacji GET");
    };

}

function infoVehicle(request, event) {
    event.preventDefault();

    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const objectStore = transaction.objectStore("vehicles");
    const viewAllRequest = objectStore.getAll();
    viewAllRequest.onsuccess = () => {
        // console.log(viewAllRequest.result);
        const data = {};
        // console.log(viewAllRequest.result);
        for (const vehicle of Object.values(viewAllRequest.result)) {
            if (vehicle.rent_by === null && vehicle.bought_by === null)
                data[vehicle.name] = data[vehicle.name] ? data[vehicle.name] + 1 : 1;
        }
        // console.log({data});
        plotChart(data);
    }
    // viewAllRequest.onsuccess = (event) => {
    //     let vehicles = viewAllRequest.result;
    //     console.log("Wszystkie pojazdy:");
    //     console.log(vehicles);

    //     plotChart(objectStore)

    //     // for (let i = 0; i < vehicles.length; i++) {
    //     //     console.log("ID pojazdu: " + vehicles[i].id);
    //     //     // console.log("Rodzaj pojazdu: " + vehicles[i].type);
    //     //     // console.log("Marka: " + vehicles[i].brand);
    //     //     // console.log("ID modelu: " + vehicles[i].model_id);
    //     //     // console.log("Nazwa produktu: " + vehicles[i].name);
    //     //     // console.log("URL zdjęcia: " + vehicles[i].img_url);
    //     //     console.log("Wypożyczający: " + vehicles[i].rent_by);
    //     //     console.log("-----------------------");
    //     // }
    // }
}

let chartShowed = false;
let myChart = null;


function plotChart(vehicleData, clean=false) {
    if (chartShowed || clean === true) {
        chartShowed = false;
        document.getElementById('chart-wrapper').style.display = 'none';
        if(myChart !== null)
            myChart.destroy();
        return
    }

    chartShowed = true;
    const ctx = document.getElementById('myChart');
    document.getElementById('chart-wrapper').style.display = 'block';

    const data = {
        labels: Object.keys(vehicleData),
        datasets: [{
            label: 'Ilość sztuk',
            data: Object.values(vehicleData),
            backgroundColor: ["#00ff00aa"],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (val, index) {
                            // Hide every tick label with non integer value
                            return val % 1 === 0 ? this.getLabelForValue(val) : '';
                        },
                    },
                }
            },
            maxBarThickness: 80,
        },
    };

    myChart = new Chart(ctx, config);
    ctx.style.width = '500px';
    ctx.style.height = '500px';
}

function unrentAllVehicles(request, event) {
    event.preventDefault();
    plotChart([], true)

    const db = request.result;

    const transaction = db.transaction(["vehicles"], "readwrite");
    const objectStore = transaction.objectStore("vehicles");

    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const updateData = cursor.value;

            updateData.rent_by = null;

            const request = cursor.update(updateData);
            request.onsuccess = () => {
                console.log(`Pojazd ID ${cursor.value.id} zwrócony`);
            };

            cursor.continue();
        } else {
            console.log("Koniec aktualizacji.");
        }
    };
}

export { infoVehicle, plotChart, chartShowed, myChart, rentVehicle, buyVehicle, returnVehicle, unrentAllVehicles, vehicleCardAction}