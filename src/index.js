"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql2_1 = require("drizzle-orm/mysql2");
var promise_1 = require("mysql2/promise");
var connection = await promise_1.default.createConnection({
    host: "svc-446b8c45-7bf8-4130-b24b-b4a98e5e253a-dml.aws-virginia-5.svc.singlestore.com",
    port: 3306,
    user: "admin",
    password: 'wNVe5VzKQPXHAqvxIzr0cgJGs73pnY2N',
    database: "test1"
});
var db = (0, mysql2_1.drizzle)(connection);
