import mongoose from 'mongoose';
import morgan from 'morgan';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import { MONGODB_URI, PORT_LISTEN } from '#root/config.js'


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
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', __dirname + '/src/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug'); // Use the 'Pug' template system
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment

/* ************************************************ */

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: false })); // for parsing form sent data

/* ******** */
/* "Routes" */
/* ******** */

import indexRouter from './src/routes/indexRouter.js';
import adminRouter from './src/routes/adminRouter.js';
import userRouter from './src/routes/userRouter.js';

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

/* ************************************************ */

app.listen(PORT_LISTEN, function () {
    console.log('================================');
    console.log(`The server was started on port ${PORT_LISTEN}`);
    console.log('To stop the server, press "CTRL + C"');
    console.log('================================');
    console.log('Incoming HTTP requests...');
    console.log('================================');
});    