const STORAGE_KEY = "forgefit-ai-state-v2";
const OLD_STORAGE_KEY = "forgefit-ai-state-v1";
const VAULT_DB = "forgefit-data-vault";
const VAULT_STORE = "snapshots";
const VAULT_STATE_KEY = "latest-state";

const defaultState = {
  onboarded: false,
  user: {
    name: "",
    email: "",
    photo: ""
  },
  profile: {
    age: 25,
    gender: "male",
    height: 170,
    goals: ["fat-loss"],
    experience: "beginner",
    daysPerWeek: 4,
    sessionLength: 45,
    equipment: ["bodyweight"],
    diet: "balanced",
    foodCulture: "indian",
    activityLevel: "moderate",
    currentWeight: 75,
    targetWeight: 70,
    injuries: "",
    avoidFoods: "",
    notificationTime: "07:00",
    motivationStyle: "direct"
  },
  logs: [],
  planSeed: 1,
  notifications: false
};

const exerciseLibrary = {
  bodyweight: {
    chest: ["Incline Push-Up", "Incline Push-Up Medium", "Incline Push-Up Wide", "Decline Push-Up", "Push Up to Side Plank"],
    back: ["Superman", "Inverted Row", "Hyperextensions (Back Extensions)", "Band Pull Apart", "Face Pull"],
    legs: ["Bodyweight Squat", "Box Squat", "Bodyweight Walking Lunge", "Split Squats", "Single Leg Glute Bridge"],
    shoulders: ["Handstand Push-Ups", "Push Up to Side Plank", "Arm Circles", "Bear Crawl Sled Drags", "Back Flyes - With Bands"],
    arms: ["Incline Push-Up Close-Grip", "Bench Dips", "Standing Biceps Cable Curl", "Preacher Curl", "Triceps Pushdown"],
    core: ["Dead Bug", "Plank", "Push Up to Side Plank", "Cable Reverse Crunch", "Sit-Up"],
    conditioning: ["Mountain Climbers", "Alternate Leg Diagonal Bound", "Step-up with Knee Raise", "Walking, Treadmill", "Power Stairs"],
    mobility: ["World's Greatest Stretch", "Kneeling Hip Flexor", "Chair Upper Body Stretch", "90/90 Hamstring", "Cat Stretch"]
  },
  dumbbells: {
    chest: ["Dumbbell Floor Press", "Incline Dumbbell Press", "Dumbbell Flyes", "One-Arm Flat Bench Dumbbell Flye", "Close-Grip Push-Up off of a Dumbbell"],
    back: ["One-Arm Dumbbell Row", "Straight-Arm Dumbbell Pullover", "Dumbbell Lying Rear Lateral Raise", "Alternating Renegade Row", "Inverted Row"],
    legs: ["Goblet Squat", "Romanian Deadlift", "Dumbbell Lunges", "Step-up with Knee Raise", "Rocking Standing Calf Raise"],
    shoulders: ["Dumbbell Shoulder Press", "Arnold Dumbbell Press", "Dumbbell One-Arm Shoulder Press", "Dumbbell Lying Rear Lateral Raise", "Alternating Deltoid Raise"],
    arms: ["Hammer Curls", "Dumbbell One-Arm Triceps Extension", "Zottman Preacher Curl", "Dumbbell Floor Press", "Tricep Dumbbell Kickback"],
    core: ["Farmers Walk", "Dead Bug", "Russian Twist", "Alternating Renegade Row", "Weighted Sit-Ups - With Bands"],
    conditioning: ["One-Arm Kettlebell Swings", "Farmers Walk", "Dumbbell Lunges", "Step-up with Knee Raise", "Kettlebell Thruster"],
    mobility: ["Calf Stretch Hands Against Wall", "90/90 Hamstring", "Straight-Arm Dumbbell Pullover", "Chair Upper Body Stretch"]
  },
  gym: {
    chest: ["Barbell Bench Press - Medium Grip", "Incline Dumbbell Press", "Flat Bench Cable Flyes", "Leverage Chest Press", "Cable Chest Press"],
    back: ["Wide-Grip Lat Pulldown", "Seated Cable Rows", "Band Assisted Pull-Up", "Elevated Cable Rows", "Face Pull"],
    legs: ["Leg Press", "Romanian Deadlift", "Lying Leg Curls", "Dumbbell Lunges", "Smith Machine Calf Raise"],
    shoulders: ["Dumbbell Shoulder Press", "Cable Seated Lateral Raise", "Dumbbell Lying Rear Lateral Raise", "Leverage Shoulder Press", "Upright Cable Row"],
    arms: ["Standing Biceps Cable Curl", "Triceps Pushdown - Rope Attachment", "Preacher Curl", "Dips - Triceps Version", "Hammer Curls"],
    core: ["Cable Crunch", "Hanging Leg Raise", "Pallof Press", "Hyperextensions (Back Extensions)", "Plank"],
    conditioning: ["Walking, Treadmill", "Rowing, Stationary", "Recumbent Bike", "Sled Push", "Stairmaster"],
    mobility: ["Kneeling Hip Flexor", "Band Pull Apart", "Ankle Circles", "Hamstring Stretch"]
  },
  bands: {
    chest: ["Bench Press - With Bands", "Cross Over - With Bands", "Reverse Band Bench Press", "Back Flyes - With Bands", "Band Pull Apart"],
    back: ["Band Assisted Pull-Up", "Band Pull Apart", "Back Flyes - With Bands", "Upright Row - With Bands", "Rack Pull with Bands"],
    legs: ["Squat with Bands", "Box Squat with Bands", "Band Good Morning", "Deadlift with Bands", "Band Hip Adductions"],
    shoulders: ["Shoulder Press - With Bands", "Lateral Raise - With Bands", "External Rotation with Band", "Internal Rotation with Band", "Upright Row - With Bands"],
    arms: ["Close-Grip EZ-Bar Curl with Band", "Band Skull Crusher", "Speed Band Overhead Triceps", "Reverse Cable Curl", "Band Pull Apart"],
    core: ["Weighted Sit-Ups - With Bands", "Pallof Press", "Pallof Press With Rotation", "Band Pull Apart", "Standing Cable Wood Chop"],
    conditioning: ["Squats - With Bands", "Band Good Morning (Pull Through)", "Hip Extension with Bands", "Calf Raises - With Bands", "Band Pull Apart"],
    mobility: ["Band Pull Apart", "External Rotation with Band", "IT Band and Glute Stretch", "Hip Flexion with Band", "Cat Stretch"]
  }
};

const splitTemplates = {
  2: ["Upper Body", "Lower Body"],
  3: ["Chest + Triceps", "Back + Biceps", "Legs + Core"],
  4: ["Chest + Triceps", "Back + Biceps", "Legs", "Shoulders + Core"],
  5: ["Chest", "Back", "Legs", "Shoulders", "Arms + Core"],
  6: ["Chest + Triceps", "Back + Biceps", "Legs", "Shoulders", "Core + Conditioning", "Mobility + Recovery"]
};

const splitParts = {
  "Upper Body": ["chest", "back", "shoulders", "arms"],
  "Lower Body": ["legs", "core"],
  "Chest + Triceps": ["chest", "arms"],
  "Back + Biceps": ["back", "arms"],
  "Legs + Core": ["legs", "core"],
  Legs: ["legs"],
  "Shoulders + Core": ["shoulders", "core"],
  Chest: ["chest"],
  Back: ["back"],
  Shoulders: ["shoulders"],
  "Arms + Core": ["arms", "core"],
  "Core + Conditioning": ["core", "conditioning"],
  "Mobility + Recovery": ["mobility", "core"]
};

