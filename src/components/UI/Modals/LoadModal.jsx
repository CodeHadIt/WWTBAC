import React from "react";

import Card from "../Card/Card";
import Button from "../Button/Button"
import styles from "./LoadModal.module.css";


const Backdrop = (props) => {
    return (
        <div className={styles.backdrop} onClick={props.onConnect}>
        {" "}
        </div>
    );
};

const IntroOverlay = (props) => {
    return (
      <Card className={styles.modal}>
        <div className={styles.header}>
          <h2>Game Instructions</h2>
        </div>

        <div className={styles.content}>
          <h4 className={styles.headline}>
            To best enjoy the game, connect a web 3 wallet and switch network to
            the goerli testnet. You can however play without a wallet.
          </h4>
          <ol className={styles.rules}>
            <li>
              Follow these instructions if you'd like to play with your wallet
              connected.
              <ul className={styles.sub_rules}>
                <li>
                  Go to{" "}
                  <a
                    href="https://chainlist.org"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.chainlist_link}
                  >
                    chainlist.org
                  </a>{" "}
                  and search for Georli{" "}
                </li>
                <li>
                  Be sure to check the "Include Testnets" box to see the Georli
                  network
                </li>
                <li>Click on add to MetaMask</li>
              </ul>
            </li>
            <li>
              Next, get some FREE test Ethereum to pay for gas.{" "}
              <span className="accent">Fret not! they're cheap :-)</span>
              <ul className={styles.sub_rules}>
                <li>
                  Sign up on{" "}
                  <a
                    href="https://goerlifaucet.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Alchemy
                  </a>{" "}
                  to get 0.1 test Ether
                </li>
              </ul>
            </li>
            <li>
              If you have the Goerli network with test Ether on your wallet,
              click on the Connect button below
            </li>
          </ol>
        </div>

        <div className={styles.actions}>
          <Button onClick={props.onConnect}>Connect Wallet</Button>
          <Button onClick={props.onPlay} btn={styles.playButton}>Play Without Connecting</Button>
        </div>
      </Card>
    );
};

const ConnectOverlay = (props) => {
    return (
      <Card className={styles.modal}>
        <div className={styles.header}>
          <h2>Important Notice</h2>
        </div>

        <div className={styles.content}>
          <h4 className={styles.headline}>
            We do hope you're enjoying the game so far! To continue playing, please connect a wallet
          </h4>
          <ol className={styles.rules}>
            <li>
              Make sure you have the Goerli Ethereum Testnet added on your
              MetaMask Wallet. If you don't have, here's how to get it:
              <ul className={styles.sub_rules}>
                <li>
                  Go to{" "}
                  <a
                    href="https://chainlist.org"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.chainlist_link}
                  >
                    chainlist.org
                  </a>{" "}
                  and search for Georli{" "}
                </li>
                <li>
                  Be sure to check the "Include Testnets" box to see the Georli
                  network
                </li>
                <li>Click on add to MetaMask</li>
              </ul>
            </li>
            <li>
              Next, get some FREE test Ethereum to pay for gas.{" "}
              <span className="accent">Fret not! they're cheap :-)</span>
              <ul className={styles.sub_rules}>
                <li>
                  Sign up on{" "}
                  <a
                    href="https://goerlifaucet.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Alchemy
                  </a>{" "}
                  to get 0.1 test Ether
                </li>
              </ul>
            </li>
            <li>
              If you have the Goerli network with test Ether on your wallet,
              click on the Connect button below
            </li>
          </ol>
        </div>

        <div className={styles.actions}>
          <Button onClick={props.onConnect}>Connect Wallet</Button>
        </div>
      </Card>
    );
};

export const LoadModal = (props) => {
    return (
      <>
        <Backdrop />
        <IntroOverlay onPlay={props.onPlay}  onConnect={props.onConnect} />
      </>
    );
};

export const ConnectModal = (props) => {
    return (
      <>
        <Backdrop />
        <ConnectOverlay onConnect={props.onConnect} />
      </>
    );
}

