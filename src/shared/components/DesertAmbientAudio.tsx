import React, { useEffect, useRef, useState } from "react";

const DesertAmbientAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      if (!hasInteracted) {
        try {
          await audio.play();
          setHasInteracted(true);
          console.log("✅ Desert ambient sound playing");
        } catch (error) {
          console.log(
            "⚠️ Audio play failed, waiting for user interaction:",
            error
          );
        }
      }
    };

    const handleInteraction = () => {
      playAudio();
    };

    // Try to play on mount (will fail in most browsers without interaction)
    playAudio();

    // Add event listeners for user interaction
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted]);

  return (
    <audio
      ref={audioRef}
      src="/sounds/DesertAirSoundEffects.mp3"
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
};
export default DesertAmbientAudio;
