import React, {useEffect, useState} from 'react';
import useSound from 'use-sound';
import {Configuration, OpenAIApi} from 'openai';
import correctAudio from '../../assets/audios/src_sounds_correct.mp3';
import wrongAudio from '../../assets/audios/src_sounds_wrong.mp3';
import PopUpModal from '../UI/Modals/PopUpModal';
import AllConfettis from '../Confetti/AllConfettis';
import Timer from './Timer';
import LifeLine from '../LifeLines/LifeLine';

const key = process.env.REACT_APP_OPENAI_API_KEY;

const QuestionsandAnswers = props => {
    const [question, setQuestion] = useState(null);
    const [alreadyAsked, setAlreadyAsked] = useState([]);
    const [pickedAnswer, setPickedAnswer] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [newClassName, setNewClassName] = useState("");
    const [correctSound] = useSound(correctAudio);
    const [wrongSound] = useSound(wrongAudio);
    const [confettiTime, setConfettiTime] = useState(false);
    const [chatGPTAnswer, setChatGPTAnswer] = useState("");
    const [showPopUp, setShowPopUp] = useState({type: "", show: false});


    //When we recieve the data and whenever the currentQuestionNumber changes, we call this useEffect. essentailly it calls the questionSetter function based on the currentQuestionNumber;
    useEffect(()=> {
        if(props.currentQuestionNum < 6) {
            questionSetter("EASY");
        } else if (props.currentQuestionNum < 11) {
            questionSetter("MEDIUM");
        } else  {
            questionSetter("HARD");
        }
        setExplanation(null);
    }, [props.data, props.currentQuestionNum]);

    


    //responsible for setting the question difficulty level and also for filtering questions already asked by calling the QuestionFilter function;
    function questionSetter(level) {

        //An array to store the questions contained in a specific level of difficulty. note: Will only store one  difficulty level at a time;
        let questionLevel = [];
        if (level === "EASY") {
            questionLevel = props.data.EASY;
            questionFilter(questionLevel);
        } else if (level === "MEDIUM") {
            questionLevel = props.data.MEDIUM;
            questionFilter(questionLevel);
        } else if ( level === "HARD") {
            questionLevel = props.data.HARD;
            questionFilter(questionLevel);
        }
    };

    const questionFilter = (questionLevels) => {
        //An array which filters the questions in any given difficulty level and returns the questions whose id is not the same as those contained in the alreadyAsked state Array. Thus, returns only questions that are yet to be asked;
        const remainingQuestions = questionLevels.filter(question => !alreadyAsked.includes(question.id));

        //If we are out of questions in the above array(meaning all questions have been asked already; which by the way is not possible as at the time of writting this code), then we want to set the already asked state back to empty and recursively call this very function again;
        if(remainingQuestions.length === 0) {
            setAlreadyAsked([]);
            return questionSetter();
        };

        //Variable to generate random numbers and ensure questions are random;
        const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
        //A variable to hold the next question to be asked. That question is picked at random from the questions in the remainingQuestions filtered array;
        const nextQuestion = remainingQuestions[randomIndex];
        //The nextquestion will then become the current question as we pass it into the question state;
        setQuestion(nextQuestion);
        //Now we update the already asked state array with the id of the question we just asked;
        if(alreadyAsked.length === 4 || alreadyAsked.length === 9) {
            setAlreadyAsked([])
        } else {
            setAlreadyAsked([...alreadyAsked, nextQuestion.id])
        }
        
    }

    //this is a helper function which helps to set delays between certain function calls. It takes in a function and the duration as its args and essentially returns a settimeout function;
    const delayFunc = (cbf, duration) => {
        setTimeout(() => {
            cbf();
        }, duration);
    }

    //Function called when we click on an asnwer;
    const handlePickedAnswer = answer => {
        //We update the pickedAnswer state with the answer we picked;
        setPickedAnswer(answer);
        //We also update the NewClassname state with the classname of active;
        // setNewClassName("active");

        //then we call the delayFunction with the NewClassname state update function. The function checks to see if the answer is correct and then adds then updates the className state (This is for animation sake);
        delayFunc(() => {
            setNewClassName(answer.correct ? "correct" : "wrong");
        },1000);

        //We call the delay function again, this time to help us update the currentQuestion Number, play the confetti and update the time;
        delayFunc(() => {
            //If the answer we picked is correct, we'll play the correctSound; update the currentQuestionNumber; and reset the picked answer back to null;
            if(answer.correct) {
                correctSound();
                setConfettiTime(true);
                delayFunc(()=> {
                    setConfettiTime(false);
                }, 2000);
            }
            else {
                wrongSound();
                delayFunc(()=> {
                    props.setTimeElapsed(true)
                }, 1000);
            }
        }, 3000);

        delayFunc(() => {
            setExplanation(question.Explanation);
            setShowPopUp({type: "explanation", show: true});
        }, 5000);
    }

    const handleUseFiftyFifty = () => {
        //We destructure the answer array from the question object;
        const {answers} = question;
        //filter out the wrong answers into a new array;
        const wrongAnswers = answers.filter(options => (
            options.correct === false
        )); 
        //The wrong answers are sorted randomly and then we slice(remove) the first two items.
        const removedWrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
        //return the correct option and the wrong option not removed above;
        const updatedAnswers = answers.filter(
            option => ( option.correct === true || !removedWrongAnswers.indexOf(option)
        ));

        //Now update the Question state with the new answers
        setQuestion(prevQuestions => ({
            ...prevQuestions,
            answers: updatedAnswers,
        }))
    }
    
    const handleUseAskChatGPT = async () => {
        
        const configuration = new Configuration({
          apiKey: key,
        });

        delete configuration.baseOptions.headers["User-Agent"];

        const openai = new OpenAIApi(configuration);
        const prompt = `Question: ${question.question}\nAnswer:`;
        const requestOptions = {
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }
        const response = await openai.createCompletion(requestOptions);
        setChatGPTAnswer(response.data.choices[0].text);
        setShowPopUp({ type: "chatgpt", show: true });
    };

    const clearPopUp = ()=> {
        
        if(showPopUp.type === "explanation") {
            setShowPopUp((prevObj) => ({ ...prevObj, show: false }));
            props.setCurrentQuestionNum((prevNum) => prevNum + 1);
            setPickedAnswer(null); 
        } else if (showPopUp.type === "chatgpt") {
            setShowPopUp(prevObj => ({...prevObj, show: false}));
        }
    }

    return (
      <>
        {showPopUp.show && chatGPTAnswer.length > 0 ? (
          <PopUpModal
            title="Chat-GPT's Answer"
            message={chatGPTAnswer}
            onClear={clearPopUp}
          />
        ) : (
          ""
        )}
        {showPopUp.show && explanation ? (
          <PopUpModal
            title="Explanation"
            message={explanation}
            onClear={clearPopUp}
          />
        ) : (
          ""
        )}
        <div className="top-container">
          <div className="time top-items">
            <Timer
              setTimeElapsed={props.setTimeElapsed}
              currentQuestionNum={props.currentQuestionNum}
            />
          </div>

          <LifeLine
            question={question}
            onUseFiftyFifty={handleUseFiftyFifty}
            onUseChatGPT={handleUseAskChatGPT}
          />
        </div>

        <div className="bottom-container">
          <div className="q-and-a_container">
            <div className="question">{question?.question}</div>
            <div className="answers-container">
              {question?.answers.map((answer) => (
                <div
                  className={`answer ${
                    pickedAnswer === answer ? newClassName : ""
                  }`}
                  onClick={() => handlePickedAnswer(answer)}
                  key={Math.random() * 10}
                >
                  {answer.option}
                </div>
              ))}
            </div>
            {confettiTime && (
              <AllConfettis currentQuestionNum={props.currentQuestionNum} />
            )}
          </div>
        </div>
      </>
    );
}

export default QuestionsandAnswers;