import React, {useEffect, useState} from "react";
import { ethers } from "ethers";

import {
  TokenContractAddress,
  ManagerContractAddress,
  ManagerAbi,
  Tokenabi,
} from "./Utils/constance";
import moneyData from "./components/data/moneyData";
import MoneyList from "./components/MoneyList/MoneyList";
import Button from "./components/UI/Button/Button";
import StartGame from "./components/FirstScreen/StartGame/StartGame";
import QuestionsandAnswers from "./components/QuestionandAnswers/QuestionsandAnswers";
import questionData from "./components/data/questionData";
import Confetti from "react-confetti"; 




function App() {


  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [amountWon, setAmountWon] = useState("$ 0");
  const [userAccount, setUserAccount] = useState(null);

  const [managerContract, setManagerContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  
  
  useEffect(() => {
    //Sets the amount a user wins by looping through the money data.
    currentQuestionNum > 1 && setAmountWon(moneyData.find(amount => amount.id === currentQuestionNum -1).amount);
    //When the currentQuestion number exceeds the length of our money data (meaning our game has finished), we update the necessary states.
    if(currentQuestionNum > moneyData.length) {
      setTimeElapsed(true);
      setGameWon(true);
    }
  }, [currentQuestionNum]);


  useEffect(()=> {
    if(timeElapsed) {
      fundPlayer();
    } else{
      return;
    }
  }, [timeElapsed])

  const getAccount = account => {
    setUserAccount(account);
  }

  const startGame = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ManagerContract = new ethers.Contract(ManagerContractAddress, ManagerAbi, signer);
    const TokenContract = new ethers.Contract(TokenContractAddress, Tokenabi, signer);
    setManagerContract(ManagerContract);
    setTokenContract(TokenContract);
    setGameStarted(true);
  }

  const fundPlayer = async () => {
    
    const withdrawAmount = String(parseInt(amountWon.slice(2)));
    if(withdrawAmount === "0") {
      return;
    } else {
          try {
            const transactionResponse = await managerContract.innerTransfer(
              userAccount,
              withdrawAmount, 
              {gasLimit: 60000}
            );
            await transactionResponse.wait();
          } catch (error) {
            console.log(error.message);
          }
    }
  }

  //When we click restsrt, some statates are updated.
  function restartGame() {
    setTimeElapsed(false);
    setCurrentQuestionNum(1);
    setAmountWon("$ 0");
  }

  return (
    <>
      
      {gameStarted ? 
        <div className="app">
          <div className="main-container">
            {timeElapsed? 
            <div className="won-container"> 
              {gameWon ? 
                <>
                  <h2 className="won-message">Congratulations, You won the Jackpot of {amountWon}</h2>
                  <Confetti />  
                </> :
                <h2 className="won-message"> You won {amountWon}</h2> 
              }
              <Button onClick={restartGame}>Replay</Button>
              
            </div> : (
              <>
                  <QuestionsandAnswers
                    key={moneyData.map(level => (level.id))}
                    data={questionData} 
                    setTimeElapsed={setTimeElapsed} 
                    currentQuestionNum={currentQuestionNum}
                    setCurrentQuestionNum={setCurrentQuestionNum}
                  />
              </>
            )}
            
          </div>
            
          <MoneyList 
            currentQuestionNum={currentQuestionNum}
          />
        </div>
      :
        <StartGame
          onClick={startGame}
          onStart={getAccount}
        />
      }
    
    </>
  );
}

export default App;
