let user;
let currentAction = "all";
let currentType = "";

const renderUserVehicles = (userRentedVehicles, userBoughtVehicles) => {
    document.getElementById("user-vehicles-indicator").innerHTML = `${userRentedVehicles.length + userBoughtVehicles.length}`;

    // Rented vehicles
    const rentedContainer = document.createElement('div');
    rentedContainer.classList.add('mb-2');
    rentedContainer.setAttribute('id', 'user-vehicles-list-rented-items');
    
    const rentedHeader = document.createElement('b');
    rentedHeader.classList.add('mb-2');
    if (userRentedVehicles.length !== 0) {
        rentedHeader.textContent = `Wypożyczone pojazdy: ${userRentedVehicles.length}`;
        rentedContainer.appendChild(rentedHeader);

        userRentedVehicles.forEach((userRentedVehicle) => {
            const listItem = document.createElement('div');
            listItem.classList.add('user-vehicles-list-item', 'd-flex', 'justify-content-between', 'align-items-center', 'return-item');

            const paragraph = document.createElement('p');
            paragraph.classList.add('return-item-p');
            paragraph.textContent = userRentedVehicle.name;

            const button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-outline-secondary');
            button.textContent = 'Zwróć';
            button.addEventListener('click', () => returnVehicle(userRentedVehicle._id));

            listItem.appendChild(paragraph);
            listItem.appendChild(button);
            rentedContainer.appendChild(listItem);
        });
    } else {
        rentedHeader.textContent = 'Wypożyczone pojazdy';
        rentedContainer.appendChild(rentedHeader);

        const noRentedVehiclesParagraph = document.createElement('p');
        noRentedVehiclesParagraph.classList.add('return-item-p');
        noRentedVehiclesParagraph.textContent = 'Nie posiadasz wypożyczonych pojazdów';
        rentedContainer.appendChild(noRentedVehiclesParagraph);
    }

    
    // Bought vehicles
    const boughtContainer = document.createElement('div');
    boughtContainer.classList.add('mb-2');
    boughtContainer.setAttribute('id', 'user-vehicles-list-bought-items');

    const boughtHeader = document.createElement('b');
    boughtHeader.classList.add('mb-2');
    if (userBoughtVehicles.length !== 0) {
        
        boughtHeader.textContent = `Kupione pojazdy: ${userBoughtVehicles.length}`;
        boughtContainer.appendChild(boughtHeader);

        userBoughtVehicles.forEach((userBoughtVehicle) => {
            const listItem = document.createElement('div');
            listItem.classList.add('user-vehicles-list-item', 'd-flex', 'justify-content-between', 'align-items-center', 'return-item');

            const paragraph = document.createElement('p');
            paragraph.classList.add('return-item-p');
            paragraph.textContent = userBoughtVehicle.name;

            const button = document.createElement('button');
            button.textContent = 'Zwróć';
            button.classList.add('btn');
            button.classList.add('btn-outline-secondary');
            button.addEventListener('click', () => returnVehicle(userBoughtVehicle._id));

            listItem.appendChild(paragraph);
            listItem.appendChild(button);
            boughtContainer.appendChild(listItem);
        });
    } else {
        const boughtHeader = document.createElement('b');
        boughtHeader.textContent = 'Kupione pojazdy';
        boughtContainer.appendChild(boughtHeader);

        const noBoughtVehiclesParagraph = document.createElement('p');
        noBoughtVehiclesParagraph.classList.add('return-item-p');
        noBoughtVehiclesParagraph.textContent = 'Nie posiadasz kupionych pojazdów';
        boughtContainer.appendChild(noBoughtVehiclesParagraph);
    }

    const userVehicleListRented = document.getElementById("user-vehicles-list-rented");
    const userVehicleListBought = document.getElementById("user-vehicles-list-bought");

    userVehicleListRented.innerHTML = '';
    userVehicleListBought.innerHTML = '';
    userVehicleListRented.appendChild(rentedContainer);
    userVehicleListBought.appendChild(boughtContainer);
};

