import React, { useState, useEffect, useCallback } from "react";

export const MouseContext = React.createContext({
  mouseX: 0,
  mouseY: 0,
});

const MouseObserver = ({ children }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMoveMouse = useCallback((event) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", (event) => handleMoveMouse(event), {
      passive: true,
    });

    return () => window.removeEventListener("mousemove", handleMoveMouse);
  }, []);

  return (
    <MouseContext.Provider value={{ mouseX, mouseY }}>
      {children}
    </MouseContext.Provider>
  );
};

export default MouseObserver;
