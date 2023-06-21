import fs from 'fs'
import { argv } from "node:process";

// For generating fullname rental
const firstNames = [
    "Michał",
    "Kamil",
    "Piotr",
    "Paulina",
    "Katarzyna",
    "Anna",
];

const lastNames = [
    "Nowak",
    "Woźniak",
    "Kowalczyk",
    "Wójcik",
];

const generatorBase = {
    "Rower górski": {
        'Bottecchia': {
            "XC3": {
                buy_price: 1000,
                rent_price: null,
                img_url: "https://www.centrumrowerowe.pl/photo/product/oxfeld-xc-6-2-174027-f-sk7-w780-h554_1.webp",
            },
            "Alfa-2": {
                buy_price: 1200,
                rent_price: 10,
                img_url: "https://www.centrumrowerowe.pl/photo/product/oxfeld-xc-2w-2-160842-f-sk7-w780-h554_1.webp",
            },
        },
        'Kross Hexagon': {
            "AW10": {
                buy_price: 900,
                rent_price: 10,
                img_url: "https://nicebike.pl/1066-large_default/rower-gorski-mtb-shimano-aluminiowy-275-nicebike.jpg",
            },
            "Ultra": {
                buy_price: null,
                rent_price: 10,
                img_url: "https://prod-api.mediaexpert.pl/api/images/gallery_500_500/thumbnails/images/35/3537633/INDIANA-X-Enduro-7-7-M19-27-5-cala-meski-Szaro-czarny-new.jpg",
            },
            "SS-2": {
                buy_price: null,
                rent_price: 10,
                img_url: "https://prod-api.mediaexpert.pl/api/images/gallery/thumbnails/images/37/3758290/MBM-Quarx-M19-29-cali-meski-Zolty-skos.JPG",
            },
        },
        'Ridley': {
            "XYZ": {
                buy_price: 1150,
                rent_price: 10,
                img_url: "https://sklep.szprychy.com/img/41080/rower-gorski-husar-m18-27-5-zielony",
            },
            "Speed-10": {
                buy_price: 1300,
                rent_price: null,
                img_url: "https://www.centrumrowerowe.pl/photo/product/ridley-sablo-fs-c-xt-2-173184-f-sk7-w780-h554_1.png",
            },
            "UX-2": {
                buy_price: 1400,
                rent_price: null,
                img_url: "https://www.bike4race.pl/pol_pl_Rower-MTB-RIDLEY-IGNITE-CSL9-1-29-kolor-IC-01BM-Shimano-XTR-652_1.jpg",
            },
        },

    },
    "Hulajnoga": {
        'UrbanRacer': {
            "XVF": {
                buy_price: null,
                rent_price: 10,
                img_url: "https://www.rebelelectro.com/userdata/public/gfx/57594/photo_2344300.png",
            },
        },
        "Striker": {
            "A10": {
                buy_price: 2000,
                rent_price: null,
                img_url: "https://7way.pl/1909-large_default/hulajnoga-elektryczna-ruptor-r3-800w-175ah-48v.jpg",
            },
            "X-2": {
                buy_price: 1000,
                rent_price: 10,
                img_url: "https://img.movino.com/pl/tmp/5/5/0/c/hulajnoga-trojkolowa-elektryczna-cariboo-easygo-pink-a3b9.640x640-cq80.jpg",
            },
        },
        'Techlife': {
            "JX3": {
                buy_price: 3000,
                rent_price: null,
                img_url: "https://e-hulajnoga.pl/public/assets/techlife/x8/1.jpg",
            },
            "Alpha-10": {
                buy_price: 2500,
                rent_price: null,
                img_url: "https://hulajnogi-ranking.pl/wp-content/uploads/sites/2/2019/09/Techlife-X2-1492-12.jpg",
            },
        },
        'Oxfeld': {
            "Omega-X": {
                buy_price: 1000,
                rent_price: null,
                img_url: "https://motorq.pl/wp-content/uploads/2021/09/00_MG_3683-Edit_.png",
            },
        },
    },
    "Rower wyścigowy": {
        'Oxfeld': {
            "V-2": {
                buy_price: null,
                rent_price: 10,
                img_url: "https://media.cyclosport.pl/v/0502e4c7d080cd26c93d02301a21f9e9/_DSC2918.co.jpg",
            },
            "V-3": {
                buy_price: null,
                rent_price: 10,
                img_url: "https://www.centrumrowerowe.pl/photo/product/oxfeld-cr-1w-2-160848-f-sk6-w1550-h1080.png",
            },
            "X-1": {
                buy_price: 2000,
                rent_price: null,
                img_url: "https://media.cyclosport.pl/v/926a1518f4c8df3cea03e762cf9b12b9/_DSC1998gotowy1280.co.jpg",
            },
        },
        'Indiana': {
            "Racer-X": {
                buy_price: 1700,
                rent_price: 10,
                img_url: "https://images.internetstores.de/products/1490639/02/cb8e17/orbea-orca-m30-metallic-electric-orange-black-2.jpg?forceSize=true&forceAspectRatio=true&useTrim=true&size=613x613",
            },
            "Speed": {
                buy_price: null,
                rent_price: 10,
                img_url: "https://www.bikechill.pl/media/catalog/product/cache/7bfce8425c5ba92962c1430cf13ac27a/r/o/rower-orbea-orca-m30i-57cm-105-di2-rocznik-2023_1_1.jpg",
            },
            "GX5": {
                buy_price: 1600,
                rent_price: 10,
                img_url: "https://www.centrumrowerowe.pl/photo/product/ridley-liz-sla-disc-2-161412-f-sk7-w780-h554_1.png",
            },
        },
        'MBM': {
            "Extreme": {
                buy_price: 2000,
                rent_price: null,
                img_url: "https://a.allegroimg.com/s1024/0c8ff0/ffd228304675a5472e03be4fdf3b",
            },
        },
    },
}

