// Ejemplo de transacción
const transaction = {
    to: "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb", // Contrato FMC
    value: "0", // Para tokens usar 0
    data: "0xa9059cbb" + // Transfer function
          "000000000000000000000000" + recipientAddress.slice(2) +
          "000000000000000000000000000000000000000000000000" + amountInHex
};