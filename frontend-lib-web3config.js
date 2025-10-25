import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { polygonMumbai } from 'wagmi/chains';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
});

// Direcciones de contratos (actualizar después del deployment)
export const CONTRACT_ADDRESSES = {
  FMC: "0x...", // Actualizar con dirección real
  VAULT: "0x...", // Actualizar con dirección real
  ORACLE: "0x..." // Actualizar con dirección real
};