function generateRandomVehiclesData(numRecords) {
    // const data = {};
    
    const vehicles = [];
    for (let i = 0; i < numRecords; i++) {
        let canBeBought = false;
        let canBeRent = false;
        while (!canBeBought && !canBeRent) {
            canBeBought = Math.round(Math.random()) == 0 ? false : true;
            canBeRent = Math.round(Math.random()) == 0 ? false : true;
        }

        const types = Object.keys(generatorBase);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const brands = Object.keys(generatorBase[randomType]);
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        const models = Object.keys(generatorBase[randomType][randomBrand]);
        const randomModel = models[Math.floor(Math.random() * models.length)];
        let record = {
        // data[i] = {
            // vehicle_id: i,
            type: randomType,
            brand: randomBrand,
            model: randomModel,
            name: randomType + " " + randomBrand + " " + randomModel,
            buy_price: generatorBase[randomType][randomBrand][randomModel].buy_price,
            rent_price: generatorBase[randomType][randomBrand][randomModel].rent_price,
            img_url: generatorBase[randomType][randomBrand][randomModel].img_url,
            rented_by: null,
            bought_by: null,
        };
        vehicles.push(record);
    }
    // data.vehicles = vehicles;
    // return data;

    return vehicles;
}

function generateRandomPeopleData(numRecords) {
    // const data = {};
    
    const users = [];
    for (let i = 0; i < numRecords; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        // data[i] = {
        let record = {
            user_id: i,
            type: "customer",
            first_name: firstName,
            last_name: lastName,
            login: "xxx",
            password: "xxx",
        };
        users.push(record);
    }
    // data.users = users;
    // return data;
    return users;
}

function generateJSONDB(vehiclesNo=0, peopleNo=0) {
    if (vehiclesNo !== 0) {
        const dataVehicles = generateRandomVehiclesData(vehiclesNo);
        const jsonVehicles = JSON.stringify(dataVehicles, null, 4);

        fs.writeFile('./vehicles.json', jsonVehicles, 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Wygenerowano vehicles.json - ${vehiclesNo} rekordów`);
            }
        });
    }

    if (peopleNo !== 0) {
        const dataPeople = generateRandomPeopleData(peopleNo);
        const jsonPeople = JSON.stringify(dataPeople, null, 4);

        fs.writeFile('./users.json', jsonPeople, 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Wygenerowano users.json - ${usersNo} rekordów`);
            }
        });
    }
}

const vehiclesNo = Number.parseInt(argv[2]);
const usersNo = Number.parseInt(argv[3]);

if (Number.isNaN(vehiclesNo) || Number.isNaN(usersNo)) {
    console.log("Invalid arguments.\nUsage:\n\tnpm run gen_new_db <vehicles_number> <customers_number>");
} else {
    generateJSONDB(vehiclesNo, usersNo)
}
