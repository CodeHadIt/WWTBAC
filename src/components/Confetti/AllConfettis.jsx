import React, {useState, useEffect} from 'react';
import Confetti from 'react-confetti';

const AllConfettis = props => {
  const [mobileScreen, setMobileScreen] = useState("");
  const [tabletScreen, setTabletScreen] = useState("");
  const [desktopScreen, setDesktopScreen] = useState("");

  useEffect(() => {
    //Confetti displays after the currentQuestionNum changes.
        handleResize();
    }, [props.currentQuestionNum]);

    //We update the appropriate state depending on the current screen size.
    function handleResize() {
          if (window.innerWidth < 768) {
          setMobileScreen("mobile");
          } else if (window.innerWidth < 992) {
          setTabletScreen("tablet");
          } else {
          setDesktopScreen("desktop");
          }
      };

  return (
    <>
      <div>
        {mobileScreen === "mobile" && (
          <Confetti confettiSource={{ x: 140, y: 720 }} />
        )}
      </div>

      <div>
        {tabletScreen === "tablet" && (
          <Confetti confettiSource={{ x: 270, y: 720 }} />
        )}
      </div>

      <div>
        {desktopScreen === "desktop" && (
          <Confetti confettiSource={{ x: 600, y: 700 }} />
        )}
      </div>
    </>
  );
}

export default AllConfettis;