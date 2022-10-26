import "reflect-metadata";
import {container} from "tsyringe";
import {Request, Response, NextFunction} from "express";
import * as dotenv from 'dotenv';
const path = require('path');

dotenv.config({path: path.resolve?.(__dirname, '../.env')})

import helmet from "helmet";
import {CorsOptions} from "cors";

const express = require('express')
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
//CORS middleware
const corsOptions: CorsOptions = {
    credentials: true,
    methods: 'GET,PUT,PATCH, POST,DELETE,OPTIONS',
    allowedHeaders: 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(helmet({
    //disable helmet CORS handling as "cors" package is already handling it.
    crossOriginResourcePolicy: false
}));

/* POST new annotation. */
app.get('/ping',
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            res.status(201);
            res.send("pong");
        } catch (e) {
            next(e);
        }
    });

console.info(`Booted. Now listening on port ${process.env.PORT || 3000}.`);
app.listen(process.env.PORT || 3000);
module.exports = app;
