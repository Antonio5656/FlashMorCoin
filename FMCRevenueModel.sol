// docs/api.md
## Endpoints del Protocolo FMC

### Depositar Colateral
POST /api/v1/deposit
{
  "lpToken": "0x...",
  "amount": "1000000000000000000",
  "user": "0x..."
}

### Mint FMC
POST /api/v1/mint
{
  "amount": "300000000000000000",
  "user": "0x..."
}

### Obtener Posición
GET /api/v1/positions/:user
Response:
{
  "collateral": "1000000000000000000",
  "debt": "300000000000000000",
  "healthFactor": "1.8",
  "liquidationPrice": "0.85"
}