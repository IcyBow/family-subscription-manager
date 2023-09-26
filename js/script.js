document.addEventListener('DOMContentLoaded', function () {
    // Functions
    function redirectErrorPage() {
        console.log("Redirect to Error page"); //TODO
    }

    function buildHTMLTable(data, columnTitles = new Array(), columnPropertyNames = new Array, idTable, specialColumns = new Array()) {
        // Checks 
        if (data.length === 0 ||columnTitles.length === 0 || columnPropertyNames.length === 0) {
            console.log("Please check the table building function. There are some empty array parameters.");
            return;
        }
        for (let i = 0; i < columnPropertyNames.length; i++) {
            let functionsAmount = 0;
            if (columnPropertyNames[i].substring(0, 23) === "specialFunctionPosition") {
                functionsAmount++;
                if (isNaN(parseInt(columnPropertyNames[i].substring(23, 26))) || specialColumns.length < functionsAmount || !specialColumns[parseInt(columnPropertyNames[i].substring(23, 26))]) {
                    console.log("The special columns that you indicated could not be loaded. Please check your input parameters.")
                    return;
                }
            }
        }
        const table = document.createElement("table");
        table.id = idTable;
        const tableHeader = document.createElement("thead");
        const tableBody = document.createElement("tbody");
        const headRow = document.createElement("tr");
        for (let i = 0; i < columnTitles.length; i++) {
            let text = "";
            const headCell = document.createElement("th");
            headCell.innerText = columnTitles[i];
            headRow.appendChild(headCell);
        }
        tableHeader.appendChild(headRow);

        for (let i = 0; i < data.length; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < columnPropertyNames.length; j++) {
                const cell = document.createElement("td");
                cell.innerText = data[i][columnPropertyNames[j]];
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        }

        table.appendChild(tableHeader);
        table.appendChild(tableBody);
        return table;
    }

    function buildHTML(data) {
        const app = document.getElementById("app");
        const isAdmin = data.hasOwnProperty('users');
        if (isAdmin) {
            // Build admin page
            // -- Users
            const usersTitle = document.createElement("h1");
            usersTitle.innerText = "Users"; 
            app.appendChild(usersTitle);
            app.appendChild(buildHTMLTable(data.users, ["User", "UUID", "Admin", "Actions"], ["name", "uuid", "admin", "specialFunctionPosition3"], "users", ["1", "2"]));
        
            // -- Subscriptions
            const subscriptionsTitle = document.createElement("h1");
            subscriptionsTitle.innerText = "Subscriptions";
            app.appendChild(subscriptionsTitle);
            
            // -- Payments
            const paymentsTitle = document.createElement("h1");
            paymentsTitle.innerText = "Payments"; 
            app.appendChild(paymentsTitle);
            buildAdminPaymentsTable();
        } else {
            // Build viewer page
            // -- Subscriptions
            const subscriptionsTitle = document.createElement("h1");
            subscriptionsTitle.innerText = "Subscriptions";
            app.appendChild(subscriptionsTitle);
            app.appendChild(loadSubscription(data.payments, false));
            
            // -- Payments
            const paymentsTitle = document.createElement("h1");
            paymentsTitle.innerText = "Payments"; 
            app.appendChild(paymentsTitle);
            app.appendChild(buildHTMLTable(
                data.payments.filter((payment) => payment.name === document.getElementById("selectSubscription").options[document.getElementById("selectSubscription").selectedIndex].text), 
                ["Date", "Amount", "Payed"], 
                ["date", "price", "payed"], 
                "payments"));
        }
    }

    function buildUsersTable(users) {
        //https://colorlib.com/etc/tb/Table_Fixed_Header/index.html ver 2
        const table = document.createElement("table");
        const tableHeader = document.createElement("thead");
        const tableBody = document.createElement("tbody");
        const headRow = document.createElement("tr");
        for (let i = 1; i <= 4; i++) {
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

    function loadSubscription(subscriptions = new Array(), admin) {
        function createDistinctArray(arrayWithDuplicates, propertyName) {
            const distinctArray = new Set();
            for (let i = 0; i < arrayWithDuplicates.length; i++) {
                distinctArray.add(arrayWithDuplicates[i][propertyName]);
            }
            return distinctArray;
        }
        subscriptions = createDistinctArray(subscriptions, "name");
        const wrapper = document.createElement("div");
        const comboBox = document.createElement("select");
        comboBox.id = "selectSubscription";
        subscriptions.forEach(function (subscription) {
            //for (let i = 0; i < subscriptions.length; i++) {
                const option = document.createElement("option");
                option.innerText = subscription;
                option.value = subscriptions;
                comboBox.appendChild(option);
        });
        if (admin) {

        }
        wrapper.appendChild(comboBox);
        return wrapper;
    }

    function buildAdminPaymentsTable() {

    }
    
    function buildViewerPaymentsTable() {
        const table = document.createElement("table");

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
                    result = JSON.parse(Http.responseText).data;
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