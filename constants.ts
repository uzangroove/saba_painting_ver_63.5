const GITHUB_BASE_URL = "https://raw.githubusercontent.com/uzangroove/game_assets/main/";

// רשימת שמות הקבצים (monster1 עד monster14)
export const MONSTER_NAMES = Array.from({ length: 14 }, (_, i) => `monster${i + 1}`);

// מיפוי של שם מפלצת לכתובת ה-URL שלה ב-GitHub
export const MONSTER_URLS = MONSTER_NAMES.reduce((acc, name) => {
  acc[name] = `${GITHUB_BASE_URL}${name}.obj`;
  return acc;
}, {} as Record<string, string>);

// פונקציית עזר לבחירת מפלצת רנדומלית
export const getRandomMonsterName = () => {
  const randomIndex = Math.floor(Math.random() * MONSTER_NAMES.length);
  return MONSTER_NAMES[randomIndex];
};