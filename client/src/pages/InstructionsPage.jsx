import PageComponent from "../components/PageContent.jsx";
import one from "../assets/one.png";
import two from "../assets/two.png";
import three from "../assets/three.png";

function InstructionsPage() {
    return (
        <PageComponent title="Game Instructions">
            <div className="instruction-step">
                <img
                    src={one}
                    alt="Number one"
                    className="pocal-icon"
                />
                <p>Take a good look at the provided map of the metro stations with the connecting lines. When
                you are ready: click the "Start Playing!" button.</p>
            </div>
            <div className="instruction-step">
                <img
                    src={two}
                    alt="Number two"
                    className="pocal-icon"
                />
                <p>The game has started and you have 90 seconds to submit your answer! Connect the provided start station
                with the end station by moving through the connected lines. But beware: events may happen during your
                travel. Press the "Submit route" button when you have a connecting route. </p>
            </div>
            <div className="instruction-step">
                <img
                    src={three}
                    alt="Number three"
                    className="pocal-icon"
                />
                <p>You will now see your results! Events happening during your route will affect your final score.
                Your best score will be displayed on the "Ranking" page, play again to improve your score!</p>
            </div>
        </PageComponent>
    )
}

export default InstructionsPage