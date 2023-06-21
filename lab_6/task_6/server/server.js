import mongoose from 'mongoose';
import morgan from 'morgan';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import { MONGODB_URI, CLIENT_PORT_LISTEN ,SERVER_PORT_LISTEN } from '#root/config.js'
import cors from 'cors';

// connect to db
await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database', err);
        process.exit();
    });

/* *************************** */
/* Configuring the application */
/* *************************** */
const app1 = express();
const app2 = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app1.set('views', __dirname + '/src/views'); // Files with views can be found in the 'views' directory
app1.set('view engine', 'pug'); // Use the 'Pug' template system
app1.use(express.static(path.join(__dirname, 'src/public')));
app1.locals.pretty = app1.get('env') === 'development'; // The resulting HTML code will be indented in the development environment
app1.use(express.urlencoded({ extended: false })); // fo

/* ************************************************ */

app2.use(morgan('dev'));
app2.use(express.static(path.join(__dirname, 'src/public')));
app2.use(express.urlencoded({ extended: false })); // for parsing form sent data
app2.use(cors());

/* ******** */
/* "Routes" */
/* ******** */

import indexRouter from './src/routes/indexRouter.js';
import adminRouter from './src/routes/adminRouter.js';
import userRouter from './src/routes/userRouter.js';

app1.use('/', indexRouter);
app2.use('/user', userRouter);
app2.use('/admin', adminRouter);

/* ************************************************ */

app1.listen(CLIENT_PORT_LISTEN, function () {
    console.log('================================');
    console.log(`The client server was started on port ${CLIENT_PORT_LISTEN}`);
    console.log('To stop the server, press "CTRL + C"');
    console.log('================================');
    console.log();
});
app2.listen(SERVER_PORT_LISTEN, function () {
    console.log('================================');
    console.log(`The server was started on port ${SERVER_PORT_LISTEN}`);
    console.log('To stop the server, press "CTRL + C"');
    console.log('================================');
    console.log('Incoming HTTP requests...');
    console.log('================================');
});    