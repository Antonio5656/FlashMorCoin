// Function to connect the wallet
async function connectWallet() {
    try {
        // This will open the wallet UI for the user to confirm the connection
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        const userAddress = accounts[0];
        console.log("Connected:", userAddress);
        // Update your UI to show the connected state and address
        return userAddress;
    } catch (error) {
        console.error("User denied connection or error:", error);
    }
}