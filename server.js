const express = require('express');
const bodyparser = require('body-parser');

const Web3 = require("web3")

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/1e7bcd0dc8f34d31b02629f5e507d53c"));

let app = express();
const port = 3001;

app.use(bodyparser.json());

//Api to get transaction information by transaction hash
app.get('/eth/api/v1/transaction/:txId', (req, res) => {
    let txId = req.params.txId;
    web3.eth.getTransaction(txId, function (err, result) {
        if (!err) {
            res.send({
                "block": {
                    "blockHeight": result.blockNumber
                },
                "outs": [
                    {
                        "address": result.to,
                        "value": web3.utils.fromWei(result.value, 'wei')
                    }
                ],
                "ins": [
                    {
                        "address": result.from,
                        "value": `-${web3.utils.fromWei(result.value, 'wei')}`
                    }
                ],
                "hash": result.hash,
                "currency": "ETH",
                "chain": "ETH.main",
                "state": "confirmed",
                "depositType": "account"


            });

        } else {
            res.send({
                "data": err.data,
                "error": err.message
            })
        }
    });

})


//API to get erc20 transaction details

app.get('/eth/api/v1/ERCTransaction/:ercTx', (req, res) => {
    let ercTx = req.params.ercTx;
    web3.eth.getTransaction(ercTx, function (err, result) {
        if (!err) {
            let input = result.input;
            let str = input.toString(16);
            let toAddress = str.slice(34, 74);
            let value = str.slice(75, 138);

            res.send({
                "block": {
                    "blockHeight": result.blockNumber
                },
                "outs": [
                    {
                        "address": '0x' + toAddress,
                        "value": web3.utils.fromWei(value, 'wei'),
                        "type": "token",
                        "coinspecific": {
                            "tokenAddress": result.to
                        }
                    }
                ],
                "ins": [
                    {
                        "address": result.from,
                        "value": `-${(web3.utils.fromWei(value, 'wei'))}`,
                        "type": "token",
                        "coinspecific": {
                            "tokenAddress": result.to
                        }
                    }
                ],
                "hash": result.hash,
                "currency": "ETH",
                "state": "confirmed",
                "depositType": "Contract",
                "chain": "ETH.main",
            });

        } else {
            res.send({
                "data": err.data,
                "error": err.message
            })
        }
    });

})


//API to get contract transaction details

app.get('/eth/api/v1/contractTransaction/:contractId', (req, res) => {
    let contractId = req.params.contractId;
    web3.eth.getTransaction(contractId, function (err, result) {
        if (!err) {
            let input = result.input;
            let str = input.toString(16);
            let toAddress = str.slice(34, 74);
            let value = str.slice(75, 138);
            res.send({
                "block": {
                    "blockHeight": result.blockNumber
                },
                "outs": [
                    {
                        "address": '0x' + toAddress,
                        "value": (web3.utils.fromWei(value, 'wei')),
                        "type": "token",
                        "coinspecific": {
                            "tracehash": result.hash
                        }
                    }
                ],
                "ins": [
                    {
                        "address": result.to,
                        "value": `-${(web3.utils.fromWei(value, 'wei'))}`,
                        "type": "token",
                        "coinspecific": {
                            "tracehash": result.hash
                        }
                    }
                ],
                "hash": result.hash,
                "currency": "ETH",
                "state": "confirmed",
                "depositType": "Contract",
                "chain": "ETH.main",
            });

        } else {
            res.send({
                "data": err.data,
                "error": err.message
            })
        }
    });

})


app.listen(port, () => {
    console.log(`Server started up at port ${port}`);
});