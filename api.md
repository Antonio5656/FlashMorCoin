// docs/api.md
## Endpoints del Protocolo FMC

### Depositar Colateral
POST /api/v1/deposit
{
  "lpToken": "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb",
  "amount": "1000000000000000000",
<<<<<<< HEAD
  "user": "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb"
=======
  "user": "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb"
>>>>>>> 10f4d652cec9351e20b8ce1abef6b12d8a6ae76e
}

### Mint FMC
POST /api/v1/mint
{
  "amount": "300000000000000000",
<<<<<<< HEAD
  "user": "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb"
=======
  "user": "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb"
>>>>>>> 10f4d652cec9351e20b8ce1abef6b12d8a6ae76e
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