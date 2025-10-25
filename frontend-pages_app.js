import { WagmiConfig } from 'wagmi';
import { config } from '../lib/web3config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </WagmiConfig>
  );
}