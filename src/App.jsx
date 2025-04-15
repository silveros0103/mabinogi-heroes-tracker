import { useState, useEffect } from "react";
import CharacterCard from "./components/CharacterCard";
import { useFirebase } from "./hooks/useFirebase";
import { calculateAverageProgress } from "./utils/progressUtils";

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [progress, setProgress] = useState({});
  const [taskSets, setTaskSets] = useState({
    daily: ["토벌전", "입욕제", "정령 토큰"],
    weekly: ["결사대", "길드 레이드"],
    monthly: ["랭크업", "월간 이벤트"],
  });
  const [newChar, setNewChar] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { user, loginWithGoogle, saveUserData, loadUserData } = useFirebase();

  useEffect(() => {
    if (user) {
      loadUserData(user.uid).then((data) => {
        if (data) {
          setCharacters(data.characters || []);
          setProgress(data.progress || {});
          setTaskSets(data.taskSets || taskSets);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      saveUserData(user.uid, { characters, progress, taskSets });
    }
  }, [characters, progress, taskSets, user]);

  const addCharacter = () => {
    if (!newChar || characters.includes(newChar)) return;
    const updated = {
      ...progress,
      [newChar]: {
        daily: Object.fromEntries(taskSets.daily.map((t) => [t, false])),
        weekly: Object.fromEntries(taskSets.weekly.map((t) => [t, false])),
        monthly: Object.fromEntries(taskSets.monthly.map((t) => [t, false])),
        memo: "",
      },
    };
    setCharacters([...characters, newChar]);
    setProgress(updated);
    setNewChar("");
  };

  const removeCharacter = (name) => {
    setCharacters(characters.filter((c) => c !== name));
    const copy = { ...progress };
    delete copy[name];
    setProgress(copy);
  };

  const toggleTask = (char, type, task) => {
    setProgress((prev) => ({
      ...prev,
      [char]: {
        ...prev[char],
        [type]: {
          ...prev[char][type],
          [task]: !prev[char][type][task],
        },
      },
    }));
  };

  const updateMemo = (char, value) => {
    setProgress((prev) => ({
      ...prev,
      [char]: {
        ...prev[char],
        memo: value,
      },
    }));
  };

  const moveCharacter = (name, direction) => {
    const idx = characters.indexOf(name);
    const newChars = [...characters];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newChars.length) return;
    [newChars[idx], newChars[swapIdx]] = [newChars[swapIdx], newChars[idx]];
    setCharacters(newChars);
  };

  const removeTask = (task, type) => {
    const newSet = {
      ...taskSets,
      [type]: taskSets[type].filter((t) => t !== task),
    };
    const newProgress = { ...progress };
    characters.forEach((char) => {
      delete newProgress[char][type][task];
    });
    setTaskSets(newSet);
    setProgress(newProgress);
  };

  const average = calculateAverageProgress(progress);

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="mb-4 flex gap-2 items-center">
        <input
          placeholder="캐릭터 이름 입력"
          value={newChar}
          onChange={(e) => setNewChar(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button onClick={addCharacter}>캐릭터 추가</button>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}
        </button>
        <button onClick={loginWithGoogle}>
          {user ? `👤 ${user.displayName}` : "Google 로그인"}
        </button>
        <span className="ml-auto font-bold">📊 평균 숙제 진행률: {average}%</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {characters.map((char) => (
          <CharacterCard
            key={char}
            char={char}
            data={progress[char]}
            taskSets={taskSets}
            onToggle={toggleTask}
            onRemove={removeCharacter}
            onMemoChange={updateMemo}
            onMoveUp={() => moveCharacter(char, "up")}
            onMoveDown={() => moveCharacter(char, "down")}
            onRemoveTask={removeTask}
          />
        ))}
      </div>
    </div>
  );
}
