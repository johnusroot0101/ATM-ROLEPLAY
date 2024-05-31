let accountsDb = {};

document.getElementById('user-login').addEventListener('click', function() {
    let userId = prompt("Enter your account ID:");
    let password = prompt("Enter your password:");
    if (userId in accountsDb && accountsDb[userId].password === password) {
        document.querySelector('.container').classList.add('hidden');
        document.getElementById('user-panel').classList.remove('hidden');
        sessionStorage.setItem('currentUserId', userId);
    } else {
        alert("Invalid credentials!");
    }
});

document.getElementById('admin-login').addEventListener('click', function() {
    let adminUsername = prompt("Enter admin username:");
    let adminPassword = prompt("Enter admin password:");
    if (adminUsername === "admin" && adminPassword === "adminpass") {
        document.querySelector('.container').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
    } else {
        alert("Invalid admin credentials!");
    }
});

document.getElementById('signup').addEventListener('click', function() {
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('signup-panel').classList.remove('hidden');
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let userId = document.getElementById('new-user-id').value;
    let password = document.getElementById('new-password').value;
    if (userId && password) {
        accountsDb[userId] = { password: password, balance: 0, transactionHistory: [] };
        alert(`Account created successfully for user ID: ${userId}`);
        document.querySelector('.container').classList.remove('hidden');
        document.getElementById('signup-panel').classList.add('hidden');
    } else {
        alert("Please fill in all fields.");
    }
});

document.getElementById('exit').addEventListener('click', function() {
    alert("Exiting ATM System. Goodbye!");
});

function exitUserPanel() {
    document.querySelector('.container').classList.remove('hidden');
    document.getElementById('user-panel').classList.add('hidden');
    sessionStorage.removeItem('currentUserId');
}

function exitAdminPanel() {
    document.querySelector('.container').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

function exitSignupPanel() {
    document.querySelector('.container').classList.remove('hidden');
    document.getElementById('signup-panel').classList.add('hidden');
}

function viewBalance() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId && accountsDb[userId]) {
        alert(`Your current balance: $${accountsDb[userId].balance}`);
    } else {
        alert("Unable to retrieve balance.");
    }
}

function sendMoney() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId && accountsDb[userId]) {
        let receiverId = prompt("Enter receiver's account ID:");
        let amount = parseFloat(prompt("Enter amount to send:"));
        if (receiverId && amount && accountsDb[receiverId] && accountsDb[userId].balance >= amount) {
            accountsDb[userId].balance -= amount;
            accountsDb[receiverId].balance += amount;
            let transaction = `Sent $${amount} to ${receiverId}`;
            accountsDb[userId].transactionHistory.push(transaction);
            accountsDb[receiverId].transactionHistory.push(`Received $${amount} from ${userId}`);
            alert(`$${amount} sent to ${receiverId}. Your new balance: $${accountsDb[userId].balance}`);
        } else {
            alert("Invalid input or insufficient funds.");
        }
    } else {
        alert("Unable to send money.");
    }
}

function changePassword() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId && accountsDb[userId]) {
        let newPassword = prompt("Enter new password:");
        if (newPassword) {
            accountsDb[userId].password = newPassword;
            alert("Password changed successfully.");
        } else {
            alert("Invalid input.");
        }
    } else {
        alert("Unable to change password.");
    }
}

function viewTransactionHistory() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId && accountsDb[userId]) {
        let history = accountsDb[userId].transactionHistory.join('\n');
        alert(`Transaction History:\n${history}`);
    } else {
        alert("Unable to retrieve transaction history.");
    }
}

function generateAccountId() {
    let newId = Math.random().toString(36).substring(2, 10).toUpperCase();
    let newPassword = Math.random().toString(36).substring(2, 10);
    accountsDb[newId] = { password: newPassword, balance: 0, transactionHistory: [] };
    alert(`Account ID ${newId} created successfully. Password: ${newPassword}`);
}

function addMoney() {
    let accountId = prompt("Enter account ID:");
    let amount = parseFloat(prompt("Enter amount to add:"));
    if (accountId && amount && !isNaN(amount) && accountsDb[accountId]) {
        accountsDb[accountId].balance += amount;
        accountsDb[accountId].transactionHistory.push(`Added $${amount}`);
        alert(`$${amount} added to account ${accountId}.`);
    } else {
        alert("Invalid input.");
    }
}

function deductMoney() {
    let accountId = prompt("Enter account ID:");
    let amount = parseFloat(prompt("Enter amount to deduct:"));
    if (accountId && amount && !isNaN(amount) && accountsDb[accountId] && accountsDb[accountId].balance >= amount) {
        accountsDb[accountId].balance -= amount;
        accountsDb[accountId].transactionHistory.push(`Deducted $${amount}`);
        alert(`$${amount} deducted from account ${accountId}.`);
    } else {
        alert("Invalid input or insufficient funds.");
    }
}

function viewAllActiveIds() {
    let ids = Object.keys(accountsDb).join('\n');
    alert(`Active Account IDs:\n${ids}`);
}

function viewAdminTransactionHistory() {
    let allTransactions = [];
    for (let accountId in accountsDb) {
        let transactions = accountsDb[accountId].transactionHistory.map(t => `${accountId}: ${t}`);
        allTransactions = allTransactions.concat(transactions);
    }
    alert(`All Transactions:\n${allTransactions.join('\n')}`);
}
