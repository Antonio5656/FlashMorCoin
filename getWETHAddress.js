getWETHAddress() {
    const network = this.SUPPORTED_NETWORKS[this.currentNetwork];
    return network ? network.wNative : null;
}