// On page load, check if a wallet was previously connected
async function tryAutoConnect() {
    if (localStorage.getItem('fmc-walletConnected') === 'true' && window.ethereum) {
        try {
            // Check if we still have access to the account
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                // Automatically update your UI with the connected account
                console.log("Auto-connected to:", accounts[0]);
                updateUI(accounts[0]);
            }
        } catch (error) {
            console.log("Auto-connect failed, requiring new connection");
        }
    }
}

// After a successful manual connection, save the state
localStorage.setItem('fmc-walletConnected', 'true');