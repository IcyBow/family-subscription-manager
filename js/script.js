document.addEventListener(
    "DOMContentLoaded",
    function () {
      // Helper functions
      function redirectErrorPage() {
        console.log("Redirect to Error page"); //TODO
      }
  
      // Formater functions
      const formatFunctions = {
        epochToDate: function (epochDate) {
          var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
          date.setUTCSeconds(epochDate);
          return date.toLocaleDateString();
        },
        currency: function (amount) {
          const formatter = new Intl.NumberFormat(env.currencyLocale, {
            style: 'currency',
            currency: env.currency,
            minimumFractionDigits: env.currencyMinDecimal,
            maximumFractionDigits: env.currencyMaxDecimal
          });
          return formatter.format(parseFloat(amount));
        },
      };
  
      function filterTable(selectId, tableId, classPrefix) {
        let dropdown, table, rows, cells, country, filter;
        if (tableId === 'payments') {
          var total = 0;
          var owed = 0;
        }
        try {
          dropdown = document.getElementById(selectId);
          table = document.getElementById(tableId);
          rows = table.getElementsByTagName("tr");
          filter = dropdown.value;
        } catch (error) {
          return;
        }
        if (rows.length === 0) {
          return;
        }
        for (let row of rows) {
          if (row.classList.contains("selectable")) {
            if (row.classList.contains(classPrefix + filter)) {
              row.classList.remove("hidden");
              if (tableId === 'payments') {
                const cells = row.getElementsByTagName("td");
                total += parseFloat(cells[1].innerText.replace(',', '.'));
                owed += ((!parseInt(cells[2].getAttribute('data-rawvalue'))) ? parseFloat(cells[1].innerText.replace(',', '.')) : 0);
              }
            } else {
              row.classList.add("hidden");
            }
          }
        }
        if (tableId === 'payments') {
          updateTotalsPayments(total, owed);
        }
      }
  
      function buildHTML(data) {
        const app = document.getElementById("app");
        const isAdmin = data.hasOwnProperty("users");
        if (isAdmin) {
          // Build admin page
          // -- Users
          const usersTitle = document.createElement("h1");
          usersTitle.innerText = "Users";
          app.appendChild(usersTitle);
  
          // -- Subscriptions
          const subscriptionsTitle = document.createElement("h1");
          subscriptionsTitle.innerText = "Subscriptions";
          app.appendChild(subscriptionsTitle);
          app.appendChild(loadSubscription(data.subscriptions, true));
  
          // -- Payments
          const paymentsTitle = document.createElement("h1");
          paymentsTitle.innerText = "Payments";
          app.appendChild(paymentsTitle);
          buildAdminPaymentsTable();
  
          document.title = 'Admin test'; //TODO: correct for good title
        } else {
          // Build viewer page
          // -- Subscriptions
          const subscriptionsTitle = document.createElement("h1");
          subscriptionsTitle.innerText = "Subscriptions";
          app.appendChild(subscriptionsTitle);
          app.appendChild(loadSubscription(data.payments, false));
  
          // -- Totals
          const totalsTitle = document.createElement('h3');
          const totalsTotalWrapper = document.createElement('p');
          const totalsOwedWrapper = document.createElement('p');
          totalsTitle.innerText = 'Totals';
          totalsTotalWrapper.innerHTML = "The total amount that this subscription has cost you is: <span id='SubscriptionTotal'>0</span>";
          totalsOwedWrapper.innerHTML = "You owe for this subscription: <span id='totalOwed'>0</span>";
          app.appendChild(totalsTitle);
          app.appendChild(totalsOwedWrapper);
          app.appendChild(totalsTotalWrapper);
  
          // -- Payments
          const paymentsTitle = document.createElement("h1");
          paymentsTitle.innerText = "Payments";
          app.appendChild(paymentsTitle);
          app.appendChild(buildViewerPaymentsTable(data.payments));
          filterTable("selectSubscription", "payments", "subscription");
  
          document.title = 'User test'; //TODO: correct for good title
        }
  
        // Add event listeners
        const openModalButtons = document.querySelectorAll('.openModal');
        openModalButtons.forEach(button => {
          button.addEventListener('click', openModal);
        });
        const closeModalButtons = document.querySelectorAll('.closeModal');
        closeModalButtons.forEach(button => {
          button.addEventListener('click', closeModal);
        });
        document.getElementById('saveSubscription').addEventListener('click', function () {
          let inputPrefix = '';
          let fieldName = [];
          let payload = {};
          inputPrefix = 'inputSubscription';
          fieldName = ['Name', 'ActualPayers', 'ActualPrice', 'AutoCreate', 'PaymentFrequency', 'AutoCreateDay', 'AutoCreateMonth', 'Active', 'Id'];
          fieldDbName = ['name', 'actual_payers', 'actual_price', 'auto_create', 'payment_frequency', 'auto_create_day', 'auto_create_month', 'active', 'id'];
          for (let i = 0; i < fieldName.length; i++) {
            const input = document.getElementById(inputPrefix + fieldName[i]);
            let value;
            if (input.getAttribute('type') === 'checkbox') {
              value = ((input.checked) ? '1' : '0');
            } else {
              value = input.value;
            }
            payload[fieldDbName[i]] = value;
          }
          debugger;
        });
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
            headCell.innerText = "User";
          } else if (i === 2) {
            headCell.innerText = "UUID";
          } else if (i === 3) {
            headCell.innerText = "Admin";
          } else if (i === 4) {
            headCell.innerText = "Actions";
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
        comboBox.onchange = function () { filterTable("selectSubscription", "payments", "subscription") };
        comboBox.id = "selectSubscription";
        subscriptions.forEach(function (subscription) {
          const option = document.createElement("option");
          option.innerText = subscription;
          option.value = subscription;
          comboBox.appendChild(option);
        });
        wrapper.appendChild(comboBox);
        if (admin) {
          const editButton = document.createElement('button');
          const createButton = document.createElement('button');
  
          editButton.innerText = "Edit subscription";
          editButton.classList.add("openModal");
          editButton.setAttribute('data-modalName', 'Subscription');
          editButton.setAttribute('data-modalAction', 'edit');
          createButton.innerText = "Create subscription"
          createButton.classList.add("openModal");
          createButton.setAttribute('data-modalName', 'Subscription');
          createButton.setAttribute('data-modalAction', 'create');
  
          wrapper.appendChild(editButton);
          wrapper.appendChild(document.createElement('br'));
          wrapper.appendChild(createButton);
        }
        return wrapper;
      }
  
      function buildAdminPaymentsTable() { }
  
      function buildViewerPaymentsTable(data) {
        //let total = 0;
        //let owed = 0;
        const columnTitles = ['Date', 'Amount', 'Payed'];
        const columnProperties = ['date', 'price', 'payed'];
        // Checks
        if (
          data.length === 0
        ) {
          throw new Error(
            "Please check the table data. No data found!"
          );
        }
  
        const table = document.createElement("table");
        table.id = "payments";
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
          row.classList.add("selectable");
          row.classList.add("subscription" + data[i].name);
          for (let j = 0; j < columnProperties.length; j++) {
            const cell = document.createElement("td");
            if (columnProperties[j] === "date") {
              cell.innerText = formatFunctions.epochToDate(data[i][columnProperties[j]]);
            } else if (columnProperties[j] === "price") {
              cell.innerText = formatFunctions.currency(data[i][columnProperties[j]]);
            } else if (columnProperties[j] === "payed") {
              cell.setAttribute('data-rawValue', parseInt(data[i][columnProperties[j]]));
              cell.innerText = ((parseInt(data[i][columnProperties[j]])) ? '✔️' : '❌');
            }
            else {
              cell.innerText = data[i][columnProperties[j]];
            }
  
            row.appendChild(cell);
          }
          tableBody.appendChild(row);
        }
  
        table.appendChild(tableHeader);
        table.appendChild(tableBody);
  
        return table;
      }
  
      function updateTotalsPayments(subscriptionTotal, totalOwed) {
        const total = document.getElementById('SubscriptionTotal');
        const owed = document.getElementById('totalOwed');
        total.innerText = formatFunctions.currency(subscriptionTotal);
        owed.innerText = formatFunctions.currency(totalOwed);
        if (totalOwed === 0) {
          owed.classList.add("good");
        } else {
          owed.classList.remove("good");
        }
      }
  
      function openModal() {
        const modalName = this.getAttribute("data-modalName");
        const modalAction = this.getAttribute("data-modalAction");
        if (modalName === 'Subscription') {
          const modal = document.getElementById('subscriptionModal');
          const saveButton = document.getElementById('saveSubscription');
          if (modalAction === 'edit') {
            fillModalFields(modalName);
            saveButton.innerText = 'Update';
          } else {
            resetModalFields(modalName);
            saveButton.innerText = 'Create';
          }
          modal.style.display = "block";
        }
      }
  
      function closeModal(modalId) {
        const modal = this.parentElement.parentElement;
        modal.style.display = "none";
      }
  
      function fillModalFields(modalName) {
        let inputPrefix = '';
        let fieldName = [];
        let fieldDbName = [];
        let filter = '';
        let data = {};
        if (modalName === 'Subscription') {
          filter = document.getElementById('selectSubscription').value;
          data = result.subscriptions.filter(subscription => subscription.name == filter)[0];
          inputPrefix = 'inputSubscription';
          fieldName = ['Name', 'ActualPayers', 'ActualPrice', 'AutoCreate', 'PaymentFrequency', 'AutoCreateDay', 'AutoCreateMonth', 'Active', 'Id'];
          fieldDbName = ['name', 'actual_payers', 'actual_price', 'auto_create', 'payment_frequency', 'auto_create_day', 'auto_create_month', 'active', 'id'];
          for (let i = 0; i < fieldDbName.length; i++) {
            const input = document.getElementById(inputPrefix + fieldName[i]);
            if (input.getAttribute('type') === 'checkbox') {
              input.checked = ((parseInt(data[fieldDbName[i]])) ? true : false);
            } else if (input.nodeName === 'SELECT') {
              input.value = data[fieldDbName[i]];
            } else {
              input.value = data[fieldDbName[i]];
            }
          }
        }
      }
  
      function resetModalFields(modalName) {
        let inputPrefix = '';
        let fieldName = [];
        if (modalName === 'Subscription') {
          inputPrefix = 'inputSubscription';
          fieldName = ['Name', 'ActualPayers', 'ActualPrice', 'AutoCreate', 'PaymentFrequency', 'AutoCreateDay', 'AutoCreateMonth', 'Active', 'Id'];
          for (let i = 0; i < fieldName.length; i++) {
            const input = document.getElementById(inputPrefix + fieldName[i]);
            if (input.getAttribute('type') === 'checkbox') {
              input.checked = false;
            } else {
              input.value = '';
            }
          }
        }
      }
  
      function callUpdateData(payload) {
        // TODO: pass user id, pass payload
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const userId = urlParams.get("userId");
        const Http = new XMLHttpRequest();
        const url = "php/dataManager.php?action=update_Data";
        Http.open("POST", url);
        Http.send();
        Http.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            try {
              result = JSON.parse(Http.responseText).data;
            } catch (error) {
              throw new Error(
                "There is a problem with the database. Please check that you have initialised it correctly."
              );
            }
            console.log(result); //TODO: remove me
            buildHTML(result);
            if (result.status === "KO") {
              throw new Error(
                "There is a problem with the request. Please try again and if it persists check the doc/github."
              );
            }
          }
        };
      }
  
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const userId = urlParams.get("userId");
      var result;
      if (userId) {
        const Http = new XMLHttpRequest();
        const url = "php/dataManager.php?action=get_Data&userId=" + userId;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            try {
              result = JSON.parse(Http.responseText).data;
            } catch (error) {
              throw new Error(
                "There is a problem with the database. Please check that you have initialised it correctly."
              );
            }
            console.log(result); //TODO: remove me
            buildHTML(result);
            if (result.status === "KO") {
              throw new Error(
                "There is a problem with the request. Please try again and if it persists check the doc/github."
              );
            }
          }
        };
      } else {
        redirectErrorPage();
      }
    },
    false
  );
  