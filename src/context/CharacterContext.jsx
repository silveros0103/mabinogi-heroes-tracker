import { createContext, useContext, useState } from 'react';

const CharacterContext = createContext();

export function CharacterProvider({ children }) {
  const [characters, setCharacters] = useState([]);
  const [progress, setProgress] = useState({});
  const [taskSets, setTaskSets] = useState({
    daily: ['토벌전', '입욕제', '정령 토큰'],
    weekly: ['결사대', '길드 레이드'],
    monthly: ['랭크업', '월간 이벤트'],
  });
  const [darkMode, setDarkMode] = useState(false);

  return (
    <CharacterContext.Provider
      value={{
        characters,
        setCharacters,
        progress,
        setProgress,
        taskSets,
        setTaskSets,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  return useContext(CharacterContext);
}
