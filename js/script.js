document.addEventListener('DOMContentLoaded', function () {
    // Functions
    function redirectErrorPage() {
        console.log("Redirect to Error page"); //TODO
    }

    function aggregateData(data) {
        let agrData = {
            users: [],
            subscriptions: []
        };

        return agrData;
    }

    function loadInitialHTML(aggregatedData) {
        buildUsersTable();
        loadSubscription();
        buildPaymentsTable();
    }

    function buildUsersTable() {
        //https://colorlib.com/etc/tb/Table_Fixed_Header/index.html ver 2
    }

    function loadSubscription() {

    }

    function buildPaymentsTable() {

    }
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('userId');
    if (userId) {
        const Http = new XMLHttpRequest();
        const url = 'php/dataManager.php?action=get_Data&userId=' + userId;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let result;
                try {
                    result = JSON.parse(Http.responseText);
                } catch (error) {
                    throw new Error("There is a problem with the database. Please check that you have initialised it correctly.");
                }
                console.log(result);
                if (result.status === "KO") {
                    throw new Error("There is a problem with the request. Please try again and if it persists check the doc/github.");
                }
            }
        }
    } else {
        redirectErrorPage();
    }
}, false);