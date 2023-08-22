<?php
//---- Return status
$result = [];
$result['status'] = 'OK';
//---- input: Action
if (isset($_GET['action'])) {
    $action = $_GET['action'];
} else {
    $action = '';
}

function queryToJSON($result) {
    $data = array();
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($data, $row);
    }
    return $data;
}

//-- Queries
if ($action !== '') {
    $query = '';
    switch ($action) {
        case "get_Data":
            $db = new SQLite3('test.db');
            $users = $db->query('SELECT * FROM users');
            //error_log(var_dump($users));
            $result['data']['users'] = queryToJSON($users);
            $subscriptions = $db->query('SELECT * FROM subscriptions');
            $result['data']['subscriptions'] = queryToJSON($subscriptions);
            $subscriptionPayments = $db->query('SELECT * FROM subscriptionPayments');
            $result['data']['subscriptionPayments'] = queryToJSON($subscriptionPayments);
    }
} else {
    $result['status'] = "KO";
    $result['error_message'] = "No action given";
}
echo json_encode($result, JSON_PRETTY_PRINT);

?>