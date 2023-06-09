// @deno-types="npm:@types/express@^4"

// Deno include strict mode since Deno use ES6 
// Deno doesnt include typing as default
//  for check typing: 
//      deno check app.ts
//      deno run --check app.ts  
//  for restarting app on file change:
//      deno run --watch app.ts 
//  for allowing permissions (read, env vars, network):
//      deno run --allow-read --allow-env --allow-net app.ts

//      deno run --check --watch --allow-read --allow-env --allow-net app.ts


import express, { Express, Request, Response } from "npm:express@^4";
import morgan from "npm:morgan@^1";
import "npm:pug@^3";

const app: Express = express();
const deno_logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Deno_2021.svg/120px-Deno_2021.svg.png';

app.set('views', './views');
app.set('view engine', 'pug');
app.locals.pretty = app.get('env') === 'development';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

app.get('/', function (_req: Request, res: Response) {
    res.render('index', {deno_logo});
});

app.post('/', function (req: Request, res: Response) {
    res.send(`Hello '${req.body.name}'`); 
});

app.listen(8001, function () {
    console.log('The application is available on port 8001');
});        