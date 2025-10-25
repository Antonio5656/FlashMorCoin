import { FMC_ABI, VAULT_ABI, CONTRACT_ADDRESSES } from './lib/web3config';

// Ejemplo: Obtener posición
const position = await contract.positions(userAddress);
console.log('Colateral:', position.collateral);
console.log('Deuda:', position.debt);