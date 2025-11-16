function executeSwap() {
    const amount = parseFloat(document.getElementById('swap-amount').value);
    const fromToken = document.getElementById('swap-from').value;
    const toToken = document.getElementById('swap-to').value;

    if (!amount) {
        advancedSystem.log('❌ Ingresa una cantidad');
        return;
    }

    advancedSystem.executeSwap(amount, fromToken, toToken);
}