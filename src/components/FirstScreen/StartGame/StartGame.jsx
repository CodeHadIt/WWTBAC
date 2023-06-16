import React, { useState, useEffect } from 'react';

import Button from '../../UI/Button/Button';
import LoadModal from '../../UI/Modals/LoadModal';
import styles from './StartGame.module.css'

const StartGame = props => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [account, setAccount] = useState (null);

    useEffect(()=> {
        if(account) {
            setWalletConnected(true);
            props.onStart(account);
        }
    }, [account])

    const connectWallet =  async () => {
        if (window.ethereum != undefined) {
            if(window.ethereum.networkVersion == "5") {
                try {
                  const account = await window.ethereum.request({
                    method: "eth_requestAccounts",
                  });
                  setAccount(account[0]);
                } catch (error) {
                  console.log(error.message);
                }
            } else {
                alert("please Switch to Goerli Network")
            }
        } else {
            alert(
            "Please Open App in a browser with an Ethereum based wallet and switch to Goerli testnet"
            );
        }

    }

    return (
        <>
            <div className={styles.start_container}>
                <h1 className={styles.start_headline}>
                    Do You Want To Become A <span className="accent">Cryptonaire?</span>
                </h1>
                <Button onClick={props.onClick}>Play Game</Button>
            </div>
            {!walletConnected && 
            <LoadModal 
                onConnect={connectWallet}
            />}
        </>
    );
};

export default StartGame;