// Prevención de reentrancy
using ReentrancyGuard for *;

// Safe math
using SafeMath for uint256;

// Validación de inputs
require(amount > 0, "Amount must be greater than 0");
require(whitelistedTokens[token], "Token not whitelisted");