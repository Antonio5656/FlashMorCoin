// contracts/FMCMultiSigWallet.sol
contract FMCMultiSigWallet {
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public required;
    
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
    }
    
    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;
    
    constructor(address[] memory _owners, uint _required) {
        require(_owners.length > 0);
        require(_required > 0 && _required <= _owners.length);
        
        for (uint i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
            owners.push(_owners[i]);
        }
        required = _required;
    }
    
    function submitTransaction(address to, uint value, bytes memory data) 
        public returns (uint transactionId) {
        require(isOwner[msg.sender]);
        transactionId = transactions.length;
        transactions.push(Transaction({
            to: to,
            value: value,
            data: data,
            executed: false
        }));
    }
}