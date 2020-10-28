import { useLayoutEffect, useRef } from "react";

//Referenced from Dan Abramov on Egghead
//https://egghead.io/lessons/react-preserve-cursor-position-when-filtering-out-characters-from-a-react-input
export const useRunAfterUpdate = () => {
  const afterPaintRef = useRef(null);
  useLayoutEffect(() => {
    if (afterPaintRef.current) {
      afterPaintRef.current();
      afterPaintRef.current = null;
    }
  });
  const runAfterUpdate = fn => (afterPaintRef.current = fn);
  return runAfterUpdate;
};
