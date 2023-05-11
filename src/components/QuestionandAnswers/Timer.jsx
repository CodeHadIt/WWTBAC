import React, {useState, useEffect} from 'react';

const Timer = props => {
    const [countDown, setCountDown] = useState(30);

    useEffect(() => {
        if(countDown === 0) {
            props.setTimeElapsed(true);
        }
        const timer = setInterval(()=> {
            setCountDown(prevCount => prevCount -1);
        }, 1000);
        
        return () => clearInterval(timer);
    }, [props.setTimeElapsed, countDown]);

    useEffect(()=> {
        setCountDown(30);
    }, [props.currentQuestionNum])
    
    return countDown;
}

export default Timer;