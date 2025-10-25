import { createConfig, http } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

// Configuración de WalletConnect
const projectId = 'tu-project-id-de-walletconnect'; // Obtén uno en https://cloud.walletconnect.com/

export const config = createConfig({
  chains: [polygon, polygonMumbai],
  connectors: [
    metaMask(),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
})