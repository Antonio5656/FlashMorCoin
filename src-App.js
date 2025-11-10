// src/App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ABI y direcciones (reemplaza con las tuyas después del despliegue)
const FMC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];
const EXCHANGE_ABI = [
  "function createTrade(uint256 amount, uint256 price, address paymentToken)",
  "function executeTrade(uint256 tradeId)",
  "function getActiveTrades() view returns (tuple(uint256,address,address,uint256,uint256,address,bool,bool,uint256)[])",
  "function fmcToken() view returns (address)"
];

// Direcciones en Mumbai (¡REEMPLAZA CON LAS TUYAS!)
const FMC_ADDRESS = "0x..."; // Tu token FMC
const EXCHANGE_ADDRESS = "0x..."; // Tu contrato FMCP2PExchange
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC en Polygon

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [trades, setTrades] = useState([]);
  const [fmcBalance, setFmcBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("0");

  const [amountFMC, setAmountFMC] = useState("100");
  const [pricePerFMC, setPricePerFMC] = useState("1000000"); // 1 USDC = 1_000_000 (6 decimales)

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      p.getSigner().then(setSigner);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      const s = await p.getSigner();
      setSigner(s);
      loadBalances(s);
    }
  };

  const loadBalances = async (s) => {
    if (!s) return;
    const fmc = new ethers.Contract(FMC_ADDRESS, FMC_ABI, s);
    const usdc = new ethers.Contract(USDC_ADDRESS, ["function balanceOf(address) view returns (uint256)"], s);
    const addr = await s.getAddress();
    setFmcBalance(await fmc.balanceOf(addr));
    setUsdcBalance(await usdc.balanceOf(addr));
  };

  const createTrade = async () => {
    if (!signer) return;
    const fmc = new ethers.Contract(FMC_ADDRESS, FMC_ABI, signer);
    const exchange = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI, signer);

    // 1. Aprobar FMC al exchange
    const amount = ethers.parseEther(amountFMC);
    const approveTx = await fmc.approve(EXCHANGE_ADDRESS, amount);
    await approveTx.wait();
    console.log("FMC aprobado");

    // 2. Crear trade
    const tx = await exchange.createTrade(
      amount,
      pricePerFMC, // ya en unidades de USDC (ej. 1.5 USDC = 1_500_000)
      USDC_ADDRESS
    );
    await tx.wait();
    alert("Trade creado!");
    loadBalances(signer);
  };

  const executeTrade = async (tradeId) => {
    if (!signer) return;
    const usdc = new ethers.Contract(USDC_ADDRESS, ["function approve(address,uint256)"], signer);
    const exchange = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI, signer);

    // Calcular total: (amount * price) / 1e18
    const trade = trades.find(t => t.id.toString() === tradeId.toString());
    const total = (trade.amount * BigInt(pricePerFMC)) / 10n**18n;

    // Aprobar USDC al exchange
    const approveTx = await usdc.approve(EXCHANGE_ADDRESS, total);
    await approveTx.wait();

    // Ejecutar trade
    const tx = await exchange.executeTrade(tradeId);
    await tx.wait();
    alert("Trade completado!");
    loadBalances(signer);
  };

  const loadTrades = async () => {
    if (!provider) return;
    const exchange = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI, provider);
    const activeTrades = await exchange.getActiveTrades();
    setTrades(activeTrades);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🔷 FMC P2P Exchange</h1>
      
      {!signer ? (
        <button onClick={connectWallet}>Conectar Wallet</button>
      ) : (
        <div>
          <p>Balance FMC: {ethers.formatEther(fmcBalance)}</p>
          <p>Balance USDC: {(Number(usdcBalance) / 1e6).toFixed(2)}</p>

          <h2>Crear Trade</h2>
          <input
            placeholder="Cantidad FMC"
            value={amountFMC}
            onChange={(e) => setAmountFMC(e.target.value)}
          />
          <input
            placeholder="Precio por FMC en USDC (ej: 1.5 = 1500000)"
            value={pricePerFMC}
            onChange={(e) => setPricePerFMC(e.target.value)}
          />
          <button onClick={createTrade}>Crear Trade</button>

          <h2>Trades Activos</h2>
          <button onClick={loadTrades}>Cargar Trades</button>
          <ul>
            {trades.map(trade => (
              <li key={trade.id.toString()}>
                Vendedor: {trade.seller.substring(0,6)}... 
                | {ethers.formatEther(trade.amount)} FMC 
                | Precio: {(Number(trade.pricePerFmcInPaymentToken) / 1e6).toFixed(4)} USDC
                <button onClick={() => executeTrade(trade.id)}>Comprar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;