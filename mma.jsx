import { useState } from "react";
import { motion } from "framer-motion";

export default function ConcertPage() {
  const [language, setLanguage] = useState("ja");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const switchLanguage = () => setLanguage(language === "ja" ? "en" : "ja");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="p-4 bg-blue-500 text-white flex justify-between items-center">
        <h1 className="text-2xl">{language === "ja" ? "コンサート情報" : "Concert Info"}</h1>
        <div className="flex gap-4">
          <button onClick={switchLanguage} className="bg-white text-blue-500 px-3 py-1 rounded">
            {language === "ja" ? "English" : "日本語"}
          </button>
          <button onClick={toggleMenu} className="bg-white text-blue-500 px-3 py-1 rounded">
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Menu */}
      {menuOpen && (
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-200 p-4">
          <ul>
            <li className="p-2">{language === "ja" ? "ホーム" : "Home"}</li>
            <li className="p-2">{language === "ja" ? "スケジュール" : "Schedule"}</li>
            <li className="p-2">{language === "ja" ? "チケット" : "Tickets"}</li>
          </ul>
        </motion.nav>
      )}

      {/* Content */}
      <main className="p-6">
        <h2 className="text-xl mb-4">{language === "ja" ? "今後のイベント" : "Upcoming Events"}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((event) => (
            <motion.div key={event} whileHover={{ scale: 1.05 }} className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-bold">{language === "ja" ? `イベント ${event}` : `Event ${event}`}</h3>
              <p>{language === "ja" ? "詳細はこちら" : "More details here"}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