function renderVehicleGroups(vehicleGroups, action) {
    document.getElementById("vehicles-indicator").innerHTML = `${vehicleGroups.length}`;

    const container = document.getElementById('vehicles-cards');
    container.innerHTML = '';

    vehicleGroups.forEach((vehicle) => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'text-bg-dark', 'mx-2');
        card.style.width = '20rem';
        card.style.padding = '0px';

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = vehicle.img_url;
        image.alt = 'Vehicle Image';
        image.style.width = '100%';
        image.style.height = '16rem';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.setAttribute('id', `${vehicle.groupIndex}`);

        const vehicleInfoTitle = document.createElement('div');
        vehicleInfoTitle.classList.add('vehicle-info-title', 'd-flex', 'flex-column', 'align-items-center');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = vehicle.name;

        vehicleInfoTitle.appendChild(title);

        const vehicleInfoPricing = document.createElement('div');
        vehicleInfoPricing.classList.add('vehicle-info-pricing', 'd-flex', 'flex-row', 'justify-content-between', 'mx-2', 'mb-4');

        const pricingTextContainer = document.createElement('div');
        const pricingValueContainer = document.createElement('div');

        if (vehicle.buy_price !== null && action !== 'rent') {
            const buyPriceText = document.createElement('p');
            buyPriceText.classList.add('card-text');
            buyPriceText.textContent = 'Cena kupna:';
            pricingTextContainer.appendChild(buyPriceText);
        }

        if (vehicle.rent_price !== null && action !== 'buy') {
            const rentPriceText = document.createElement('p');
            rentPriceText.classList.add('card-text');
            rentPriceText.textContent = 'Cena wypożyczenia:';
            pricingTextContainer.appendChild(rentPriceText);
        }

        const amountText = document.createElement('p');
        amountText.classList.add('card-text');
        amountText.textContent = 'Liczba sztuk:';
        pricingTextContainer.appendChild(amountText);

        if (vehicle.buy_price !== null && action !== 'rent') {
            const buyPriceValue = document.createElement('p');
            buyPriceValue.classList.add('card-text');
            buyPriceValue.textContent = `${vehicle.buy_price} zł`;
            pricingValueContainer.appendChild(buyPriceValue);
        }

        if (vehicle.rent_price !== null && action !== 'buy') {
            const rentPriceValue = document.createElement('p');
            rentPriceValue.classList.add('card-text');
            rentPriceValue.textContent = `${vehicle.rent_price} zł/h`;
            pricingValueContainer.appendChild(rentPriceValue);
        }

        const amountValue = document.createElement('p');
        amountValue.classList.add('card-text');
        amountValue.textContent = vehicle.amount;
        pricingValueContainer.appendChild(amountValue);

        vehicleInfoPricing.appendChild(pricingTextContainer);
        vehicleInfoPricing.appendChild(pricingValueContainer);

        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons', 'd-flex', 'flex-row', 'justify-content-evenly', 'mx-1');


        if (vehicle.buy_price !== null && action !== 'rent') {
            const buyButton = document.createElement('button');
            buyButton.classList.add('btn', 'btn-light');
            buyButton.textContent = 'Kup';
            buyButton.addEventListener('click', () => buyVehicle(vehicle.name, vehicle.groupIndex));
            actionButtons.appendChild(buyButton);
        }

        if (vehicle.rent_price !== null && action !== 'buy') {
            const rentButton = document.createElement('button');
            rentButton.classList.add('btn', 'btn-light');
            rentButton.textContent = 'Wypożycz';
            rentButton.addEventListener('click', () => rentVehicle(vehicle.name, vehicle.groupIndex));
            actionButtons.appendChild(rentButton);
        }
        

        cardBody.appendChild(vehicleInfoTitle);
        cardBody.appendChild(vehicleInfoPricing);
        cardBody.appendChild(actionButtons);

        card.appendChild(image);
        card.appendChild(cardBody);

        container.appendChild(card);
    });
}

async function requestFetchAPI(http_method, requestData) {

    let url, bodyData;
    if (http_method === "GET") {
        url = `http://localhost:8002/user?userId=${encodeURIComponent(requestData.userId)}&action=${encodeURIComponent(requestData.action)}&type=${encodeURIComponent(requestData.type)}`;
    } 
    if (http_method === "POST") {
        url = "http://localhost:8002/user"
        // const { userId, vehicleName, vehicleId, type } = requestData;
        // if(userId && vehicleName && type) {
        //     bodyData = `userId=${encodeURIComponent(userId)}&vehicleName=${encodeURIComponent(vehicleName)}&type=${encodeURIComponent(type)}`;
        // }
        // if(userId && vehicleId) { 
        //     bodyData = `userId=${encodeURIComponent(userId)}&vehicleId=${encodeURIComponent(vehicleId)}`;
        // }
    }

    try {
        const response = await fetch(url, {
            method: http_method,
            headers: {
                "Content-Type": 'application/json'
            },
            // body: bodyData ? bodyData : undefined
            body: http_method === "POST" ? JSON.stringify(requestData) : undefined
        })

        if (!response.ok)
            throw Error(response.statusText);

        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }

}


