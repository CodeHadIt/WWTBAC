import React, {useState} from 'react'

const LifeLine = props => {
  
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedChatGPT, setUsedChatGPT] = useState(false);

  const handleFiftyFifty = () => {
    if (!usedFiftyFifty) {
      props.onUseFiftyFifty();
      setUsedFiftyFifty(true);
    }else {
      return;
    }
  }

  const handleAskChatGPT = () => {
    if(!usedChatGPT) {
      props.onUseChatGPT();
      setUsedChatGPT(true);
    }else {
      return;
    }
  }
  

  return (
    <>
      <button className= {`fifty-fifty top-items ${usedFiftyFifty ? "used_life-line" : ""}`} onClick={handleFiftyFifty}> 50/50</button>
      <button className={`ask-gpt top-items ${usedChatGPT ? "used_life-line" : ""}`} onClick={handleAskChatGPT}>Ask Chat GPT</button>
    </>
  )
}

export default LifeLine;