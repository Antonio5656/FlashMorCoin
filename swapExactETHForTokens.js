async executeSwap(amount, fromToken, toToken) {
    if (!this.userAddress) {
        this.log('❌ Conecta tu wallet primero');
        return;
    }

    const network = this.SUPPORTED_NETWORKS[this.currentNetwork];
    if (!network) {
        this.log('❌ Red no soportada');
        return;
    }

    const dexConfig = this.DEX_CONFIG[this.currentNetwork];
    if (!dexConfig) {
        this.log('❌ No hay DEX configurado para esta red');
        return;
    }

    // Determinar la dirección del token BUSD
    const busdAddress = dexConfig.busd;

    // Crear instancia del router
    const router = new this.web3.eth.Contract(this.ROUTER_ABI, dexConfig.router);

    // Dirección de destino (la misma wallet)
    const toAddress = this.userAddress;

    // Deadline (20 minutos desde ahora)
    const deadline = Math.floor(Date.now() / 1000) + 1200;

    if (fromToken === 'native' && toToken === 'busd') {
        // Swap de native a BUSD
        const path = [this.getWETHAddress(), busdAddress];
        const amountIn = this.web3.utils.toWei(amount.toString(), 'ether');
        
        // Estimar el amountOutMin (podemos usar getAmountsOut)
        const amounts = await router.methods.getAmountsOut(amountIn, path).call();
        const amountOutMin = amounts[1]; // La salida es la segunda posición

        // Realizar el swap
        this.log(`🔄 Swapeando ${amount} ${network.symbol} por BUSD...`);
        try {
            const result = await router.methods.swapExactETHForTokens(
                amountOutMin,
                path,
                toAddress,
                deadline
            ).send({
                from: this.userAddress,
                value: amountIn,
                gas: 300000
            });
            this.log(`✅ Swap exitoso: TX ${result.transactionHash}`);
        } catch (error) {
            this.log(`❌ Error en el swap: ${error.message}`);
        }
    } else if (fromToken === 'busd' && toToken === 'native') {
        // Swap de BUSD a native
        const path = [busdAddress, this.getWETHAddress()];
        const amountIn = this.web3.utils.toWei(amount.toString(), 'ether'); // Asumiendo que BUSD tiene 18 decimales

        // Primero, aprobar el gasto de BUSD
        const busdContract = new this.web3.eth.Contract(this.TOKEN_ABI, busdAddress);
        try {
            this.log(`🔏 Aprobando gasto de BUSD...`);
            await busdContract.methods.approve(dexConfig.router, amountIn).send({
                from: this.userAddress,
                gas: 100000
            });
            this.log(`✅ Aprobación exitosa`);

            // Estimar el amountOutMin
            const amounts = await router.methods.getAmountsOut(amountIn, path).call();
            const amountOutMin = amounts[1];

            // Realizar el swap
            this.log(`🔄 Swapeando ${amount} BUSD por ${network.symbol}...`);
            const result = await router.methods.swapExactTokensForETH(
                amountIn,
                amountOutMin,
                path,
                toAddress,
                deadline
            ).send({
                from: this.userAddress,
                gas: 300000
            });
            this.log(`✅ Swap exitoso: TX ${result.transactionHash}`);
        } catch (error) {
            this.log(`❌ Error en el swap: ${error.message}`);
        }
    } else {
        this.log('❌ Par de tokens no soportado');
    }
}