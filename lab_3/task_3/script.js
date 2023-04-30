import { generateRandomData } from './randomDB.js';
import { dbQuery, addToDB, getLatestDataFromDB } from './dbFunctions.js'
import { infoVehicle, rentVehicle, buyVehicle, returnVehicle, unrentAllVehicles, vehicleCardAction} from './appActions.js'
const DB_SIZE = 50;
let dbItems = [];
let currentFilters = null;
let actionFilterSet;
let typeFilterSet;
let currentAction = null;
let currentId = null;

const recordDBTemplate = ["id", "type", "brand", "model", "price", "img_url", "rent_by", "bought_by", "vehicle_id"]

window.indexedDB.deleteDatabase("VehicleDatabase");


function setFilters(inputFilters, actionFilters, typeFilters) {
    if (inputFilters.filterAction === "rent") {
        let index = actionFilters.indexOf("buy");
        if (index > -1) {
            actionFilters.splice(index, 1);
        }
    }
    if (inputFilters.filterAction === "buy") {
        let index = actionFilters.indexOf("rent");
        if (index > -1) {
            actionFilters.splice(index, 1);
        }
    }
    if (inputFilters.filterType === "bike") {
        let index = typeFilters.indexOf("Hulajnoga");
        if (index > -1) {
            typeFilters.splice(index, 1);
        }
    }
    if (inputFilters.filterType === "scooter") {
        let index = typeFilters.indexOf("Rower wyścigowy");
        if (index > -1) {
            typeFilters.splice(index, 1);
        }
        index = typeFilters.indexOf("Rower górski");
        if (index > -1) {
            typeFilters.splice(index, 1);
        }
    }
}


function renderPage(filters, init = false) {
    if (!init) {
        const db = request.result;
        const transaction = db.transaction("vehicles", "readwrite");
        const objectStore = transaction.objectStore("vehicles");
        const viewAllRequest = objectStore.getAll();
        viewAllRequest.onsuccess = () => {
            // console.log("GOT LATEST DATA FROM DBs");
            dbItems = viewAllRequest.result;
            renderPage(filters, true);
        }
    } else {
        const vehicleCards = [];
        const vehicleListings = [];

        if (currentFilters === null || (currentFilters.filterAction !== filters.filterAction || currentFilters.filterType !== filters.filterType)) {
            actionFilterSet = ["rent", "buy"];
            typeFilterSet = ["Rower wyścigowy", "Rower górski", "Hulajnoga"];
            currentFilters = {...filters}
        }

        setFilters(filters, actionFilterSet, typeFilterSet);

        // VEHICLES CARDS
        for (const vehicle of Object.values(dbItems)) {
            // console.log(vehicle);
            if (vehicle.rent_by === null && vehicle.bought_by === null && typeFilterSet.includes(vehicle.type)) {
                let priceTypesElements = [];
                let priceElements = [];
                if (actionFilterSet.includes("buy")) {
                    if (vehicle.buy_price === null) continue;
                    let type = <p className={`card-text`}>Cena kupna:</p>;
                    let price = <p className={`card-text`}>{vehicle.buy_price}zł</p>;
                    priceTypesElements.push(type);
                    priceElements.push(price);
                }
                if (actionFilterSet.includes("rent")) {
                    if (vehicle.rent_price === null) continue;
                    let type = <p className={`card-text`}>Cena wypożyczenia:</p>;
                    let price = <p className={`card-text`}>{vehicle.rent_price}zł/h</p>;
                    priceTypesElements.push(type);
                    priceElements.push(price);
                }

                let infoPricingElement = <div className={`vehicle-info-pricing d-flex flex-row justify-content-between mx-2 mb-4`}>
                    <div>
                        {priceTypesElements}
                    </div>
                    <div>
                        {priceElements}
                    </div>
                </div>

                function ActionButton(type, id) {
                    let text;
                    let mode;
                    if (type == "rent") {
                        text = "Wypożycz";
                        mode = 0;
                    } else {
                        text = "Kup";
                        mode = 1;
                    }
                    return <button onClick={() => {
                            currentAction = mode; currentId = id; console.log({currentAction, currentId}); document.getElementById("vehicle-card-action").innerText = text;

                        }} actiontype={mode} vehicleid={id} type={`button`} className={`btn btn-light`} data-bs-toggle={`modal`} data-bs-target={`#exampleModal`} style={{ width: '45%' }}>
                        {text}
                    </button>
                }

                let infoTitleElement;
                if ("a" === "a") {
                    infoTitleElement = (<div className={`vehicle-info-title d-flex flex-column align-items-center`}>
                        <h5 className={`card-title mb-3`}>{vehicle.name}</h5>
                        <h5 className={`card-title mb-3`}>#{vehicle.id}</h5>
                    </div>);
                } else {
                    infoTitleElement = (<div className={`vehicle-info-title d-flex flex-column align-items-center`}>
                        <h5 className={`card-title`}>{vehicle.type}</h5>
                        <h5 className={`card-title`}>{vehicle.brand} </h5>
                        <h5 className={`card-title mb-3`}>#{vehicle.id}</h5>
                    </div>);
                }

                const vehicleCardElement = (
                    <div className={`card mb-3 text-bg-dark`} style={{ maxWidth: '20rem', padding: '0' }}>
                        <img src={vehicle.img_url} className={`card-img-top`} alt={"..."}
                            style={{ width: '100%', height: '16rem' }} />
                        <div className={`card-body`}>
                            {infoTitleElement}
                            {infoPricingElement}
                            <div className={`action-buttons d-flex flex-row justify-content-evenly mx-1`}>
                                {ActionButton("buy", vehicle.id)}
                                {ActionButton("rent", vehicle.id)}
                            </div>
                        </div>
                    </div>
                );

                vehicleCards.push(vehicleCardElement);
            }
        }

        // VEHICLES LIST
        const vehiclesSummary = {};
        for (const vehicle of Object.values(dbItems)) {
            if (vehicle.rent_by === null && vehicle.bought_by === null && typeFilterSet.includes(vehicle.type))
                vehiclesSummary[vehicle.name] = vehiclesSummary[vehicle.name] ? vehiclesSummary[vehicle.name] + 1 : 1;
        }

        let i = 1;
        for (const [key, value] of Object.entries(vehiclesSummary)) {
            const vehicleListingElement = (
                <tr>
                    <th scope={"row"}>{i}</th>
                    <td>{key}</td>
                    <td>{value}</td>
                </tr>
            );
            i++;
            vehicleListings.push(vehicleListingElement);
        }

        ReactDOM.render(
            vehicleCards,
            document.getElementById('vehicles-cards')
        );
        ReactDOM.render(
            vehicleListings,
            document.getElementById('vehicles-list')
        );
    }
}

