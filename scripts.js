async function fetchAccounts() {
    const response = await fetch('/accounts');
    return response.json();
}

async function fetchAccount(userId) {
    const response = await fetch(`/account/${userId}`);
    if (response.ok) {
        return response.json();
    }
    throw new Error('Account not found');
}

async function createAccount(userId, password) {
    const response = await fetch('/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password })
    });
    return response.json();
}

async function updateAccount(userId, data) {
    const response = await fetch(`/account/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

document.getElementById('user-login').addEventListener('click', async function() {
    let userId = prompt("Enter your account ID:");
    let password = prompt("Enter your password:");
    try {
        const account = await fetchAccount(userId);
        if (account.password === password) {
            document.querySelector('.container').classList.add('hidden');
            document.getElementById('user-panel').classList.remove('hidden');
            sessionStorage.setItem('currentUserId', userId);
        } else {
            alert("Invalid credentials!");
        }
    } catch (error) {
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

document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    let userId = document.getElementById('new-user-id').value;
    let password = document.getElementById('new-password').value;
    if (userId && password) {
        await createAccount(userId, password);
        alert(`Account created successfully for user ID: ${userId}`);
        document.querySelector('.container').classList.remove('hidden');
        document.getElementById('signup-panel').classList.add('hidden');
    } else {
        alert("Please fill in all fields.");
    }
});

document.getElementById('exit').addEventListener('click', function() {
    alert("Exiting ATM System. Goodbye!");
    sessionStorage.removeItem('currentUserId');
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

async function viewBalance() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId) {
        try {
            const account = await fetchAccount(userId);
            alert(`Your current balance: $${account.balance}`);
        } catch (error) {
            alert("Unable to retrieve balance.");
        }
    }
}

async function sendMoney() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId) {
        let receiverId = prompt("Enter receiver's account ID:");
        let amount = parseFloat(prompt("Enter amount to send:"));
        try {
            const account = await fetchAccount(userId);
            const receiver = await fetchAccount(receiverId);
            if (amount > 0 && account.balance >= amount) {
                account.balance -= amount;
                receiver.balance += amount;
                account.transactionHistory.push(`Sent $${amount} to ${receiverId}`);
                receiver.transactionHistory.push(`Received $${amount} from ${userId}`);
                await updateAccount(userId, account);
                await updateAccount(receiverId, receiver);
                alert(`$${amount} sent to ${receiverId}. Your new balance: $${account.balance}`);
            } else {
                alert("Invalid input or insufficient funds.");
            }
        } catch (error) {
            alert("Unable to send money.");
        }
    }
}

async function changePassword() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId) {
        let newPassword = prompt("Enter new password:");
        if (newPassword) {
            try {
                const account = await fetchAccount(userId);
                account.password = newPassword;
                await updateAccount(userId, account);
                alert("Password changed successfully.");
            } catch (error) {
                alert("Unable to change password.");
            }
        } else {
            alert("Invalid input.");
        }
    }
}

async function viewTransactionHistory() {
    let userId = sessionStorage.getItem('currentUserId');
    if (userId) {
        try {
            const account = await fetchAccount(userId);
            let history = account.transactionHistory.join('\n');
            alert(`Transaction History:\n${history}`);
        } catch (error) {
            alert("Unable to retrieve transaction history.");
        }
    }
}

async function generateAccountId() {
    let newId = Math.random().toString(36).substring(2, 10).toUpperCase();
    let newPassword = Math.random().toString(36).substring(2, 10);
    await createAccount(newId, newPassword);
    alert(`Account ID ${newId} created successfully. Password: ${newPassword}`);
}

async function addMoney() {
    let accountId = prompt("Enter account ID:");
    let amount = parseFloat(prompt("Enter amount to add:"));
    if (accountId && amount && !isNaN(amount) && amount > 0) {
        try {
            const account = await fetchAccount(accountId);
            account.balance += amount;
            account.transactionHistory.push(`Added $${amount}`);
            await updateAccount(accountId, account);
            alert(`$${amount} added to account ${accountId}.`);
        } catch (error) {
            alert("Invalid input.");
        }
    } else {
        alert("Invalid input.");
    }
}

async function deductMoney() {
    let accountId = prompt("Enter account ID:");
    let amount = parseFloat(prompt("Enter amount to deduct:"));
    if (accountId && amount && !isNaN(amount) && amount > 0) {
        try {
            const account = await fetchAccount(accountId);
            if (account.balance >= amount) {
                account.balance -= amount;
                account.transactionHistory.push(`Deducted $${amount}`);
                await updateAccount(accountId, account);
                alert(`$${amount} deducted from account ${accountId}.`);
            } else {
                alert("Insufficient funds.");
            }
        } catch (error) {
            alert("Invalid input.");
        }
    } else {
        alert("Invalid input.");
    }
}

async function viewAllActiveIds() {
    try {
        const accounts = await fetchAccounts();
        let ids = Object.keys(accounts).join('\n');
        alert(`Active Account IDs:\n${ids}`);
    } catch (error) {
        alert("Unable to retrieve active account IDs.");
    }
}

async function viewAdminTransactionHistory() {
    try {
        const accounts = await fetchAccounts();
        let allTransactions = [];
        for (let accountId in accounts) {
            let transactions = accounts[accountId].transactionHistory.map(t => `${accountId}: ${t}`);
            allTransactions = allTransactions.concat(transactions);
        }
        alert(`All Transactions:\n${allTransactions.join('\n')}`);
    } catch (error) {
        alert("Unable to retrieve transaction history.");
    }
}
