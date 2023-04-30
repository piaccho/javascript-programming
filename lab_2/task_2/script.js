import { generateRandomData } from './randomDB.js';

const DBDeleteRequest = window.indexedDB.deleteDatabase("VehicleDatabase");

function dbQuery() {
    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const store = transaction.objectStore("vehicles");
    const model_idIndex = store.index("model");
    const typeIndex = store.index("type");
    const brandIndex = store.index("brand");
    const img_urlIndex = store.index("img_url");
    const rent_byIndex = store.index("rent_by");

    const idQuery = store.get(2);
    const modelIDQuery = model_idIndex.getAll([2]);

    idQuery.onsuccess = function () {
        console.log('idQuery', idQuery.result);
    };
    modelIDQuery.onsuccess = function () {
        console.log('modelIDQuery', modelIDQuery.result);
    };

    transaction.oncomplete = function () {
        console.log("Zamykanie transakcji ");
        db.close();
    };
}

function addToDB(item) {
    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");
    const objectStore = transaction.objectStore("vehicles");
    
    const addRequest = objectStore.put(item);

    addRequest.onsuccess = () => {
        // console.log(item, "Udało sie dodac obiekt do DB");
        console.log("Udało sie dodac obiekt do DB");
    }

    // transaction.oncomplete = function () {
    //     console.log("Zamykanie transakcji ");
    //     db.close();
    // };
}

function rentVehicle(event) {
    event.preventDefault(); 

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
            if (updateData.rent_by == null) {
                updateData.rent_by = borrower_name;
                const updateRequest = objectStore.put(updateData);
                updateRequest.onsuccess = () => {
                    console.log(`%c ${updateData.type} marki ${updateData.brand} o numerze ID ${vehicle_id} został/a wypożyczony/a na nazwisko ${borrower_name.split(" ")[1]}\n`, 'color: green; font-size: 16px; font-weight: bold');
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

function returnVehicle(event) {
    event.preventDefault(); 
    
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

function infoVehicle(event) {
    event.preventDefault(); 

    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const objectStore = transaction.objectStore("vehicles");
    const viewAllRequest = objectStore.getAll();
    viewAllRequest.onsuccess = () => {
        console.log(viewAllRequest.result);
        const data = {};
        for (const vehicle of Object.values(viewAllRequest.result)) {
            if (vehicle.rent_by != null) break;

            data[vehicle.name] = data[vehicle.name] ? data[vehicle.name] + 1 : 1;
        }
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

function plotChart(vehicleData) {
        if (chartShowed) {
            chartShowed = false;
            myChart.destroy();
            return
        }
        
        chartShowed = true; 
        const ctx = document.getElementById('myChart');      

        // const data = {
        //     labels: Object.keys(vehicleData),
        //     datasets: [{
        //         label: 'Ilość sztuk',
        //         data: Object.values(vehicleData),
        //         // backgroundColor: [
        //         //     'rgb(0, 255, 0)',
        //         //     'rgb(0, 0, 255)',
        //         //     'rgb(255, 0, 0)'
        //         // ],
        //         hoverOffset: 4
        //     }]
        // };

        // const config = {
        //     type: 'pie',
        //     data: data,
        // };

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
                            callback: function(val, index) {
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

function returnAllVehicles(event) {
    event.preventDefault();

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

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB nie została znaleziona w twojej przeglądarce.");
}
const request = indexedDB.open("VehicleDatabase", 1);

request.onerror = function(event) {
    console.error("Błąd bazy danych IndexedDB")
    console.error(event);
}

request.onupgradeneeded = function () {
    const db = request.result;
    const objectStore = db.createObjectStore("vehicles", { keyPath: "id", autoIncrement: true });
    
    objectStore.createIndex("type", ["type"], { unique: false});
    objectStore.createIndex("brand", ["brand"], { unique: false});
    objectStore.createIndex("model", ["model"], { unique: false});
    objectStore.createIndex("name", ["name"], { unique: false});
    objectStore.createIndex("price", ["price"], { unique: false});
    objectStore.createIndex("img_url", ["img_url"], { unique: false});
    objectStore.createIndex("rent_by", ["rent_by"], { unique: false});
};

request.onsuccess = function () {
    console.log("Baza danych została otwarta pomyślnie ");   

    const population = generateRandomData(50);
    for(let vehicle of Object.values(population)) addToDB(vehicle);
    // fetch('population.json')
    //     .then(response => response.json()) 
    //     .then(data => {
    //         for(let vehicle of Object.values(data)) addToDB(vehicle);
    //     })
    //     .catch(error => console.error(error)); 
};


const rent_form = document.getElementById("rent-vehicle");
const return_form = document.getElementById("return-vehicle");
const info_form = document.getElementById("info-vehicle");
const return_all_form = document.getElementById("return-all-vehicles");
rent_form.addEventListener('submit', rentVehicle);
return_form.addEventListener('submit', returnVehicle);
info_form.addEventListener('submit', infoVehicle);
return_all_form.addEventListener('submit', returnAllVehicles)


        