// ENDPOINT HANDLERS
const getView = async (action = "all", type = "") => {
    currentAction = action;
    currentType = type;
    console.log(`Getting view (action: ${action}, type: ${type})`);
    const data = await requestFetchAPI('GET', { action, type, userId: user._id });

    console.log(data.vehicleGroups);

    renderVehicleGroups(data.vehicleGroups, action);
    renderUserVehicles(data.userRentedVehicles, data.userBoughtVehicles);
};

const buyVehicle = async (vehicleName, groupIndex) => { 
    console.log(`Buing vehicle: ${vehicleName}`);
    const data = await requestFetchAPI('POST', { userId: user._id, vehicleName, type: 'buy'  });
    console.log(data);

    // // Add to user panel
    // const listItem = document.createElement('div');
    // listItem.classList.add('user-vehicles-list-item', 'd-flex', 'justify-content-between', 'align-items-center', 'return-item');

    // const paragraph = document.createElement('p');
    // paragraph.classList.add('return-item-p');
    // paragraph.textContent = data.vehicle.name;

    // const button = document.createElement('button');
    // button.textContent = 'Zwróć';
    // button.classList.add('btn');
    // button.classList.add('btn-outline-secondary');
    // button.addEventListener('click', () => returnVehicle(data.vehicle._id));

    // listItem.appendChild(paragraph);
    // listItem.appendChild(button);
    // document.getElementById('user-vehicles-list-bought-items').appendChild(listItem);


    // // Decrement counter or disable buttons
    // const cardElements = document.getElementById(`${groupIndex}`).childNodes;
    // cardElements[1].childNodestext[1].childNodestext[1].textContent = `Liczba sztuk: ${data.vehiclesLeft}`;
    // if (data.vehiclesLeft === 0) {
    //     cardElements[2].innerHTML = '';
    // }
    getView(currentAction, currentType);
};

const rentVehicle = async (vehicleName, groupIndex) => { 
    console.log(`Renting vehicle: ${vehicleName}`);
    const data = await requestFetchAPI('POST', { userId: user._id, vehicleName, type: 'rent' });
    console.log(data);

    // // Add to user panel
    // const listItem = document.createElement('div');
    // listItem.classList.add('user-vehicles-list-item', 'd-flex', 'justify-content-between', 'align-items-center', 'return-item');

    // const paragraph = document.createElement('p');
    // paragraph.classList.add('return-item-p');
    // paragraph.textContent = data.vehicle.name;

    // const button = document.createElement('button');
    // button.textContent = 'Zwróć';
    // button.classList.add('btn');
    // button.classList.add('btn-outline-secondary');
    // button.addEventListener('click', () => returnVehicle(data.vehicle._id));

    // listItem.appendChild(paragraph);
    // listItem.appendChild(button);
    // document.getElementById('user-vehicles-list-rented-items').appendChild(listItem);

    // const cardElements = document.getElementById(`${groupIndex}`).childNodes;
    // cardElements[1].childNodestext[1].childNodestext[1].textContent = `Liczba sztuk: ${data.vehiclesLeft}`;
    // if (data.vehiclesLeft === 0) {
    //     cardElements[2].innerHTML = '';
    // }
    getView(currentAction, currentType);
};

const returnVehicle = async (vehicleId) => { 
    console.log(`Returning vehicle ID: ${vehicleId}`);
    const data = await requestFetchAPI('POST', { userId: user._id, vehicleId });
    console.log(data);
    getView(currentAction, currentType);
};

document.addEventListener('DOMContentLoaded', function () {
    user = JSON.parse(document.getElementById("client-script").getAttribute("data-user"));
    console.log(`USER ID: ${user._id} SIGNED IN`);
    getView();
});