function initEvents() {
    // modify DB
    document.getElementById("rent-vehicle").addEventListener('submit', (e) => { 
        rentVehicle(request, e);
        renderPage(currentFilters);
    });
    document.getElementById("buy-vehicle").addEventListener('submit', (e) => { 
        buyVehicle(request, e);
        renderPage(currentFilters);
    });
    document.getElementById("return-vehicle").addEventListener('submit', (e) => { 
        returnVehicle(request, e);
        renderPage(currentFilters);
    });
    document.getElementById("return-all-vehicles").addEventListener('submit', (e) => { 
        unrentAllVehicles(request, e);
        renderPage(currentFilters);
    })
    document.getElementById("vehicle-card-action").addEventListener('click', (e) => {
        let owner = document.getElementById("vehicle-card-action-owner").value;
        vehicleCardAction(request, currentAction, currentId, owner);
        // div.classList.remove('show');
        renderPage(currentFilters);
    })

    
    document.getElementById("info-vehicle").addEventListener('submit', (e) => {
        getLatestDataFromDB(request);
        infoVehicle(request, e);
    });
    document.getElementById("main-page").addEventListener('click', () => { renderPage({}) });
    document.getElementById("rent-bike").addEventListener('click', () => { renderPage({ filterAction: "rent", filterType: "bike" }) });
    document.getElementById("rent-scooter").addEventListener('click', () => { renderPage({ filterAction: "rent", filterType: "scooter" }) });
    document.getElementById("buy-bike").addEventListener('click', () => { renderPage({ filterAction: "buy", filterType: "bike" }) });
    document.getElementById("buy-scooter").addEventListener('click', () => { renderPage({ filterAction: "buy", filterType: "scooter" }) });
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

request.onerror = function (event) {
    console.error("Błąd bazy danych IndexedDB")
    console.error(event);
}

request.onupgradeneeded = function () {
    const db = request.result;
    const objectStore = db.createObjectStore("vehicles", { keyPath: "id", autoIncrement: true });

    for (let attribute of recordDBTemplate) {
        objectStore.createIndex(attribute, [attribute], { unique: false });
    }
};

// DATA INITALIZATION ON PAGE
request.onsuccess = function () {
    console.log("Baza danych została pomyślnie otwarta");

    dbItems = generateRandomData(DB_SIZE);
    console.log(`Dodaje ${DB_SIZE} obiektów do bazy`);
    for (let vehicle of Object.values(dbItems)) addToDB(request, vehicle);
    let index = 1;
    for(const item of Object.values(dbItems)) item.id = index++;
    dbItems = Object.values(dbItems);
    renderPage({}, true);
};

initEvents();




