function dbQuery(request) {
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

function addToDB(request, item) {
    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");
    const objectStore = transaction.objectStore("vehicles");

    const addRequest = objectStore.put(item);

    addRequest.onsuccess = () => {
        // console.log(item, "Udało sie dodac obiekt do DB");
        console.log("Udało sie dodac obiekt do DB");
    }
}

function getLatestDataFromDB(request) {
    const db = request.result;
    const transaction = db.transaction("vehicles", "readwrite");
    const objectStore = transaction.objectStore("vehicles");
    const viewAllRequest = objectStore.getAll();
    viewAllRequest.onsuccess = () => {
        console.log("GOT LATEST DATA FROM DBs");
        return viewAllRequest.result;
    }
}

export { dbQuery, addToDB, getLatestDataFromDB }