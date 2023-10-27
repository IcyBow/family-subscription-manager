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
//---- input: Action
if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];
} else {
    $userId = '';
}

function queryToJSON($result) {
    $data = array();
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($data, $row);
    }
    return $data;
}

//-- Queries
if ($action !== '' && $userId !== '') {
    $query = '';
    switch ($action) {
        case "get_Data":
            $db = new SQLite3('../db/fsm.db');
            $query = "SELECT name FROM 'users' WHERE uuid='" . $userId . "'"; // Check if user exists, if so retrieve username
            $userName = $db->querySingle($query);
            if (!is_null($userName)) {
                $result['data']['userName'] = $userName;
                $query = "SELECT admin FROM 'users' WHERE uuid='" . $userId . "'";
                //error_log(var_dump($query)); die();
                $isAdmin = boolval($db->querySingle($query));
                if($isAdmin) {
                    $queries = [
                    'users'=>'SELECT * FROM users',
                    'subscriptions'=>'SELECT * FROM subscriptions',
                    'subscriptionPayments'=>'SELECT * FROM subscriptionPayments',
                    'cosubscribersPayments'=>'SELECT * FROM cosubscribersPayments'
                ];
            } else {
                $query = "SELECT id FROM 'users' WHERE uuid='" . $userId . "'";
                $internalId = $db->querySingle($query);
                    $queries = [
                    "payments"=>
                    "SELECT cosubscribersPayments.id as paymentId, date, payed, subscription, name, (price / payers) as price  
                    FROM cosubscribersPayments 
                    INNER JOIN subscriptionPayments 
                    ON subscriptionPayments.id=cosubscribersPayments.subscriptionPayment 
                    INNER JOIN subscriptions
                    ON subscriptionPayments.subscription=subscriptions.id
                    WHERE payer=$internalId
                    ORDER BY date DESC"];
                }
                foreach($queries as $key => $value) {
                        $queryResult = $db->query($value);
                        $result['data'][$key] = queryToJSON($queryResult);
                }
            } else {
                $result['status'] = "KO";
                $result['error_message'] = "Please login";
            }
    }
} else {
    $result['status'] = "KO";
    $result['error_message'] = "Not a valid request";
}
echo json_encode($result, JSON_PRETTY_PRINT);

?>