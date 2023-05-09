const serverURL = "http://localhost:5501";
let dbItems = [];

let currentFilters = null;
let actionFilterSet;
let typeFilterSet;
let currentAction = null;
let currentId = null;

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

async function apiGetDBRequest() {
    await fetch(`${serverURL}/api/vehicles`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("Database has been fetched succesfully");
        console.log(`Fetched ${Object.keys(data.vehicles).length} records of vehicles data`);
        dbItems = data.vehicles;
    })
}

async function apiActionRequest(event, action) {
    event.preventDefault();
    let dataToPass = {
        arguments: document.querySelector(`#${action}-args`).value
    } 
    await fetch(`${serverURL}/api/${action}`, {
            method: 'POST',
            mode: "no-cors",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToPass)
        }).then(response => response.json()).then(data => console.log({data}))
}

async function renderPage(filters) {
    await apiGetDBRequest();
    
    const vehicleCards = [];
    const vehicleListings = [];

    if (currentFilters === null || 
        (currentFilters.filterAction !== filters.filterAction || 
            currentFilters.filterType !== filters.filterType)
        ) {
        actionFilterSet = ["rent", "buy"];
        typeFilterSet = ["Rower wyścigowy", "Rower górski", "Hulajnoga"];
        currentFilters = { ...filters }
    }

    setFilters(filters, actionFilterSet, typeFilterSet);

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
            currentAction = mode; currentId = id;
            console.log({ currentAction, currentId }); document.getElementById("vehicle-card-action").innerText = text;

        }} actiontype={mode} vehicleid={id} type={`button`} className={`btn btn-light`} data-bs-toggle={`modal`} data-bs-target={`#exampleModal`} style={{ width: '45%' }}>
            {text}
        </button>
    }

    const filteredObjects = Object.values(dbItems).filter(item => 
        typeFilterSet.includes(item.type) && 
        ((actionFilterSet.includes("buy") && item.buy_price !== null) || (actionFilterSet.includes("rent") && item.rent_price !== null)) 
     )

    // console.log({filteredObjects});

    // VEHICLES CARDS
    for (const vehicle of filteredObjects) {
        if (vehicle.rent_by === null && vehicle.bought_by === null) {
            let buy_btn = "";
            let buy_label = ""; 
            let buy_lable_price = ""; 
            let rent_btn = "";
            let rent_label = "";
            let rent_label_price = ""; 
            if (vehicle.buy_price !== null && actionFilterSet.includes("buy")) {
                buy_btn = ActionButton("buy", vehicle.vehicle_id);
                buy_label = <p className={`card-text`}>Cena kupna:</p>; 
                buy_lable_price = <p className={`card-text`}>{vehicle.buy_price}zł</p>; 
            }
            if (vehicle.rent_price !== null && actionFilterSet.includes("rent")) {
                rent_btn = ActionButton("rent", vehicle.vehicle_id);
                rent_label = <p className={`card-text`}>Cena wypożyczenia:</p>;
                rent_label_price = <p className={`card-text`}>{vehicle.rent_price}zł/h</p>; 

            }

            let infoPricingElement = <div className={`vehicle-info-pricing d-flex flex-row justify-content-between mx-2 mb-4`}>
                <div>
                    {buy_label}
                    {rent_label}
                </div>
                <div>
                    {buy_lable_price}
                    {rent_label_price}
                </div>
            </div>

            let infoTitleElement;
            if (typeFilterSet.includes("Rower górski") && typeFilterSet.includes("Rower górski") && typeFilterSet.includes("Hulajnoga")) {
                infoTitleElement = (<div className={`vehicle-info-title d-flex flex-column align-items-center`}>
                    <h5 className={`card-title mb-3`}>{vehicle.name}</h5>
                    <h5 className={`card-title mb-3`}>#{vehicle.vehicle_id}</h5>
                </div>);
            } else {
                infoTitleElement = (<div className={`vehicle-info-title d-flex flex-column align-items-center`}>
                    <h5 className={`card-title`}>{vehicle.brand}</h5>
                    <h5 className={`card-title`}>{vehicle.model} </h5>
                    <h5 className={`card-title mb-3`}>#{vehicle.vehicle_id}</h5>
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
                            {buy_btn}
                            {rent_btn}
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

function initEvents() {
    // modify DB

    // document.getElementById("rent-vehicle").addEventListener('submit', async (e) => {
    //     await apiActionRequest(e, "rent");
    //     // renderPage(currentFilters);
    // });
    document.getElementById("buy-vehicle").addEventListener('submit', async (e) => {
        await apiActionRequest(e, "buy");
        // renderPage(currentFilters);
    });
    document.getElementById("return-vehicle").addEventListener('submit', async (e) => {
        await apiActionRequest(e, "return");
        // renderPage(currentFilters);
    });
    document.getElementById("return-all-vehicles").addEventListener('submit', async (e) => {
        await apiActionRequest(e, "return-all");
        // renderPage(currentFilters);
    })
    document.getElementById("vehicle-card-action").addEventListener('click', async (e) => {
        let owner = document.getElementById("vehicle-card-action-owner").value;
        console.log({owner});
        const mode = currentAction === 0 ? "rent" : "buy";
        // mode = 0 - rent
        // mode = 1 - buy
        await fetch(`${serverURL}/api/${mode}`, {
            method: 'POST',
            mode: "no-cors",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({arguments: currentId + ", " + owner.split(" ").join(", ")})
        }).then(response => console.log(response))
        // renderPage(currentFilters);
    })

    // document.getElementById("info-vehicle-btn").addEventListener('click', async (e) => {
    //     await apiGetDBRequest();
    //     infoVehicle(dbItems, e);
    // });
    document.getElementById("main-page").addEventListener('click', () => { renderPage({}) });
    document.getElementById("rent-bike").addEventListener('click', () => { renderPage({ filterAction: "rent", filterType: "bike" }) });
    document.getElementById("rent-scooter").addEventListener('click', () => { renderPage({ filterAction: "rent", filterType: "scooter" }) });
    document.getElementById("buy-bike").addEventListener('click', () => { renderPage({ filterAction: "buy", filterType: "bike" }) });
    document.getElementById("buy-scooter").addEventListener('click', () => { renderPage({ filterAction: "buy", filterType: "scooter" }) });
}



initEvents();
await renderPage({});