const cultureRecipes = {
  indian: [
    ["Paneer or tofu tikka plate", "Paneer or tofu, capsicum, onion, mint chutney, salad", "Indian-style high-protein dinner that can fit fat loss or muscle gain."],
    ["Dal rice training bowl", "Dal, rice, curd or soy curd, cucumber, pickle", "Simple recovery meal with carbs, protein, and familiar flavors."],
    ["Chana spinach roti wrap", "Chickpeas, spinach, roti, onion, lemon, spices", "Fiber-rich vegetarian meal for discipline and fullness."]
  ],
  mediterranean: [
    ["Greek protein bowl", "Chicken or falafel, hummus, cucumber, tomato, rice, yogurt sauce", "Balanced bowl with protein, fiber, and healthy fats."],
    ["Tuna or chickpea salad pita", "Tuna or chickpeas, pita, olives, greens, lemon", "Quick meal with steady energy and easy prep."],
    ["Lentil feta plate", "Lentils, feta or tofu, roasted vegetables, olive oil", "Good for recovery without feeling heavy."]
  ],
  "east-asian": [
    ["Teriyaki tofu rice bowl", "Tofu or chicken, rice, broccoli, sesame, light teriyaki", "Training-friendly carbs with lean protein."],
    ["Egg fried rice upgrade", "Egg or tofu, rice, peas, carrot, spring onion", "Easy high-protein version of a comfort meal."],
    ["Miso noodle soup", "Noodles, tofu, mushrooms, greens, miso broth", "Warm, filling, and easy to adjust for calories."]
  ],
  mexican: [
    ["Burrito power bowl", "Beans, rice, chicken or tofu, salsa, lettuce, avocado", "Strong meal prep option with flexible calories."],
    ["Egg taco breakfast", "Eggs or tofu, corn tortillas, salsa, peppers", "Fast breakfast with protein and flavor."],
    ["Black bean fajita plate", "Black beans, peppers, onion, rice, lime", "Budget-friendly and high in fiber."]
  ],
  "middle-eastern": [
    ["Shawarma protein plate", "Chicken or tofu, rice, cucumber, tahini, salad", "High-protein plate with satisfying spices."],
    ["Mujadara recovery bowl", "Lentils, rice, onion, yogurt or tahini, salad", "Good plant-protein meal for consistent weeks."],
    ["Falafel salad box", "Falafel, hummus, greens, tomato, pita", "Portable meal with fiber and carbs."]
  ],
  western: [
    ["Chicken potato plate", "Chicken, potato, green beans, yogurt sauce", "Simple lean protein and carbs for training."],
    ["Turkey or tofu burger bowl", "Turkey or tofu patty, rice, lettuce, tomato, pickles", "Burger flavor without losing structure."],
    ["Protein oats", "Oats, milk or soy milk, protein powder, berries", "Easy breakfast for busy mornings."]
  ]
};

const easyMealBank = {
  indian: {
    breakfast: ["Paneer bhurji toast", "Moong dal chilla", "Greek curd fruit bowl", "Tofu bhurji roti"],
    lunch: ["Dal rice bowl", "Chana roti plate", "Chicken tikka rice bowl", "Rajma quinoa bowl"],
    snack: ["Roasted chana", "Protein lassi", "Sprouts chaat", "Peanut banana curd"],
    dinner: ["Paneer tikka salad", "Egg curry bowl", "Soy chunk pulao", "Fish curry plate"]
  },
  mediterranean: {
    breakfast: ["Greek yogurt oats", "Egg pita pocket", "Hummus toast", "Tofu scramble pita"],
    lunch: ["Chicken hummus bowl", "Falafel rice bowl", "Tuna chickpea salad", "Lentil feta plate"],
    snack: ["Cottage cheese fruit", "Hummus veggie sticks", "Protein yogurt", "Roasted chickpeas"],
    dinner: ["Shawarma salad plate", "Turkey rice bowl", "Lentil soup bowl", "Tofu kebab plate"]
  },
  "east-asian": {
    breakfast: ["Egg fried rice cup", "Tofu rice bowl", "Soy milk oats", "Miso egg soup"],
    lunch: ["Teriyaki tofu bowl", "Chicken broccoli rice", "Soba protein bowl", "Edamame rice plate"],
    snack: ["Edamame cup", "Soy yogurt", "Tuna rice cakes", "Tofu cubes"],
    dinner: ["Miso noodle soup", "Stir-fry tofu rice", "Chicken lettuce bowl", "Mushroom tofu bowl"]
  },
  mexican: {
    breakfast: ["Egg taco plate", "Bean breakfast bowl", "Tofu salsa scramble", "Greek yogurt berries"],
    lunch: ["Burrito power bowl", "Black bean rice bowl", "Chicken fajita plate", "Tofu taco bowl"],
    snack: ["Bean dip cups", "Protein yogurt", "Roasted corn chaat", "Cottage cheese salsa"],
    dinner: ["Fajita salad plate", "Turkey taco rice", "Bean quinoa bowl", "Tofu lettuce tacos"]
  },
  "middle-eastern": {
    breakfast: ["Labneh toast", "Egg shakshuka bowl", "Hummus pita plate", "Tofu shakshuka"],
    lunch: ["Shawarma rice plate", "Falafel hummus bowl", "Mujadara bowl", "Chicken tabbouleh plate"],
    snack: ["Hummus carrots", "Roasted chickpeas", "Yogurt cucumber bowl", "Tahini protein toast"],
    dinner: ["Kebab salad bowl", "Lentil rice plate", "Tofu shawarma wrap", "Chickpea stew"]
  },
  western: {
    breakfast: ["Protein oats", "Egg avocado toast", "Cottage cheese bowl", "Tofu scramble toast"],
    lunch: ["Chicken potato plate", "Turkey burger bowl", "Tuna pasta salad", "Tofu quinoa bowl"],
    snack: ["Protein shake", "Greek yogurt berries", "Boiled eggs", "Peanut apple slices"],
    dinner: ["Chicken rice dinner", "Salmon potato plate", "Bean chili bowl", "Tofu veggie skillet"]
  }
};

const postureCues = {
  Chest: ["Straight body line", "Wrists under shoulders", "Lower with control"],
  Back: ["Tall chest", "Pull elbows back", "Do not shrug"],
  Legs: ["Knees track toes", "Brace core", "Full foot on floor"],
  Shoulders: ["Ribs down", "Press smoothly", "Neck relaxed"],
  Arms: ["Elbows steady", "Control the lowering", "Wrists neutral"],
  Core: ["Brace belly", "Keep hips level", "Breathe slowly"],
  Conditioning: ["Soft knees", "Land quietly", "Steady rhythm"],
  Mobility: ["Move slowly", "No sharp pain", "Long exhales"]
};

let state = loadState();
let activeWorkoutOffset = 0;
let notificationTimer = null;
let installPromptEvent = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const legacy = localStorage.getItem(OLD_STORAGE_KEY);
  const raw = saved || legacy;
  if (!raw) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(raw);
    const profile = { ...structuredClone(defaultState.profile), ...(parsed.profile || {}) };
    if (!Array.isArray(profile.goals)) profile.goals = [profile.goal || "fat-loss"];
    if (!Array.isArray(profile.equipment)) profile.equipment = [profile.equipment || "bodyweight"];
    delete profile.goal;
    return {
      ...structuredClone(defaultState),
      ...parsed,
      user: { ...structuredClone(defaultState.user), ...(parsed.user || {}) },
      profile
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveStateToVault(state);
}

