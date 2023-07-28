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
email_recap INT,
email_recap_frequency INT, -- 0:Daily, 1:Weekly, 2:Monthly
admin INT DEFAULT 0,
active INT DEFAULT 1)");
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

// -- Payments table


// Make check if data is available ? DO NOTHING unless you have a certain php parameter : Initialize DB 

// Send email welcoming to project

?>