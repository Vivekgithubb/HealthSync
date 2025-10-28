import { useState } from "react";

const TextToSpeech = ({ text }) => {
  const [speak, setSpeak] = useState(false);
  const handleSpeak = () => {
    setSpeak(true);
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
    window.speechSynthesis.onvoiceschanged = () => {
      console.log(window.speechSynthesis.getVoices());
    };
  };

  const stopSpeak = () => {
    setSpeak(false);
    window.speechSynthesis.cancel();
  };
  return (
    <div className="text-[14px]">
      {speak === false ? (
        <button
          className="bg-zinc-400 text-zinc-900 p-1 px-2 rounded-md shadow-md hover:bg-zinc-300 transition-colors "
          onClick={handleSpeak}
        >
          Click to 🔊 Speak
        </button>
      ) : (
        <div>
          <button
            className="bg-blue-200 p-1 px-2 rounded-md shadow-md hover:bg-zinc-300 transition-colors"
            onClick={stopSpeak}
          >
            🛑 Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
