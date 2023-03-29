// const DBDeleteRequest = window.indexedDB.deleteDatabase("VehicleDatabase");

const mockup = {
    1: {
        model_id: 1,
        type: "rower wyścigowy",
        brand: "BOTTECCHIA",
        img_url: "https://a.allegroimg.com/s1024/0c8ff0/ffd228304675a5472e03be4fdf3b",
        rent_by: null
    },
    2: {
        model_id: 2,
        type: "rower wyścigowy",
        brand: "BOTTECCHIA",
        img_url: "https://a.allegroimg.com/s1024/0c8ff0/ffd228304675a5472e03be4fdf3b",
        rent_by: null
    },
    3: {
        model_id: 1,
        type: "rower górski",
        brand: "Kross Hexagon",
        img_url: "https://www.greenbike.pl/images/hexagon_black_white_graphite_glossy22.jpg",
        rent_by: "Jan Kowalski"
    },
    4: {
        model_id: 2,
        type: "rower górski",
        brand: "Kross Hexagon",
        img_url: "https://www.greenbike.pl/images/hexagon_black_white_graphite_glossy22.jpg",
        rent_by: "Justyna Kowalska"
    },
    5: {
        model_id: 1,
        type: "hulajnoga",
        brand: "TECHLIFE",
        img_url: "https://e-hulajnoga.pl/public/assets/techlife/x8/1.jpg",
        rent_by: null
    },
}

function rentVehicle(event) {
    event.preventDefault(); 

    const input = document.getElementById('rent-vehicle-input');
    const form_arguments = input.value.split(', ');
    if (form_arguments.length != 2) {
        console.log("%c Niepoprawna ilość argumentów. Oczekiwano 2.\nPrzykład argumentów: '23, Jan Kowalski'\n", "color: red");
        return
    }

    const vehicle_id = Number.parseInt(form_arguments[0]);
    const borrower_name = form_arguments[1];

    // if (!mockup.hasOwnProperty(vehicle_id)) {
    //     console.log("%c Nie ma takiego pojazdu w bazie danych\n", 'color: red');
    //     return
    // }
    // const vehicle = mockup[vehicle_id];

    // if (vehicle.rent_by == null) {
    //     mockup[vehicle_id].rent_by = borrower_name;

    //     console.log(`%c ${vehicle.type} marki ${vehicle.brand} o numerze ${vehicle_id} został/a wypożyczony/a na nazwisko ${borrower_name.split(" ")[1]}\n`, 'color: green');
    // } else {
    //     console.log("%c Pojazd ten już został przez kogoś wypożyczony\n", 'color: red');
    // }

    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const store = transaction.objectStore("vehicles");
    const idQuery = store.get(vehicle_id);

    idQuery.onsuccess = function () {
        const vehicle = idQuery.result;
        
        if (vehicle.rent_by == null) {
            
            vehicle.rent_by = borrower_name;

            const updateVehicleRequest = store.update(vehicle);

            updateVehicleRequest.onsuccess = () => {
                console.log(`%c ${vehicle.type} marki ${vehicle.brand} o numerze ${vehicle_id} został/a wypożyczony/a na nazwisko ${borrower_name.split(" ")[1]}\n`, 'color: green');
            }
            db.close();

        } else {
            console.log("%c Pojazd ten już został przez kogoś wypożyczony\n", 'color: red');
            db.close();
            return
        }
    };

    idQuery.onerror = function () {
        console.log("%c Nie ma takiego pojazdu w bazie danych\n", 'color: red');
        db.close();
        return
    }
    
    transaction.oncomplete = function () {
        console.log("Zamykanie transakcji ");
        db.close();
    };
}


function returnVehicle(event) {
    event.preventDefault(); 
    
    const input = document.getElementById('return-vehicle-input');
    const form_arguments = input.value.split(', ');
    if (form_arguments.length != 2) {
        console.log("%c Niepoprawna ilość argumentów. Oczekiwano 2.\nPrzykład argumentów: '11, Janusz Tracz'\n", "color: orange");
        return
    }
    
    const vehicle_id = Number.parseInt(form_arguments[0]);
    const borrower_name = form_arguments[1];
    
    
    if (!mockup.hasOwnProperty(vehicle_id)) {
        console.log("%c Nie ma takiego pojazdu w bazie danych\n", "color: red");
        return
    }
    const vehicle = mockup[vehicle_id];
    
    if (vehicle.rent_by != null && borrower_name.localeCompare(vehicle.rent_by) == 0) {
        vehicle.rent_by = null;

        console.log(`%c Pan/Pani ${borrower_name} zwraca ${vehicle.type} marki ${vehicle.brand} o numerze ${vehicle_id}\n`, 'color: green');
    }
    else {
        console.log(`%c Pan/Pani ${borrower_name} nie wypożyczył/a tego pojazdu\n`, 'color: red');
    }

}


function infoVehicle(event) {
    event.preventDefault(); 

    // for (const [key, value] of Object.entries(mockup)) {
    //     console.log({key}, value);
    // };
    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const store = transaction.objectStore("vehicles");
    let viewAllRequest = store.getAll();
    viewAllRequest.onsuccess = (event) => {
        console.log("Wszystkie pojazdy:");
        let vehicles = viewAllRequest.result;
        console.log(vehicles);
        for (let i = 0; i < vehicles.length; i++) {
            console.log("ID pojazdu: " + vehicles[i].id);
            console.log("ID modelu: " + vehicles[i].model_id);
            console.log("Rodzaj pojazdu: " + vehicles[i].type);
            console.log("Marka: " + vehicles[i].brand);
            console.log("URL zdjęcia: " + vehicles[i].img_url);
            console.log("Wypożyczający: " + vehicles[i].rent_by);
            console.log("-----------------------");
        }
    }
}

function dbQuery() {
    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");

    const store = transaction.objectStore("vehicles");
    const model_idIndex = store.index("model_id");
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
    const store = db.createObjectStore("vehicles", { keyPath: "id" });
    
    store.createIndex("model_id", ["model_id"], { unique: false});
    store.createIndex("type", ["type"], { unique: false});
    store.createIndex("brand", ["brand"], { unique: false});
    store.createIndex("img_url", ["img_url"], { unique: false});
    store.createIndex("rent_by", ["rent_by"], { unique: false});
};

request.onsuccess = function () {
    console.log("Baza danych została otwarta pomyślnie ");

    const db = request.result;

};


const rent_form = document.getElementById("rent-vehicle");
const return_form = document.getElementById("return-vehicle");
const info_form = document.getElementById("info-vehicle");
rent_form.addEventListener('submit', rentVehicle);
return_form.addEventListener('submit', returnVehicle);
info_form.addEventListener('submit', infoVehicle);


