import React from "react";
import ReactDOM from "react-dom";
import Card from "../Card/Card";
import Button from "../Button/Button";
import styles from "./PopUpModal.module.css";

const Backdrop = props => {
    return (
        <div className={styles.backdrop} onClick={props.onClear}>
        {" "}
        </div>
    );
};

const Overlay = props => {
    return (
        <Card className={styles.modal}>
            <header className={styles.header}>
                <h2>{props.title}</h2>
            </header>

            <div className={styles.content}>
                <p>{props.message}</p>
            </div>

            <footer className={styles.actions}>
                <Button onClick={props.onClear}>Okay</Button>
            </footer>
        </Card>
    );
};

const PopUpModal = (props) => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop onClear={props.onClear} />,
                document.getElementById("backdrop-root")
            )}

            {ReactDOM.createPortal(
                <Overlay
                onClear={props.onClear}
                title={props.title}
                message={props.message}
                />,
                document.getElementById("overlay-root")
            )}
        </>
    );
};

export default PopUpModal;
