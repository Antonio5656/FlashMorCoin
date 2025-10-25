// docs/api.md
## Endpoints del Protocolo FMC

### Depositar Colateral
POST /api/v1/deposit
{
  "lpToken": "0x5774808c2856f7FDF1A0a8F375A41559794BeF6B",
  "amount": "1000000000000000000",
  "user": "0x5774808c2856f7FDF1A0a8F375A41559794BeF6B"
}

### Mint FMC
POST /api/v1/mint
{
  "amount": "300000000000000000",
  "user": "0x5774808c2856f7FDF1A0a8F375A41559794BeF6B"
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