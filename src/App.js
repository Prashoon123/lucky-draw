import { useRef, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import "./App.css";
import { db } from "./firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Spinner from "react-spinkit";

function App() {
  const [input, setInput] = useState("");
  const [participants, loading] = useCollection(db.collection("participants"));
  const [winner, setWinner] = useState(null);
  const winnerRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("participants").add({
      name: input,
    });

    setInput("");
  };

  const randomWinner = () => {
    const randomParticipant = Math.floor(
      Math.random() * participants?.docs.length
    );
    setWinner(participants?.docs[randomParticipant].data().name);
    setTimeout(() => {
      winnerRef.current.scrollIntoView({ behaviour: "smooth" });
    }, 100);
  };

  return (
    // BEM naming convention
    <div className="app">
      <div style={{ height: 10 }} />
      <form>
        <TextField
          label="Enter your name"
          required
          value={input}
          variant="filled"
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={{ height: 10 }} />
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={handleSubmit}
          disabled={!input}
        >
          Enter the lucky draw
        </Button>
      </form>
      <div style={{ height: 10 }} />
      <h2>Participants List -</h2>
      {loading ? (
        <>
          <div style={{ height: 50 }} />
          <Spinner name="ball-spin-fade-loader" />
        </>
      ) : (
        ""
      )}
      <div style={{ height: 5 }} />
      <h4>
        <ol>
          {participants?.docs.map((participant, index) => (
            <>
              <li key={index}>{participant.data().name}</li>
            </>
          ))}
        </ol>
      </h4>
      <div style={{ height: 10 }} />
      {participants && (
        <Button variant="contained" color="primary" onClick={randomWinner}>
          Give me a random winner
        </Button>
      )}
      <div style={{ height: 5 }} />
      {winner && (
        <>
          <h1 id="winner" ref={winnerRef}>
            The winner is: {winner}
          </h1>
        </>
      )}
    </div>
  );
}

export default App;
