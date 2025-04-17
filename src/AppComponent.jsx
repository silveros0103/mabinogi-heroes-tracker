import { CharacterProvider } from "./context/CharacterContext";
import Header from "./components/Header";
import CharacterGrid from "./components/CharacterGrid";

export default function AppComponent() {
  return (
    <CharacterProvider>
      <div className="p-6 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Header />
        <CharacterGrid />
      </div>
    </CharacterProvider>
  );
}