function normalizeState(rawState) {
  const parsed = rawState || {};
  const profile = { ...structuredClone(defaultState.profile), ...(parsed.profile || {}) };
  if (!Array.isArray(profile.goals)) profile.goals = [profile.goal || "fat-loss"];
  if (!Array.isArray(profile.equipment)) profile.equipment = [profile.equipment || "bodyweight"];
  delete profile.goal;
  return {
    ...structuredClone(defaultState),
    ...parsed,
    user: { ...structuredClone(defaultState.user), ...(parsed.user || {}) },
    profile,
    logs: Array.isArray(parsed.logs) ? parsed.logs : []
  };
}

function openVault() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB is not available"));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VAULT_DB, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(VAULT_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveStateToVault(snapshot) {
  try {
    const db = await openVault();
    const tx = db.transaction(VAULT_STORE, "readwrite");
    tx.objectStore(VAULT_STORE).put({
      savedAt: new Date().toISOString(),
      state: snapshot
    }, VAULT_STATE_KEY);
    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  } catch {
    // localStorage still keeps the app usable when IndexedDB is unavailable.
  }
}

async function loadStateFromVault() {
  const db = await openVault();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE, "readonly");
    const request = tx.objectStore(VAULT_STORE).get(VAULT_STATE_KEY);
    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function restoreVaultIfNeeded() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  try {
    const backup = await loadStateFromVault();
    if (!backup?.state) return;
    state = normalizeState(backup.state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderAll();
    showToast("Progress restored from local data vault.");
  } catch {
    // No vault backup to restore.
  }
}

function updateVaultStatus(message) {
  const status = $("#vaultStatus");
  if (status) status.textContent = message;
}

