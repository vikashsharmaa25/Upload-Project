import React, { useState, useEffect } from 'react'
import { AE_AMOUNT_FORMATS } from '@aeternity/aepp-sdk'
import useAeternitySDK from './Scripts/useAeternitySDK.ts'
// import backGroundImage from './assets/BackGround_Image.png'
import ChatBot from './ChatBot'
// import './Connect.css'
//networkId
const Connect = ({ price }) => {
    const { aeSdk, connectToWallet, address, getBalance } = useAeternitySDK();
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(null);
    const [spendTo, setSpendTo] = useState('');
    const [spendAmount, setSpendAmount] = useState('0.1');
    const [thankYouVisible, setThankYouVisible] = useState(false);
    const [noAmount, setnoAmount] = useState(false);


    const [showChatbot, setShowChatbot] = useState(false);


    const closeChatbot = () => {
        setShowChatbot(false);
    };
    const openChatBot = () => {
        setShowChatbot(true);
    }

    let aci = [
        {
            "contract": {
                "functions": [
                    {
                        "arguments": [],
                        "name": "init",
                        "payable": false,
                        "returns": "CharityTransfer.state",
                        "stateful": false
                    },
                    {
                        "arguments": [],
                        "name": "sendMoney",
                        "payable": true,
                        "returns": {
                            "tuple": []
                        },
                        "stateful": true
                    },
                    {
                        "arguments": [],
                        "name": "getContractDetails",
                        "payable": false,
                        "returns": "CharityTransfer.state",
                        "stateful": false
                    }
                ],
                "kind": "contract_main",
                "name": "CharityTransfer",
                "payable": true,
                "state": {
                    "record": [
                        {
                            "name": "user1",
                            "type": "address"
                        },
                        {
                            "name": "user2",
                            "type": "address"
                        },
                        {
                            "name": "amount",
                            "type": "int"
                        },
                        {
                            "name": "isConfirmed",
                            "type": "bool"
                        }
                    ]
                },
                "typedefs": []
            }
        }
    ];
    let bytecode =
        "cb_+QE0RgOg9VJwCt/1bunq4G0DoMIjvwztRQHnOmS4btUFfbgIcyPAuQEGuM3+Dv7QsgA3ADcERwBHAAcXDAKCDAKEDAKGDAKIJwwIAP5E1kQfADcANwBVAoIaDoSfAKDV2POv3jVbFg8fneTzQzjhJ42+W4ZvmRZh17lUxKBJaxoOhgAaDoh/AQM//qGAQw0ENwA3ACYIiAcMBPsDpVRyYW5zYWN0aW9uIGFscmVhZHkgY29uZmlybWVkIG9yIHJlamVjdGVkCwAfMAAHDAj7A31BbW91bnQgc2hvdWxkIGJlIGdyZWF0ZXIgdGhhbiAwCwAUCoaGAQM/sy8DEQ7+0LJJZ2V0Q29udHJhY3REZXRhaWxzEUTWRB8RaW5pdBGhgEMNJXNlbmRNb25leYIvAIU3LjQuMAFOSKJN";



    useEffect(() => {
        const fetchBalance = async () => {
            try {
                setSpendTo('ak_2QaAzpW4w4pnPNDdrgdLHu5v4bGMxVzUD2F16X3aUrayPcBzZm');
                const balance = await aeSdk.getBalance(address, { format: AE_AMOUNT_FORMATS.AE });
                setBalance(balance);
            } catch (error) {
                console.error(error.message);
            }
        };

        if (address) {
            fetchBalance();
        }
    }, [aeSdk, address, getBalance]);


    const updateBalance = async () => {
        const balance = await aeSdk.getBalance(address, { format: AE_AMOUNT_FORMATS.AE });
        setBalance(balance);
    }


    const handleConnectClick = async () => {
        setIsLoading(true);
        try {
            await connectToWallet();
        } catch (error) {
            if (!(error instanceof Error)) throw error;
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
        setSpendAmount(price);
    };
    const get = async () => {
        const balance = await aeSdk.getBalance(address, { format: AE_AMOUNT_FORMATS.AE });

        setBalance(balance);

    }

    const handleSpendClick = async () => {
        try {
            console.log(spendAmount, spendTo);
            const contract = await aeSdk.initializeContract({ aci, bytecode, address: "ct_VAVZxayCvmd163vQGpGrNRmaZLfVMbRHnxSVAuwovGEDCjBCs" })
            console.log("contract", contract);


            // const sendMoneyResult = await contract.sendMoney("ak_cgWc8Rs7UcrmRu7VMXBCsG3mMaAKMmAnKgPWsWby5S5C5rhc3");
            // console.log(sendMoneyResult);
            const options1 = {
                amount: spendAmount * 1000000000000000000,
                callData: "",
                fee: null,
                gas: null,
                gasPrice: 1000000000,
            };
            const args = [];
            const options = Object.fromEntries(
                Object.entries(options1).filter(([, v]) => v != null),
            );

            contract
                ?.$call("sendMoney", args, options)
                .then((result) => {
                    console.log(result);
                    // setSpendPromise(result.hash)
                    get()
                    setSpendAmount('')
                    setThankYouVisible(true)
                    setTimeout(() => setThankYouVisible(false), 5000);
                    console.log(result);

                });

            // const result = await aeSdk.spend(spendAmount * 1000000000000000000, spendTo);


        } catch (error) {
            console.error(error.message);
            setThankYouVisible(false)
        }
        updateBalance()
    };


    return (
        <>
            <div
                className='background-image'
            >
                {address ? (
                    <React.Fragment>

                        <div
                            className='flex items-center justify-center '
                        >

                            <div className='p-4 rounded-lg shadow-md w-64
                flex flex-col items-start '>


                                <div
                                    className='outline-none px-1 py-4'
                                >
                                    <label
                                        className='p__cormorant font-serif text-black   '
                                    >Balance: {balance} Ae Coins</label>
                                </div>


                                <div className='
                            outline-none px-1 py-4
                            '>
                                    <label
                                        className='Amount-Display font-serif text-black'
                                    >Amount to Pay: {spendAmount} Ae Coin</label>

                                </div>
                                {thankYouVisible && (
                                    <div className="text-green-500">
                                        Successfully paid and subscribed!
                                        Check your mail for Confirmation of email
                                    </div>
                                )}

                                {noAmount && (
                                    <div className='text-red-500'>
                                        Amount must be greator than 0
                                    </div>
                                )}


                                <button className='font-serif text-black focus:ring-4 bg-green-600 focus:ring-green-600 font-medium rounded-lg text-sm px-1.5 py-2.5 me-2 mb-2focus:outline-none '
                                    onClick={() => {
                                        if (spendAmount) {
                                            handleSpendClick()
                                        }
                                        else {
                                            setnoAmount(true);
                                            setTimeout(() => setnoAmount(false), 5000);
                                        }
                                    }}
                                >
                                    Confirm
                                </button>

                            </div>

                            <div className='fixed bottom-5 right-5 flex flex-row-reverse '>
                                <button
                                    className='font-serif bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4'
                                    onClick={openChatBot}
                                >Bot</button>

                                {showChatbot && <ChatBot closeChatbot={closeChatbot} instance={aeSdk} address={address} updateBalance={updateBalance} />}
                            </div>

                        </div>

                    </React.Fragment>
                ) : (
                    <React.Fragment>




                        <div className='flex items-center justify-center '>


                            <button className='text-white focus:ring-4 focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                                onClick={handleConnectClick} disabled={isLoading}
                            >
                                {isLoading ? 'Connecting…' : 'Getting Started'}
                            </button>

                        </div>


                        {isLoading}
                    </React.Fragment>
                )}
            </div>
        </>
    );
};

export default Connect;