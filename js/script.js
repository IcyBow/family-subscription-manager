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

    function buildHTML(aggregatedData) {
        const app = document.getElementById("app");
        if (aggregatedData.data.hasOwnProperty('users')) {
            // Build admin page
            const usersTitle = document.createElement("h1");
            usersTitle.innerText = "Users";
            app.appendChild(usersTitle);
            app.appendChild(buildUsersTable(aggregatedData.data.users));
        } else {
            // Build cosubscriber page
        }        
        loadSubscription();
        buildPaymentsTable();
    }

    function buildUsersTable(users) {
        //https://colorlib.com/etc/tb/Table_Fixed_Header/index.html ver 2
        let table = document.createElement("table");
        let tableHeader = document.createElement("thead");
        let tableBody = document.createElement("tbody");
        let headRow = document.createElement("tr");
        for (let i = 1; i <= 3; i++) {
            let text = "";
            const headCell = document.createElement("th");
            if (i === 1) {
               headCell.innerText ='User';
            } else if (i === 2) {
                headCell.innerText = 'UUID';
            } else if (i === 3) {
                headCell.innerText = 'Admin';
            } else if (i === 4) {
                headCell.innerText = 'Actions';
            }
            headRow.appendChild(headCell);
        }
        tableHeader.appendChild(headRow);

        for (let i = 0; i < users.length; i++) {
            const row = document.createElement("tr");
            const userName = document.createElement("td");
            userName.innerText = users[i].name;
            row.appendChild(userName);
            const uuid = document.createElement("td");
            uuid.innerText = users[i].uuid;
            row.appendChild(uuid);
            const admin = document.createElement("td");
            admin.innerText = users[i].admin;
            row.appendChild(admin);
            const actions = document.createElement("td");
            const updateButton = document.createElement("button");
            updateButton.innerText = "Update";
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            actions.appendChild(updateButton);
            actions.appendChild(deleteButton);
            row.appendChild(actions);
            tableBody.appendChild(row);
        }

        table.appendChild(tableHeader);
        table.appendChild(tableBody);
        return table;
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
                console.log(result); //TODO: remove me
                buildHTML(result);
                if (result.status === "KO") {
                    throw new Error("There is a problem with the request. Please try again and if it persists check the doc/github.");
                }
            }
        }
    } else {
        redirectErrorPage();
    }
}, false);