export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  trigger: string; // what action auto-completes this
  manual: boolean; // can be manually checked off
}

export const QUEST_POOL: Quest[] = [
  { id: "clear_any_gate",    title: "Gate Clearance",       description: "Clear any gate today",                    xp: 50,  trigger: "workout_logged",  manual: false },
  { id: "cardio_gate",       title: "Cardio Protocol",      description: "Clear a Cardio gate",                    xp: 40,  trigger: "cardio_logged",   manual: false },
  { id: "gym_gate",          title: "Strength Protocol",    description: "Clear a Gym gate",                       xp: 45,  trigger: "gym_logged",      manual: false },
  { id: "log_weight",        title: "Mass Calibration",     description: "Log your body weight",                   xp: 25,  trigger: "weight_logged",   manual: false },
  { id: "consult_monarch",   title: "Shadow Briefing",      description: "Consult the Shadow Monarch's Voice",     xp: 20,  trigger: "message_sent",    manual: false },
  { id: "five_exercises",    title: "Full Arsenal",         description: "Log 5+ exercises in one session",        xp: 60,  trigger: "five_exercises",  manual: false },
  { id: "log_meal",          title: "Hunter's Rations",     description: "Log a meal in the nutrition tab",        xp: 20,  trigger: "meal_logged",     manual: false },
  { id: "hydration",         title: "Hydration Decree",     description: "Drink 2L of water today",               xp: 15,  trigger: "",                manual: true  },
  { id: "stretch",           title: "Limber Up, Hunter",    description: "Complete 10 minutes of stretching",     xp: 20,  trigger: "",                manual: true  },
  { id: "sleep",             title: "Shadow Rest",          description: "Get 7+ hours of sleep last night",      xp: 30,  trigger: "",                manual: true  },
  { id: "home_gate",         title: "Shadow Training",      description: "Complete a home workout session",       xp: 35,  trigger: "home_logged",     manual: false },
  { id: "no_junk",           title: "Clean Rations",        description: "Eat no processed food today",           xp: 25,  trigger: "",                manual: true  },
];

function getTodayKey() {
  const d = new Date();
  return `forgefit_quests_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function getDailyQuests(): Quest[] {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const pool = [...QUEST_POOL];
  const picked: Quest[] = [];
  let s = seed;
  while (picked.length < 3 && pool.length > 0) {
    s = Math.floor(seededRandom(s) * pool.length);
    picked.push(pool.splice(s % pool.length, 1)[0]);
    s += seed;
  }
  return picked;
}

export function getCompletions(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(getTodayKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function completeQuest(id: string) {
  const completions = getCompletions();
  completions[id] = true;
  localStorage.setItem(getTodayKey(), JSON.stringify(completions));
  window.dispatchEvent(new CustomEvent("quests_updated"));
}

export function triggerQuestCompletion(trigger: string): string[] {
  const quests = getDailyQuests();
  const completions = getCompletions();
  const completed: string[] = [];
  for (const q of quests) {
    if (q.trigger === trigger && !completions[q.id]) {
      completeQuest(q.id);
      completed.push(q.id);
    }
  }
  return completed;
}

export function getDailyXpEarned(): number {
  const quests = getDailyQuests();
  const completions = getCompletions();
  return quests.filter(q => completions[q.id]).reduce((sum, q) => sum + q.xp, 0);
}