function downloadDataBackup() {
  const payload = {
    app: "ForgeFit",
    version: 2,
    exportedAt: new Date().toISOString(),
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `forgefit-backup-${todayKey()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  updateVaultStatus(`Backup downloaded ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`);
  showToast("Backup file downloaded.");
}

function restoreDataBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = normalizeState(parsed.state || parsed);
      saveState();
      renderAll();
      updateVaultStatus("Backup restored successfully.");
      showToast("Backup restored. Your progress is back.");
    } catch {
      updateVaultStatus("Restore failed. Choose a valid ForgeFit backup file.");
      showToast("Could not restore that backup file.");
    }
  };
  reader.readAsText(file);
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function titleCase(value = "") {
  return value.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

function listLabels(values = []) {
  return values.map(titleCase).join(", ");
}

function primaryGoal() {
  return state.profile.goals?.[0] || "fat-loss";
}

function selectedCheckboxValues(name) {
  const values = $$(`input[name="${name}"]:checked`).map((input) => input.value);
  return values.length ? values : name.toLowerCase().includes("equipment") ? ["bodyweight"] : ["fat-loss"];
}

function setCheckboxValues(name, values = []) {
  $$(`input[name="${name}"]`).forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

function initials(name) {
  return (name || "ForgeFit").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function readPhoto(fileInput) {
  const file = fileInput.files?.[0];
  if (!file) return Promise.resolve(state.user.photo || "");
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function getTodayLog() {
  return state.logs.find((log) => log.date === todayKey());
}

function getRecentLogs(days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return state.logs.filter((log) => new Date(log.date) >= cutoff);
}

function getStreak() {
  const dates = new Set(state.logs.filter((log) => log.workoutDone).map((log) => log.date));
  let streak = 0;
  const cursor = new Date();
  while (dates.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function hasJointLimit() {
  return /knee|back|shoulder|ankle|pain|injur|limit/i.test(state.profile.injuries || "");
}

function bmr() {
  const { gender, currentWeight, height, age } = state.profile;
  const base = 10 * Number(currentWeight) + 6.25 * Number(height) - 5 * Number(age);
  if (gender === "female") return base - 161;
  if (gender === "male") return base + 5;
  return base - 78;
}

function nutritionTargets() {
  const activity = { low: 1.35, moderate: 1.55, high: 1.75 }[state.profile.activityLevel] || 1.55;
  const goals = state.profile.goals || ["fat-loss"];
  const goalAdjust = goals.includes("fat-loss") ? -400 : goals.includes("muscle") ? 300 : goals.includes("strength") ? 180 : goals.includes("endurance") ? 140 : 0;
  const calories = Math.round((bmr() * activity + goalAdjust) / 25) * 25;
  const proteinMultiplier = goals.includes("muscle") || goals.includes("strength") ? 2 : 1.65;
  const protein = Math.round(Number(state.profile.currentWeight) * proteinMultiplier);
  const fats = Math.round(Number(state.profile.currentWeight) * (state.profile.diet === "low-carb" ? 1 : 0.75));
  const carbCalories = Math.max(350, calories - protein * 4 - fats * 9);
  const carbs = state.profile.diet === "low-carb" ? "80-130g" : `${Math.round(carbCalories / 4)}g`;
  return { calories, protein, fats, carbs };
}

function mealProteinSplit(totalProtein) {
  return {
    breakfast: Math.round(totalProtein * 0.25),
    lunch: Math.round(totalProtein * 0.35),
    snack: Math.round(totalProtein * 0.15),
    dinner: Math.round(totalProtein * 0.25)
  };
}

function adaptDishName(dish) {
  let adjusted = dish;
  if (state.profile.diet === "vegan") {
    adjusted = adjusted
      .replace("Chicken", "Tofu")
      .replace("Turkey", "Tofu")
      .replace("Tuna", "Chickpea")
      .replace("Fish", "Tofu")
      .replace("Salmon", "Tofu")
      .replace("Egg", "Tofu")
      .replace("Greek curd", "Soy curd")
      .replace("Greek yogurt", "Soy yogurt")
      .replace("Cottage cheese", "Tofu");
  }
  if (state.profile.diet === "vegetarian") {
    adjusted = adjusted
      .replace("Chicken", "Paneer")
      .replace("Turkey", "Paneer")
      .replace("Tuna", "Chickpea")
      .replace("Fish", "Paneer")
      .replace("Salmon", "Paneer");
  }
  if (state.profile.diet === "low-carb") {
    adjusted = adjusted
      .replace("rice", "salad")
      .replace("Rice", "Salad")
      .replace("pasta", "zoodles")
      .replace("Pasta", "Zoodles")
      .replace("roti", "low-carb roti")
      .replace("Roti", "Low-carb roti");
  }
  return adjusted;
}

function buildMealPlan() {
  const targets = nutritionTargets();
  const split = mealProteinSplit(targets.protein);
  const culture = easyMealBank[state.profile.foodCulture] || easyMealBank.indian;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const meals = ["breakfast", "lunch", "snack", "dinner"];
  return days.map((day, dayIndex) => ({
    day,
    totalProtein: targets.protein,
    meals: meals.map((meal, mealIndex) => {
      const dishes = culture[meal];
      const dish = adaptDishName(dishes[(dayIndex + mealIndex + state.planSeed) % dishes.length]);
      return {
        meal: titleCase(meal),
        dish,
        protein: split[meal],
        type: meal,
        prep: meal === "snack" ? "5 min" : meal === "breakfast" ? "10-15 min" : "20 min"
      };
    })
  }));
}

function focusMuscles(part) {
  const map = {
    Chest: ["Chest", "Triceps", "Front shoulders"],
    Back: ["Lats", "Upper back", "Biceps"],
    Legs: ["Quads", "Glutes", "Hamstrings"],
    Shoulders: ["Shoulders", "Upper back", "Core"],
    Arms: ["Biceps", "Triceps", "Forearms"],
    Core: ["Abs", "Obliques", "Lower back"],
    Conditioning: ["Heart", "Legs", "Core"],
    Mobility: ["Hips", "Spine", "Shoulders"]
  };
  return map[part] || ["Full body", "Core", "Control"];
}

function movementPattern(move) {
  const name = move.name.toLowerCase();
  if (/push|press|fly|chest/.test(name) && !/overhead|shoulder|leg|pallof/.test(name)) return "Push-up / Chest Press";
  if (/row|pulldown|pull-up|pull.apart|face pull|swimmer|snow angel|superman/.test(name)) return "Row / Back Pull";
  if (/squat|leg press|wall sit/.test(name)) return "Squat";
  if (/lunge|split|step-up/.test(name)) return "Lunge / Step-up";
  if (/deadlift|good morning|glute bridge|hip/.test(name)) return "Hip Hinge / Glutes";
  if (/shoulder|overhead|arnold|lateral|front raise|pike|handstand|y raise/.test(name)) return "Overhead / Shoulder";
  if (/curl|triceps|dip|kickback|extension/.test(name)) return "Arms";
  if (/plank|dead bug|crunch|twist|sit-up|hollow|pallof|wood chop|carry/.test(name)) return "Core Brace";
  if (/stretch|mobility|rotation|90\/90|cat cow|opener|floss|hold/.test(name)) return "Mobility";
  if (/knee|climber|skater|thrust|bike|row erg|treadmill|sled|stair|shuffle|march|swing/.test(name)) return "Cardio";
  return move.part;
}

function postureSvg(move, accent) {
  const pattern = movementPattern(move);
  const commonDefs = `
    <defs>
      <marker id="arrow-${pattern.replaceAll(" ", "-").replaceAll("/", "")}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="${accent}"></path>
      </marker>
    </defs>
  `;
  const arrow = `url(#arrow-${pattern.replaceAll(" ", "-").replaceAll("/", "")})`;
  const poses = {
    "Push-up / Chest Press": `
      <text x="24" y="28" class="pose-title">Push-up posture</text>
      <line x1="46" y1="142" x2="218" y2="112" class="guide-line"></line>
      <circle cx="218" cy="106" r="14" class="body-dark"></circle>
      <path d="M204 112 L148 122 L88 132" class="body-line thick"></path>
      <path d="M158 121 L132 158" class="body-line"></path>
      <path d="M146 123 L126 86" class="body-line"></path>
      <path d="M89 132 L58 162" class="body-line"></path>
      <path d="M86 132 L48 104" class="body-line"></path>
      <ellipse cx="156" cy="122" rx="22" ry="14" fill="${accent}" opacity="0.92"></ellipse>
      <path d="M152 88 C136 98 132 112 134 130" class="action-arrow" marker-end="${arrow}"></path>
      <text x="30" y="194" class="pose-note">Straight line: head, hips, heels</text>
    `,
    "Row / Back Pull": `
      <text x="24" y="28" class="pose-title">Row posture</text>
      <circle cx="74" cy="70" r="14" class="body-dark"></circle>
      <path d="M88 80 L134 104 L176 126" class="body-line thick"></path>
      <path d="M124 100 L100 148" class="body-line"></path>
      <path d="M142 108 L126 158" class="body-line"></path>
      <path d="M126 100 L174 76" class="body-line"></path>
      <path d="M136 108 L190 94" class="body-line"></path>
      <path d="M106 82 C124 74 150 80 170 98" fill="${accent}" opacity="0.9"></path>
      <path d="M205 96 C184 96 170 94 150 86" class="action-arrow" marker-end="${arrow}"></path>
      <text x="28" y="194" class="pose-note">Pull elbows back, chest stays proud</text>
    `,
    Squat: `
      <text x="24" y="28" class="pose-title">Squat posture</text>
      <circle cx="128" cy="54" r="14" class="body-dark"></circle>
      <path d="M128 70 L134 112" class="body-line thick"></path>
      <path d="M134 112 L98 150 L56 150" class="body-line"></path>
      <path d="M134 112 L174 150 L216 150" class="body-line"></path>
      <path d="M118 84 L82 106" class="body-line"></path>
      <path d="M138 84 L174 106" class="body-line"></path>
      <path d="M96 142 L56 150" stroke="${accent}" stroke-width="18" stroke-linecap="round"></path>
      <path d="M172 142 L216 150" stroke="${accent}" stroke-width="18" stroke-linecap="round"></path>
      <line x1="98" y1="40" x2="98" y2="160" class="guide-line"></line>
      <path d="M62 118 C82 138 104 148 130 150" class="action-arrow" marker-end="${arrow}"></path>
      <text x="32" y="194" class="pose-note">Knees track toes, heels stay planted</text>
    `,
    "Lunge / Step-up": `
      <text x="24" y="28" class="pose-title">Lunge / step-up posture</text>
      <circle cx="118" cy="52" r="14" class="body-dark"></circle>
      <path d="M118 68 L128 116" class="body-line thick"></path>
      <path d="M128 116 L92 152 L52 152" class="body-line"></path>
      <path d="M128 116 L170 154 L220 154" class="body-line"></path>
      <path d="M112 82 L78 106" class="body-line"></path>
      <path d="M132 84 L166 106" class="body-line"></path>
      <circle cx="94" cy="150" r="14" fill="${accent}" opacity="0.9"></circle>
      <circle cx="170" cy="154" r="14" fill="${accent}" opacity="0.9"></circle>
      <line x1="92" y1="84" x2="92" y2="164" class="guide-line"></line>
      <text x="32" y="194" class="pose-note">Front knee stays over toes, torso tall</text>
    `,
    "Hip Hinge / Glutes": `
      <text x="24" y="28" class="pose-title">Hip hinge / bridge posture</text>
      <circle cx="74" cy="78" r="14" class="body-dark"></circle>
      <path d="M88 86 L140 112 L204 116" class="body-line thick"></path>
      <path d="M138 112 L112 158" class="body-line"></path>
      <path d="M158 114 L184 160" class="body-line"></path>
      <path d="M124 104 L152 88" class="body-line"></path>
      <ellipse cx="152" cy="112" rx="28" ry="18" fill="${accent}" opacity="0.9"></ellipse>
      <path d="M174 92 C152 100 138 116 128 140" class="action-arrow" marker-end="${arrow}"></path>
      <text x="30" y="194" class="pose-note">Hips move back, back stays flat</text>
    `,
    "Overhead / Shoulder": `
      <text x="24" y="28" class="pose-title">Overhead press</text>
      <circle cx="132" cy="58" r="14" class="body-dark"></circle>
      <path d="M132 74 L132 132" class="body-line thick"></path>
      <path d="M132 88 L92 46" class="body-line"></path>
      <path d="M132 88 L172 46" class="body-line"></path>
      <path d="M132 132 L104 176" class="body-line"></path>
      <path d="M132 132 L160 176" class="body-line"></path>
      <circle cx="108" cy="70" r="16" fill="${accent}" opacity="0.95"></circle>
      <circle cx="156" cy="70" r="16" fill="${accent}" opacity="0.95"></circle>
      <path d="M92 92 C94 70 96 58 104 42" class="action-arrow" marker-end="${arrow}"></path>
      <path d="M172 92 C170 70 168 58 160 42" class="action-arrow" marker-end="${arrow}"></path>
      <text x="36" y="194" class="pose-note">Ribs down, press straight overhead</text>
    `,
    Arms: `
      <text x="24" y="28" class="pose-title">Curl / triceps control</text>
      <circle cx="132" cy="54" r="14" class="body-dark"></circle>
      <path d="M132 70 L132 134" class="body-line thick"></path>
      <path d="M126 84 L92 118 L96 150" class="body-line"></path>
      <path d="M138 84 L172 118 L168 150" class="body-line"></path>
      <path d="M92 118 L96 150" stroke="${accent}" stroke-width="16" stroke-linecap="round"></path>
      <path d="M172 118 L168 150" stroke="${accent}" stroke-width="16" stroke-linecap="round"></path>
      <path d="M80 154 C76 132 84 114 102 102" class="action-arrow" marker-end="${arrow}"></path>
      <text x="38" y="194" class="pose-note">Elbows stay fixed, move with control</text>
    `,
    "Core Brace": `
      <text x="24" y="28" class="pose-title">Plank posture</text>
      <line x1="52" y1="122" x2="218" y2="96" class="guide-line"></line>
      <circle cx="218" cy="90" r="13" class="body-dark"></circle>
      <path d="M206 96 L146 108 L84 120" class="body-line thick"></path>
      <path d="M150 108 L126 146" class="body-line"></path>
      <path d="M86 120 L50 150" class="body-line"></path>
      <rect x="126" y="98" width="46" height="24" rx="10" fill="${accent}" opacity="0.95" transform="rotate(-10 149 110)"></rect>
      <path d="M134 78 C126 96 126 116 134 136" class="action-arrow" marker-end="${arrow}"></path>
      <text x="28" y="194" class="pose-note">Brace abs, hips level, neck neutral</text>
    `,
    Cardio: `
      <text x="24" y="28" class="pose-title">Athletic cardio stance</text>
      <circle cx="112" cy="48" r="13" class="body-dark"></circle>
      <path d="M112 64 L130 112" class="body-line thick"></path>
      <path d="M124 78 L82 94" class="body-line"></path>
      <path d="M128 80 L174 58" class="body-line"></path>
      <path d="M130 112 L92 160" class="body-line"></path>
      <path d="M132 112 L184 150" class="body-line"></path>
      <path d="M66 170 C104 188 158 188 206 164" class="action-arrow" marker-end="${arrow}"></path>
      <circle cx="132" cy="112" r="22" fill="${accent}" opacity="0.8"></circle>
      <text x="32" y="194" class="pose-note">Soft knees, quick feet, steady breathing</text>
    `,
    Mobility: `
      <text x="24" y="28" class="pose-title">Mobility stretch</text>
      <circle cx="92" cy="62" r="13" class="body-dark"></circle>
      <path d="M102 72 C128 92 150 116 174 146" class="body-line thick"></path>
      <path d="M126 96 L82 146 L48 146" class="body-line"></path>
      <path d="M148 120 L198 150 L230 150" class="body-line"></path>
      <path d="M112 84 L72 104" class="body-line"></path>
      <path d="M134 102 L178 78" class="body-line"></path>
      <path d="M76 132 C104 104 140 92 178 78" class="action-arrow" marker-end="${arrow}"></path>
      <ellipse cx="148" cy="118" rx="38" ry="18" fill="${accent}" opacity="0.55"></ellipse>
      <text x="34" y="194" class="pose-note">Move slow, breathe, stop before pain</text>
    `
  };

  return `
    <svg class="pose-svg" viewBox="0 0 264 220" role="img" aria-label="${part} posture picture">
      ${commonDefs}
      <rect x="0" y="0" width="264" height="220" rx="14" fill="#f8faf8"></rect>
      <rect x="18" y="168" width="228" height="12" rx="6" fill="#d8e2dd"></rect>
      ${poses[pattern] || poses["Core Brace"]}
    </svg>
  `;
}

function exerciseVisual(move) {
  const focus = focusMuscles(move.part);
  const cues = postureCues[move.part] || postureCues.Core;
  const accent = move.part === "Legs" ? "#f2c14e" : move.part === "Back" ? "#0d7c72" : move.part === "Core" ? "#6f63ff" : "#ff5a3d";
  return `
    <div class="exercise-visual" aria-label="Posture guide for ${move.name}">
      ${postureSvg(move, accent)}
      <div class="focus-row">${focus.map((item) => `<span>${item}</span>`).join("")}</div>
      <ul>${cues.map((cue) => `<li>${cue}</li>`).join("")}</ul>
    </div>
  `;
}

function mealPicture(meal) {
  const photo = foodPhotoFor(meal.dish, meal.type);
  return `
    <div class="meal-picture" aria-label="${meal.dish} meal picture">
      <img src="${photo}" alt="${meal.dish}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.meal-picture').classList.add('image-failed'); this.remove();" />
    </div>
  `;
}

function foodPhotoFor(name = "", type = "meal") {
  const dish = name.toLowerCase();
  const matches = [
    [/paneer|tikka|shawarma|kebab|chicken|fish|salmon/, "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80"],
    [/dal|rajma|curry|chana|chickpea|mujadara|lentil|stew/, "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80"],
    [/rice|fried rice|teriyaki|soba|miso|noodle|tofu/, "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80"],
    [/taco|burrito|fajita|salsa|bean|mexican/, "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80"],
    [/hummus|falafel|pita|labneh|tahini/, "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80"],
    [/oat|yogurt|curd|lassi|fruit|berries|shake/, "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80"],
    [/toast|egg|scramble|breakfast|chilla|bhurji/, "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80"],
    [/burger|potato|pasta|quinoa|bowl|salad|wrap/, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"],
    [/sprout|roasted|peanut|apple|snack|edamame|corn/, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"],
    [/soup/, "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80"]
  ];
  const found = matches.find(([pattern]) => pattern.test(dish));
  if (found) return found[1];
  const fallback = {
    breakfast: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    snack: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    dinner: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80"
  };
  return fallback[type] || fallback.lunch;
}

function recipePhoto(name) {
  return foodPhotoFor(name, "lunch");
}

function calculateMetrics() {
  const recent = getRecentLogs(7);
  const weeklyDone = recent.filter((log) => log.workoutDone).length;
  const targets = nutritionTargets();
  const proteinAvg = recent.length ? recent.reduce((sum, log) => sum + Number(log.protein || 0), 0) / recent.length : 0;
  const checkinCount = recent.filter((log) => log.sleep || log.water || log.soreness || log.steps).length;
  const discipline = clamp(Math.round((weeklyDone / Number(state.profile.daysPerWeek)) * 55 + (proteinAvg / targets.protein) * 25 + (checkinCount / 7) * 20), 0, 100);
  const start = Number(state.logs.find((log) => log.weight)?.weight || state.profile.currentWeight);
  const latest = Number([...state.logs].reverse().find((log) => log.weight)?.weight || state.profile.currentWeight);
  const target = Number(state.profile.targetWeight);
  const totalNeeded = Math.abs(start - target) || 1;
  const goalProgress = clamp(Math.round((Math.abs(start - latest) / totalNeeded) * 100), 0, 100);
  const today = getTodayLog() || {};
  const avgEffort = recent.length ? recent.reduce((sum, log) => sum + Number(log.effort || 7), 0) / recent.length : 7;
  const sleep = Number(today.sleep || 7);
  const soreness = Number(today.soreness || 4);
  const readiness = clamp(Math.round(86 + (sleep - 7) * 4 - Math.max(0, soreness - 5) * 6 - Math.max(0, avgEffort - 8) * 5 + Math.min(getStreak(), 5) * 2), 35, 96);
  return { weeklyDone, discipline, goalProgress, readiness, targets };
}

function buildWorkoutPlan() {
  const { daysPerWeek, sessionLength, experience } = state.profile;
  const goals = state.profile.goals || ["fat-loss"];
  const equipmentList = state.profile.equipment || ["bodyweight"];
  const limited = hasJointLimit();
  const intensity = experience === "advanced" ? "5 rounds" : experience === "intermediate" ? "4 rounds" : "3 rounds";
  const reps = goals.includes("strength") ? "5-8 reps" : goals.includes("endurance") ? "45 sec" : "8-12 reps";
  const split = splitTemplates[Number(daysPerWeek)] || splitTemplates[4];

  return Array.from({ length: Number(daysPerWeek) }, (_, index) => {
    const theme = split[index];
    const parts = splitParts[theme] || ["chest", "back", "legs"];
    const moves = [];
    parts.forEach((part, partIndex) => {
      const equipmentKey = equipmentList[(index + partIndex + state.planSeed) % equipmentList.length] || "bodyweight";
      const pool = exerciseLibrary[equipmentKey] || exerciseLibrary.bodyweight;
      const source = pool[part] || pool.conditioning;
      const moveCount = parts.length > 2 ? 2 : part === "mobility" ? 4 : 3;
      Array.from({ length: moveCount }, (_, moveIndex) => {
        let name = source[(moveIndex + index + partIndex + state.planSeed) % source.length];
        if (limited) {
          name = name
            .replace("Decline Push-Up", "Incline Push-Up")
            .replace("Dumbbell Lunges", "Step-up with Knee Raise")
            .replace("Bodyweight Walking Lunge", "Step-up with Knee Raise")
            .replace("Alternate Leg Diagonal Bound", "Walking, Treadmill")
            .replace("Power Stairs", "Walking, Treadmill");
        }
        const dose = part === "mobility" ? "60 sec" : part === "conditioning" ? (limited ? "30 sec steady / 30 sec easy" : "35 sec on / 25 sec off") : reps;
        moves.push({ name, dose, part: titleCase(part), equipment: titleCase(equipmentKey) });
      });
    });
    const trimmedMoves = moves.slice(0, theme.includes("Mobility") ? 4 : 6);
    trimmedMoves.forEach((move) => {
      if (limited) {
        move.name = move.name.replace("Bodyweight Squat", "Box Squat");
      }
    });
    return {
      day: `Day ${index + 1}`,
      title: theme,
      duration: `${sessionLength} min`,
      intensity: limited ? `${intensity}, joint-friendly` : intensity,
      focus: goals.join(", "),
      bodyParts: parts.map(titleCase).join(", "),
      moves: trimmedMoves,
      finisher: theme.includes("Mobility") ? "5 minutes nasal breathing" : limited ? "8 minute incline walk" : goals.includes("fat-loss") ? "8 minute calorie finisher" : "6 minute controlled finisher"
    };
  });
}

function getMotivation() {
  const streak = getStreak();
  const name = state.user.name ? state.user.name.split(" ")[0] : "you";
  const style = state.profile.motivationStyle;
  if (style === "calm") return streak > 1 ? `${name}, clear today's gate with clean form and calm focus.` : "Gate detected. Ten honest minutes starts the rank-up.";
  if (style === "competitive") return streak > 1 ? `${name}, protect the streak. Hunters do not skip daily quests.` : "Quest issued. One rep is enough to break the inertia.";
  return streak > 1 ? `${name}, your streak is active. Clear one more quest today.` : "Daily quest available. Train today and make discipline visible.";
}

function questNotificationMessage() {
  const targets = nutritionTargets();
  const plan = buildWorkoutPlan();
  const workout = plan[activeWorkoutOffset % plan.length];
  const messages = [
    `System alert: ${workout.title}. Clear the gate and protect your streak.`,
    `Rank-up condition: train today, log protein, and hit ${targets.protein}g protein.`,
    `Gate opened: ${workout.bodyParts}. Warm up, enter, and finish the quest.`,
    `Discipline check: one focused session today beats a perfect plan tomorrow.`
  ];
  return messages[(new Date().getDate() + state.planSeed) % messages.length];
}

function renderProfile() {
  const photo = $("#profilePhoto");
  photo.textContent = initials(state.user.name);
  photo.style.backgroundImage = state.user.photo ? `url("${state.user.photo}")` : "";
  photo.classList.toggle("has-image", Boolean(state.user.photo));
  $("#profileCaption").textContent = state.user.name ? `${state.user.name} - ${listLabels(state.profile.goals)}` : "AI discipline coach";
}

function renderDashboard() {
  const metrics = calculateMetrics();
  const plan = buildWorkoutPlan();
  const todayWorkout = plan[activeWorkoutOffset % plan.length];
  const now = new Date();
  const today = getTodayLog();

  $("#todayLabel").textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  $("#dailyHeadline").textContent = getMotivation();
  $("#coachMessage").textContent = `${listLabels(state.profile.goals)} plan for ${state.user.name || "you"}`;
  $("#coachDetail").textContent = `${state.profile.age} yrs, ${state.profile.height} cm, ${state.profile.currentWeight} kg now, ${state.profile.targetWeight} kg target. Uses ${listLabels(state.profile.equipment)}, ${state.profile.daysPerWeek} days/week, ${titleCase(state.profile.foodCulture)} ${titleCase(state.profile.diet)} diet.`;
  $("#weeklyWorkouts").textContent = `${metrics.weeklyDone} / ${state.profile.daysPerWeek}`;
  $("#weeklyMeter").max = state.profile.daysPerWeek;
  $("#weeklyMeter").value = metrics.weeklyDone;
  $("#disciplineScore").textContent = `${metrics.discipline}%`;
  $("#disciplineMeter").value = metrics.discipline;
  $("#goalProgress").textContent = `${metrics.goalProgress}%`;
  $("#goalMeter").value = metrics.goalProgress;
  $("#proteinTarget").textContent = `${metrics.targets.protein}g`;
  $("#proteinMeter").max = Math.max(200, metrics.targets.protein);
  $("#proteinMeter").value = metrics.targets.protein;
  $("#readinessScore").textContent = metrics.readiness;
  $(".score-ring").style.background = `conic-gradient(var(--accent-3) ${metrics.readiness}%, rgba(255,255,255,0.28) 0)`;
  $("#readinessText").textContent = metrics.readiness > 80 ? "Push intensity today." : metrics.readiness > 62 ? "Balanced intensity today." : "Recovery-aware plan today.";
  $("#checkinStatus").textContent = today?.sleep || today?.water || today?.soreness ? "Logged today" : "Not logged";

  const streak = getStreak();
  $("#streakDays").textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  $("#streakHint").textContent = streak ? "Momentum compounds quietly." : "Log today to start momentum.";

  renderWorkoutBlock($("#todayWorkout"), todayWorkout);
  renderCoachNotes(metrics);
}

function renderWorkoutBlock(container, workout) {
  container.innerHTML = `
    <div>
      <p class="eyebrow">${workout.day}</p>
      <h3>${workout.title}</h3>
      <div class="workout-meta">
        <span class="tag">${workout.duration}</span>
        <span class="tag">${workout.intensity}</span>
        <span class="tag">${workout.bodyParts}</span>
      </div>
    </div>
    <ul class="exercise-list">
      ${workout.moves.map((move) => `
        <li>
          <strong>${move.name}</strong><br><span>${move.part} - ${move.equipment} - ${move.dose}</span>
          ${exerciseVisual(move)}
        </li>
      `).join("")}
      <li><strong>Finisher</strong><br><span>${workout.finisher}</span></li>
    </ul>
  `;
}

function renderCoachNotes(metrics) {
  const injuryNote = hasJointLimit() ? `I adjusted impact because you listed: ${state.profile.injuries}.` : "No movement limits listed, so the plan can progress normally.";
  const notes = [
    metrics.weeklyDone >= state.profile.daysPerWeek ? "Training target hit. Use extra energy for mobility or walking." : `${state.profile.daysPerWeek - metrics.weeklyDone} workout(s) left this week.`,
    metrics.discipline >= 75 ? "Consistency is strong. Add a little load, reps, or control next week." : "The next action is small: open the plan, do the warm-up, then decide.",
    `Nutrition target: ${metrics.targets.calories} kcal and ${metrics.targets.protein}g protein today.`,
    injuryNote
  ];
  $("#coachNotes").innerHTML = notes.map((note) => `<li>${note}</li>`).join("");
}

function renderPlan() {
  $("#weeklyPlan").innerHTML = buildWorkoutPlan().map((workout) => `
    <article class="plan-card">
      <div>
        <p class="eyebrow">${workout.day}</p>
        <h3>${workout.title}</h3>
      </div>
      <div class="workout-meta">
        <span class="tag">${workout.duration}</span>
        <span class="tag">${workout.intensity}</span>
        <span class="tag">${workout.bodyParts}</span>
      </div>
      <ul class="exercise-list">
        ${workout.moves.map((move) => `
          <li>
            <strong>${move.name}</strong><br><span>${move.part} - ${move.equipment} - ${move.dose}</span>
            ${exerciseVisual(move)}
          </li>
        `).join("")}
      </ul>
    </article>
  `).join("");
}

function renderNutrition() {
  const targets = nutritionTargets();
  $("#nutritionTargets").innerHTML = [
    ["Calories", `${targets.calories} kcal`],
    ["Protein", `${targets.protein}g`],
    ["Carbs", targets.carbs],
    ["Fats", `${targets.fats}g`]
  ].map(([label, value]) => `<div class="target-box"><span class="label">${label}</span><strong>${value}</strong></div>`).join("");

  const avoid = state.profile.avoidFoods?.trim();
  const goals = state.profile.goals || ["fat-loss"];
  const tips = [
    `Food culture: ${titleCase(state.profile.foodCulture)}. Targets use ${state.profile.currentWeight} kg, ${state.profile.height} cm, ${state.profile.age} yrs, and ${titleCase(state.profile.activityLevel)} activity.`,
    goals.includes("fat-loss") ? "Keep the deficit moderate so discipline survives the week." : "Add calories slowly if strength, energy, or weight is not moving.",
    avoid ? `Avoid or swap these foods: ${avoid}.` : "No avoided foods listed. Add allergies or dislikes in profile for cleaner recipes.",
    `For ${listLabels(goals)}, keep protein first, vegetables or fiber second, then place carbs around training.`
  ];
  $("#nutritionTips").innerHTML = tips.map((tip) => `<li>${tip}</li>`).join("");

  const avoidWords = (avoid || "").toLowerCase().split(",").map((item) => item.trim()).filter(Boolean);
  const recipes = (cultureRecipes[state.profile.foodCulture] || cultureRecipes.indian).map((recipe) => {
    const ingredients = recipe[1].split(", ");
    const filtered = ingredients.map((item) => {
      let adjusted = item;
      if (state.profile.diet === "vegan") adjusted = adjusted.replace("Chicken", "Tofu").replace("chicken", "tofu").replace("Eggs", "Tofu").replace("egg", "tofu").replace("yogurt", "soy yogurt").replace("curd", "soy curd").replace("feta", "tofu");
      if (state.profile.diet === "vegetarian") adjusted = adjusted.replace("Chicken", "Paneer or tofu").replace("chicken", "paneer or tofu").replace("Tuna", "Chickpeas").replace("tuna", "chickpeas");
      if (state.profile.diet === "low-carb") adjusted = adjusted.replace("rice", "cauliflower rice").replace("Rice", "Cauliflower rice").replace("pita", "lettuce cups").replace("roti", "low-carb roti");
      return avoidWords.some((avoidItem) => adjusted.toLowerCase().includes(avoidItem)) ? `Swap ${adjusted}` : adjusted;
    });
    return [recipe[0], filtered.join(", "), recipe[2]];
  });

  $("#recipeGrid").innerHTML = recipes.map(([name, ingredients, why]) => `
    <article class="recipe-card">
      <img class="recipe-photo" src="${recipePhoto(name)}" alt="${name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.classList.add('image-failed'); this.remove();" />
      <div>
        <p class="eyebrow">${titleCase(state.profile.foodCulture)} - ${titleCase(state.profile.diet)}</p>
        <h3>${name}</h3>
      </div>
      <p>${why}</p>
      <ul>${ingredients.split(", ").map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  `).join("");

  $("#mealPlanTarget").textContent = `${targets.protein}g protein/day`;
  $("#mealPlanGrid").innerHTML = buildMealPlan().map((day) => `
    <article class="meal-day">
      <div class="meal-day-head">
        <strong>${day.day}</strong>
        <span>${day.totalProtein}g target</span>
      </div>
      <div class="meal-list">
        ${day.meals.map((meal) => `
          <div class="meal-item">
            ${mealPicture(meal)}
            <span class="label">${meal.meal}</span>
            <strong>${meal.dish}</strong>
            <small>${meal.protein}g protein - ${meal.prep}</small>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderLogs() {
  const logs = [...state.logs].reverse().slice(0, 8);
  $("#logList").innerHTML = logs.length
    ? logs.map((log) => `
      <div class="log-item">
        <strong>${new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</strong>
        <span>${log.workoutDone ? "Workout logged" : "Check-in"} - ${log.effort || 7}/10 effort - ${log.protein || 0}g protein - ${log.sleep || 0}h sleep - ${log.water || 0}L water</span>
      </div>
    `).join("")
    : `<div class="log-item">No logs yet. Save today and the chart wakes up.</div>`;
  drawWeightChart();
}

function drawWeightChart() {
  const canvas = $("#weightChart");
  const ctx = canvas.getContext("2d");
  const logs = state.logs.filter((log) => log.weight).slice(-12);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fbfcfa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#dbe2d6";
  ctx.lineWidth = 1;
  for (let y = 40; y < canvas.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(canvas.width - 24, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#69746a";
  ctx.font = "16px system-ui";
  if (logs.length < 2) {
    ctx.fillText("Add at least two weight logs to see a trend.", 42, 140);
    return;
  }
  const weights = logs.map((log) => Number(log.weight));
  const min = Math.min(...weights) - 1;
  const max = Math.max(...weights) + 1;
  const xStep = (canvas.width - 80) / (logs.length - 1);
  const yFor = (weight) => canvas.height - 40 - ((weight - min) / (max - min)) * (canvas.height - 80);
  ctx.strokeStyle = "#146b63";
  ctx.lineWidth = 4;
  ctx.beginPath();
  logs.forEach((log, index) => {
    const x = 40 + xStep * index;
    const y = yFor(Number(log.weight));
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  logs.forEach((log, index) => {
    const x = 40 + xStep * index;
    const y = yFor(Number(log.weight));
    ctx.fillStyle = "#e75f3f";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#17201a";
    ctx.fillText(`${log.weight}kg`, x - 18, y - 12);
  });
}

function renderSettings() {
  Object.entries({ ...state.user, ...state.profile }).forEach(([key, value]) => {
    const field = $(`#${key}`);
    if (field && field.type !== "file") field.value = value;
  });
  setCheckboxValues("goals", state.profile.goals || ["fat-loss"]);
  setCheckboxValues("setupGoals", state.profile.goals || ["fat-loss"]);
  setCheckboxValues("equipment", state.profile.equipment || ["bodyweight"]);
  setCheckboxValues("setupEquipment", state.profile.equipment || ["bodyweight"]);
}

function renderOnboarding() {
  $("#onboarding").classList.toggle("hidden", Boolean(state.onboarded));
}

function renderAll() {
  renderOnboarding();
  renderProfile();
  renderDashboard();
  renderPlan();
  renderNutrition();
  renderLogs();
  renderSettings();
  scheduleNotification();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3000);
}

function setupPwaInstall() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      showToast("Offline app setup could not start from this page.");
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPromptEvent = event;
    $("#installButton").hidden = false;
    $("#installTip").hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installPromptEvent = null;
    $("#installButton").hidden = true;
    $("#installTip").hidden = true;
    showToast("ForgeFit installed.");
  });

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isStandalone && isMobile) {
    window.setTimeout(() => {
      if (!installPromptEvent) $("#installTip").hidden = false;
    }, 1800);
  }
}

function saveTodayLog(extra = {}) {
  const date = todayKey();
  const existing = state.logs.find((log) => log.date === date);
  const entry = {
    date,
    workoutDone: Boolean(extra.workoutDone ?? existing?.workoutDone),
    weight: extra.weight ?? existing?.weight ?? "",
    effort: extra.effort ?? existing?.effort ?? 7,
    protein: extra.protein ?? existing?.protein ?? 0,
    mood: extra.mood ?? existing?.mood ?? "Focused",
    sleep: extra.sleep ?? existing?.sleep ?? "",
    water: extra.water ?? existing?.water ?? "",
    soreness: extra.soreness ?? existing?.soreness ?? "",
    steps: extra.steps ?? existing?.steps ?? ""
  };
  if (existing) Object.assign(existing, entry);
  else state.logs.push(entry);
  saveState();
  renderAll();
}

async function enableNotifications() {
  if (!("Notification" in window)) {
    showToast("This browser does not support notifications.");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    state.notifications = true;
    saveState();
    scheduleNotification();
    new Notification("System notifications activated", { body: questNotificationMessage() });
    showToast("Daily quest notifications enabled.");
  } else {
    showToast("Notifications were not enabled.");
  }
}

function scheduleNotification() {
  if (notificationTimer) window.clearTimeout(notificationTimer);
  if (!state.notifications || !("Notification" in window) || Notification.permission !== "granted") return;
  const [hours, minutes] = state.profile.notificationTime.split(":").map(Number);
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= new Date()) target.setDate(target.getDate() + 1);
  notificationTimer = window.setTimeout(() => {
    new Notification("ForgeFit system alert", { body: `${questNotificationMessage()} Log sleep, water, soreness, and weight.` });
    scheduleNotification();
  }, target - new Date());
}

function switchView(viewName) {
  $$(".tab, .mobile-tab").forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  $$(".view").forEach((view) => view.classList.toggle("active-view", view.id === viewName));
}

async function applySetup(prefix) {
  const photoInput = $(`#${prefix}Photo`) || $("#photoInput");
  state.user = {
    name: $(`#${prefix}Name`)?.value || $("#name")?.value || state.user.name,
    email: $(`#${prefix}Email`)?.value || $("#email")?.value || state.user.email,
    photo: await readPhoto(photoInput)
  };
  state.profile = {
    ...state.profile,
    age: Number($(`#${prefix}Age`)?.value || $("#age")?.value || state.profile.age),
    gender: $(`#${prefix}Gender`)?.value || $("#gender")?.value || state.profile.gender,
    height: Number($(`#${prefix}Height`)?.value || $("#height")?.value || state.profile.height),
    goals: selectedCheckboxValues(prefix ? "setupGoals" : "goals"),
    experience: $(`#${prefix}Experience`)?.value || $("#experience")?.value || state.profile.experience,
    daysPerWeek: Number($(`#${prefix}DaysPerWeek`)?.value || $("#daysPerWeek")?.value || state.profile.daysPerWeek),
    sessionLength: Number($("#sessionLength")?.value || state.profile.sessionLength),
    equipment: selectedCheckboxValues(prefix ? "setupEquipment" : "equipment"),
    diet: $(`#${prefix}Diet`)?.value || $("#diet")?.value || state.profile.diet,
    foodCulture: $(`#${prefix}FoodCulture`)?.value || $("#foodCulture")?.value || state.profile.foodCulture,
    activityLevel: $(`#${prefix}ActivityLevel`)?.value || $("#activityLevel")?.value || state.profile.activityLevel,
    currentWeight: Number($(`#${prefix}CurrentWeight`)?.value || $("#currentWeight")?.value || state.profile.currentWeight),
    targetWeight: Number($(`#${prefix}TargetWeight`)?.value || $("#targetWeight")?.value || state.profile.targetWeight),
    injuries: $(`#${prefix}Injuries`)?.value || $("#injuries")?.value || state.profile.injuries,
    avoidFoods: $(`#${prefix}AvoidFoods`)?.value || $("#avoidFoods")?.value || state.profile.avoidFoods,
    notificationTime: $("#notificationTime")?.value || state.profile.notificationTime,
    motivationStyle: $("#motivationStyle")?.value || state.profile.motivationStyle
  };
  state.onboarded = true;
  state.planSeed += 1;
  saveState();
  renderAll();
}

function bindEvents() {
  $$(".tab, .mobile-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  $$("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.jump));
  });

  $("#onboardingForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await applySetup("setup");
    showToast("Profile created. Your plan is personalized now.");
  });

  $("#generatePlanButton").addEventListener("click", () => {
    state.planSeed += 1;
    saveState();
    renderAll();
    showToast("Fresh personalized plan generated.");
  });
  $("#refreshPlanButton").addEventListener("click", () => $("#generatePlanButton").click());
  $("#newRecipeButton").addEventListener("click", () => {
    state.planSeed += 1;
    const recipes = cultureRecipes[state.profile.foodCulture] || cultureRecipes.indian;
    recipes.push(recipes.shift());
    renderNutrition();
    showToast("Recipes rotated.");
  });
  $("#swapWorkoutButton").addEventListener("click", () => {
    activeWorkoutOffset += 1;
    renderDashboard();
  });
  $("#completeWorkoutButton").addEventListener("click", () => {
    saveTodayLog({ workoutDone: true });
    showToast("Workout logged. That counts.");
  });
  $("#notifyButton").addEventListener("click", enableNotifications);
  $("#installButton").addEventListener("click", async () => {
    if (!installPromptEvent) {
      $("#installTip").hidden = false;
      showToast("Use your browser menu to add ForgeFit to your home screen.");
      return;
    }
    installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    installPromptEvent = null;
    $("#installButton").hidden = true;
  });

  $("#settingsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await applySetup("");
    showToast("Profile saved. Diet and exercise plans updated.");
  });

  $("#backupDataButton").addEventListener("click", downloadDataBackup);
  $("#restoreDataButton").addEventListener("click", () => $("#restoreDataInput").click());
  $("#restoreDataInput").addEventListener("change", (event) => {
    restoreDataBackup(event.target.files?.[0]);
    event.target.value = "";
  });

  $("#logEffort").addEventListener("input", () => {
    $("#effortValue").textContent = `${$("#logEffort").value} / 10`;
  });

  $("#progressForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveTodayLog({
      weight: $("#logWeight").value,
      effort: Number($("#logEffort").value),
      protein: Number($("#logProtein").value || 0),
      mood: $("#logMood").value,
      sleep: $("#logSleep").value,
      water: $("#logWater").value
    });
    showToast("Progress saved. Coach adjusted.");
  });

  $("#quickCheckinForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveTodayLog({
      sleep: $("#quickSleep").value,
      water: $("#quickWater").value,
      soreness: $("#quickSoreness").value,
      steps: $("#quickSteps").value
    });
    showToast("Daily details saved. Readiness updated.");
  });
}

bindEvents();
setupPwaInstall();
renderAll();
restoreVaultIfNeeded();
