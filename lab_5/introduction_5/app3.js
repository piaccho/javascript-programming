import express, { query } from 'express';
import morgan from 'morgan';
import path from 'path';
import mongodb from 'mongodb'
import { fileURLToPath } from 'url';

const port = 8001;

let students = {};

async function getDbData(department="") {
    const MongoClient = mongodb.MongoClient;
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('AGH');
    const collection = db.collection('students');
    const query = department === "" ? {} : {'faculty': department};
    students = await collection.find(query).toArray();
    client.close();
}

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', __dirname + '/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug'); // Use the 'Pug' template system
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment

/* ************************************************ */

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public')); 
app.use(express.urlencoded({ extended: false })); // for parsing form sent data


/* ******** */
/* "Routes" */
/* ******** */

app.get('/', async function (request, response) {
    await getDbData();
    response.render('index', { mode: true, students: students}); // Render the 'index' view
});

app.get('/submit', function (request, response) {
    response.set('Content-Type', 'text/plain')
    response.send(`Hello ${request.query.name}`); // Send a response to the browser
});

app.post('/', function (request, response) {
    response.set('Content-Type', 'text/plain')
    response.send(`Hello ${request.body.name}`);
});

app.get('/query', async function(request, response) {
    await getDbData(request.query.department);
    response.render('index', { mode: true, students: students}); 
})

/* ************************************************ */

app.listen(port, function () {
    console.log(`The server was started on port ${port}`);
    console.log('To stop the server, press "CTRL + C"');
});          