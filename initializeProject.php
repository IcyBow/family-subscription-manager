<?php 

$db = new SQLite3('db/fsm.db');
// Tables
// -- Users table
$db->exec("DROP TABLE IF EXISTS users");
$db->exec("CREATE TABLE users(
id INTEGER PRIMARY KEY, 
name TEXT, 
email TEXT, 
phone TEXT, 
uuid TEXT UNIQUE,
pW TEXT, 
email_recap INTEGER,
email_recap_frequency INTEGER, -- 0:Daily, 1:Weekly, 2:Monthly
admin INTEGER DEFAULT 0,
active INTEGER DEFAULT 1)");
// ---- Test Data
// TODO: Create test if parameter create test data
$db->exec("INSERT INTO users(name, email, phone, uuid, pw, email_recap, email_recap_frequency, admin) 
VALUES('Developer A', 'cntac@dfs.com', '00312545542', '123b04f6-0243-4ed8-bdeb-2095c14c578e', 'fafwae', 1, 2, 1)");
$db->exec("INSERT INTO users(name, email, phone, uuid, pw, email_recap, email_recap_frequency, admin) 
VALUES('Developer B', 'cntsac@dfda.fr', '0031526142', '92d2ff16-8642-400a-a905-9d70e656274c', 'favcbngae', 0, 0, 1)");
$db->exec("INSERT INTO users(name, email, phone, uuid, pw, email_recap, email_recap_frequency) 
VALUES('User 1', 'sadfc@dffsa.de', '0031112312', 'f530a7ef-acbe-4a07-8654-24c7efb8c9ca', 'fajnl', 1, 3)");
$db->exec("INSERT INTO users(name, email, phone, uuid, pw, email_recap, email_recap_frequency) 
VALUES('Developer A', 'cntac@dfs.be', '05645441', 'df54aff8-5b98-43e1-a603-7bbd48d5d508', 'kgggte', 1, 1)");

// -- Subscriptions table
$db->exec("DROP TABLE IF EXISTS subscriptions");
$db->exec("CREATE TABLE subscriptions(
id INTEGER PRIMARY KEY, 
name TEXT, 
payment_frequency INTEGER DEFAULT 0, -- 0:Undefined, 1:Daily, 2:Weekly, 3:Monthly, 4:Yearly
auto_create INTEGER DEFAULT 0,
auto_create_day INTEGER DEFAULT 0, -- Day on which monthly payments are created
auto_create_month INTEGER DEFAULT 0, -- Month on which yearly payments are created (+ day)
active INTEGER DEFAULT 1)");
// ---- Test Data
// TODO: Create test if parameter create test data
$db->exec("INSERT INTO subscriptions(name, payment_frequency, auto_create, auto_create_day) 
VALUES('Netflix', 3, 1, 1)");
$db->exec("INSERT INTO subscriptions(name, payment_frequency, auto_create, auto_create_day) 
VALUES('Spotify', 3, 1, 1)");
$db->exec("INSERT INTO subscriptions(name, payment_frequency, auto_create, auto_create_day, auto_create_month) 
VALUES('Disney Plus', 4, 1, 15, 9)");

// -- Payments table


// Make check if data is available ? DO NOTHING unless you have a certain php parameter : Initialize DB 

// Send email welcoming to project

?>