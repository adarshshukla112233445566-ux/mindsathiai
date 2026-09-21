from pathlib import Path

path = Path('/home/ubuntu/mindsaathi/client/src/pages/Home.tsx')
text = path.read_text()
marker = 'function ActivitiesView({ snapshot, onSave, setActive }: { snapshot?: Snapshot; onSave: (type: ActivityType, score: number, accuracy: number, responseTime: number, difficulty: string) => void; setActive: (value: string) => void }) {'
insert = r'''type MiniGame = "words" | "numbers" | "colors";

const miniGameMeta: Record<MiniGame, { title: string; description: string; icon: typeof Brain; tint: string }> = {
  words: { title: "Word Recall", description: "Remember a few familiar words and choose the one you saw.", icon: BookOpen, tint: "bg-[#f1edfa] text-[#7562a9]" },
  numbers: { title: "Number Sequence", description: "Complete a friendly number pattern at your own pace.", icon: Target, tint: "bg-[#eaf3fa] text-[#3178a7]" },
  colors: { title: "Color Focus", description: "Find the requested color and keep your attention gently moving.", icon: Lightbulb, tint: "bg-[#fff4df] text-[#b77a3e]" },
};

const miniGameQuestions: Record<MiniGame, string[]> = {
  words: ["Which word did you see?", "Which word belongs in the list?", "Which word was part of the group?"],
  numbers: ["2, 4, 6, ?", "5, 10, 15, ?", "3, 6, 9, ?"],
  colors: ["Tap the green option", "Tap the blue option", "Tap the amber option"],
};

function MiniGames() {
  const [selected, setSelected] = useState<MiniGame | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const options: Record<MiniGame, string[][]> = {
    words: [["Garden", "Window", "River", "Chair"], ["Tea", "Book", "Cloud", "Bell"], ["Flower", "Morning", "Pencil", "Music"]],
    numbers: [["8", "10", "12", "14"], ["15", "20", "25", "30"], ["9", "12", "15", "18"]],
    colors: [["Green", "Blue", "Amber", "Rose"], ["Green", "Blue", "Amber", "Rose"], ["Green", "Blue", "Amber", "Rose"]],
  };
  const correct: Record<MiniGame, string[]> = { words: ["Garden", "Book", "Music"], numbers: ["8", "20", "12"], colors: ["Green", "Blue", "Amber"] };
  const choose = (answer: string) => {
    const isCorrect = answer === correct[selected!][round - 1];
    const nextScore = score + (isCorrect ? 1 : 0);
    setScore(nextScore);
    setFeedback(isCorrect ? "That feels right." : "Good try. Keep going.");
    window.setTimeout(() => { setFeedback(""); if (round < 3) setRound(value => value + 1); else setRound(4); }, 350);
  };
  const reset = () => { setSelected(null); setRound(1); setScore(0); setFeedback(""); };
  if (selected && round === 4) return <div className="rounded-3xl border border-[#d9eadc] bg-[#eaf5ec] p-6 text-center"><div className="text-sm font-extrabold uppercase tracking-[.14em] text-[#4f9a63]">Mini-game complete</div><h2 className="mt-2 text-2xl font-extrabold text-[#123e63]">{score} of 3 correct</h2><p className="mt-2 text-sm text-[#4f7e59]">A little practice is enough for today.</p><div className="mt-5 flex justify-center gap-3"><Button variant="soft" onClick={() => { setRound(1); setScore(0); }}>Play again</Button><Button variant="outline" onClick={reset}>Choose another</Button></div></div>;
  if (selected) { const meta = miniGameMeta[selected]; return <div className="rounded-3xl border border-[#dce9e0] bg-white p-6 soft-shadow"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-[.14em] text-[#4f9a63]">{meta.title}</p><h2 className="mt-2 text-2xl font-extrabold text-[#123e63]">{miniGameQuestions[selected][round - 1]}</h2></div><button onClick={reset} className="text-sm font-bold text-[#6b7c8f]">Exit</button></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{options[selected][round - 1].map(option => <button key={option} onClick={() => choose(option)} className="min-h-14 rounded-2xl border-2 border-[#e5e9ec] bg-white px-3 text-sm font-extrabold text-[#123e63] transition hover:border-[#8cc296] hover:bg-[#eaf5ec]">{option}</button>)}</div><div className="mt-5 flex items-center justify-between text-xs font-bold text-[#6b7c8f]"><span>Round {round} of 3</span><span className="text-[#4f9a63]">{feedback || `${score} correct`}</span></div></div>; }
  return <section className="space-y-4"><div><p className="text-sm font-extrabold uppercase tracking-[.14em] text-[#4f9a63]">More ways to play</p><h2 className="mt-1 text-2xl font-extrabold tracking-[-.04em] text-[#123e63]">Choose a mini-game</h2><p className="mt-1 text-sm text-[#6b7c8f]">Short activities for memory, focus and everyday confidence.</p></div><div className="grid gap-4 md:grid-cols-3">{(Object.keys(miniGameMeta) as MiniGame[]).map(type => { const meta = miniGameMeta[type]; const Icon = meta.icon; return <div key={type} className="card-hover rounded-2xl border border-[#e5e9ec] bg-white p-5 soft-shadow"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${meta.tint}`}><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-extrabold text-[#123e63]">{meta.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[#6b7c8f]">{meta.description}</p><Button className="mt-4 w-full" onClick={() => { setSelected(type); setRound(1); setScore(0); }}>Play now <ArrowRight className="h-4 w-4" /></Button></div>; })}</div></section>;
}

'''
if 'function MiniGames()' not in text:
    text = text.replace(marker, insert + marker)
needle = '<PageIntro eyebrow="Cognitive activities" title="Choose an activity" description="Short, familiar games designed to be clear, calm and easy to begin." />'
replacement = needle + '<MiniGames />'
if '<MiniGames />' not in text:
    text = text.replace(needle, replacement)
path.write_text(text)
PY
python3 /home/ubuntu/mindsaathi/scripts_add_mini_games.py
rm /home/ubuntu/mindsaathi/scripts_add_mini_games.py
