const PaymentABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_wallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "BindLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "account",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct TradeData",
          "name": "_userA",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "account",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct TradeData",
          "name": "_userB",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "CancelLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_old",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_new",
          "type": "address"
        }
      ],
      "name": "ConfigChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "_to",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_frozen",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "DepositLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "FreezeLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_old",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_new",
          "type": "address"
        }
      ],
      "name": "OwnerChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_to",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "SimpleDepositLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "_from",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "SimpleWithdrawLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "from",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "to",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "available",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "frozen",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "excessFee",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct TransferData",
          "name": "_deal",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_out",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "TransferLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_wallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "UnbindLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "UnfreezeLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "_from",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_available",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_frozen",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "WithdrawLog",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "autoBindEnabled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "bindAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "account",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            }
          ],
          "internalType": "struct TradeData",
          "name": "_userA",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "account",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            }
          ],
          "internalType": "struct TradeData",
          "name": "_userB",
          "type": "tuple"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "cancel",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "config",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_to",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_frozen",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "deposit",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dev",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "enabled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeTo",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeToAccount",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_wallet",
          "type": "address"
        }
      ],
      "name": "foundAccount",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "freeze",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "_accounts",
          "type": "bytes32[]"
        },
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        }
      ],
      "name": "getMultiUserAssets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "account",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "available",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "frozen",
              "type": "uint256"
            }
          ],
          "internalType": "struct DetailedAccount[]",
          "name": "result",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "_sns",
          "type": "bytes32[]"
        }
      ],
      "name": "getRecords",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "result",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        }
      ],
      "name": "getUserAssets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "available",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "frozen",
              "type": "uint256"
            }
          ],
          "internalType": "struct AssetAccount[]",
          "name": "result",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        }
      ],
      "name": "getWalletsOfAccount",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxWalletCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nosnEnabled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "records",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_wallet",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "replaceAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        }
      ],
      "name": "setAutoBindEnabled",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        }
      ],
      "name": "setEnabled",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeTo",
          "type": "address"
        }
      ],
      "name": "setFeeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "setMaxWalletCount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        }
      ],
      "name": "setNoSnEnabled",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_signer",
          "type": "address"
        }
      ],
      "name": "setSigner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_signer",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "setSignerContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_config",
          "type": "address"
        }
      ],
      "name": "setupConfig",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "signer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_to",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "simpleDeposit",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "simpleWithdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_out",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "from",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "to",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "available",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "frozen",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "excessFee",
              "type": "uint256"
            }
          ],
          "internalType": "struct TransferData",
          "name": "_deal",
          "type": "tuple"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unbindAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_account",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_fee",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "unfreeze",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userAccounts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "available",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "frozen",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_messageHash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "verifyMessage",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "walletToAccount",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "walletsOfAccount",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_available",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_frozen",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "_sn",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_expired",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

export { PaymentABI };
