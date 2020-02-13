import { useCallback, useEffect } from "react";

export const useDetectCursorPosition = handleUserKeyPress => {
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    window.addEventListener("click", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
      window.removeEventListener("click", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);
};

export const useSetCursorPosition = setCursorPosition =>
  useCallback(event => {
    if (event.target.selectionStart) {
      setCursorPosition(event.target.selectionStart);
    }
  }, []);
