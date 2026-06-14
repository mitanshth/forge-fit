const EXERCISE_IMAGE_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const EXERCISE_DATA_SOURCE = "https://github.com/yuhonas/free-exercise-db";

function forgeFitSlug(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function forgeFitImage(path, label, frame = 0) {
  return {
    src: `${EXERCISE_IMAGE_BASE}${path}/${frame}.jpg`,
    credit: label,
    url: EXERCISE_DATA_SOURCE
  };
}

const forgeFitExactImages = {
  "incline push-up": ["Incline_Push-Up", "Incline Push-Up"],
  "incline push-up medium": ["Incline_Push-Up_Medium", "Incline Push-Up Medium"],
  "incline push-up wide": ["Incline_Push-Up_Wide", "Incline Push-Up Wide"],
  "decline push-up": ["Decline_Push-Up", "Decline Push-Up"],
  "push up to side plank": ["Push_Up_to_Side_Plank", "Push Up to Side Plank"],
  "superman": ["Superman", "Superman"],
  "inverted row": ["Inverted_Row", "Inverted Row"],
  "hyperextensions (back extensions)": ["Hyperextensions_Back_Extensions", "Hyperextensions"],
  "band pull apart": ["Band_Pull_Apart", "Band Pull Apart"],
  "face pull": ["Face_Pull", "Face Pull"],
  "bodyweight squat": ["Bodyweight_Squat", "Bodyweight Squat"],
  "box squat": ["Box_Squat", "Box Squat"],
  "bodyweight walking lunge": ["Bodyweight_Walking_Lunge", "Bodyweight Walking Lunge"],
  "split squats": ["Split_Squats", "Split Squats"],
  "single leg glute bridge": ["Single_Leg_Glute_Bridge", "Single Leg Glute Bridge"],
  "handstand push-ups": ["Handstand_Push-Ups", "Handstand Push-Ups"],
  "arm circles": ["Arm_Circles", "Arm Circles"],
  "bear crawl sled drags": ["Bear_Crawl_Sled_Drags", "Bear Crawl"],
  "back flyes - with bands": ["Back_Flyes_-_With_Bands", "Band Back Fly"],
  "incline push-up close-grip": ["Incline_Push-Up_Close-Grip", "Close-Grip Push-Up"],
  "bench dips": ["Bench_Dips", "Bench Dips"],
  "standing biceps cable curl": ["Standing_Biceps_Cable_Curl", "Standing Cable Curl"],
  "preacher curl": ["Preacher_Curl", "Preacher Curl"],
  "triceps pushdown": ["Triceps_Pushdown", "Triceps Pushdown"],
  "dead bug": ["Dead_Bug", "Dead Bug"],
  "plank": ["Plank", "Plank"],
  "cable reverse crunch": ["Cable_Reverse_Crunch", "Reverse Crunch"],
  "sit-up": ["Sit-Up", "Sit-Up"],
  "mountain climbers": ["Mountain_Climbers", "Mountain Climbers"],
  "alternate leg diagonal bound": ["Alternate_Leg_Diagonal_Bound", "Skater Bound"],
  "step-up with knee raise": ["Step-up_with_Knee_Raise", "Step-up"],
  "walking, treadmill": ["Walking_Treadmill", "Treadmill Walk"],
  "power stairs": ["Power_Stairs", "Power Stairs"],
  "world's greatest stretch": ["Worlds_Greatest_Stretch", "World's Greatest Stretch"],
  "kneeling hip flexor": ["Kneeling_Hip_Flexor", "Kneeling Hip Flexor"],
  "chair upper body stretch": ["Chair_Upper_Body_Stretch", "Upper Body Stretch"],
  "90/90 hamstring": ["90_90_Hamstring", "90/90 Hamstring"],
  "cat stretch": ["Cat_Stretch", "Cat Stretch"],
  "dumbbell floor press": ["Dumbbell_Floor_Press", "Dumbbell Floor Press"],
  "incline dumbbell press": ["Incline_Dumbbell_Press", "Incline Dumbbell Press"],
  "dumbbell flyes": ["Dumbbell_Flyes", "Dumbbell Flyes"],
  "one-arm flat bench dumbbell flye": ["One-Arm_Flat_Bench_Dumbbell_Flye", "One-Arm Dumbbell Flye"],
  "close-grip push-up off of a dumbbell": ["Close-Grip_Push-Up_off_of_a_Dumbbell", "Close-Grip Dumbbell Push-Up"],
  "one-arm dumbbell row": ["One-Arm_Dumbbell_Row", "One-Arm Dumbbell Row"],
  "straight-arm dumbbell pullover": ["Straight-Arm_Dumbbell_Pullover", "Dumbbell Pullover"],
  "dumbbell lying rear lateral raise": ["Dumbbell_Lying_Rear_Lateral_Raise", "Rear Delt Raise"],
  "alternating renegade row": ["Alternating_Renegade_Row", "Renegade Row"],
  "goblet squat": ["Goblet_Squat", "Goblet Squat"],
  "romanian deadlift": ["Romanian_Deadlift", "Romanian Deadlift"],
  "dumbbell lunges": ["Dumbbell_Lunges", "Dumbbell Lunges"],
  "rocking standing calf raise": ["Rocking_Standing_Calf_Raise", "Calf Raise"],
  "dumbbell shoulder press": ["Dumbbell_Shoulder_Press", "Dumbbell Shoulder Press"],
  "arnold dumbbell press": ["Arnold_Dumbbell_Press", "Arnold Dumbbell Press"],
  "dumbbell one-arm shoulder press": ["Dumbbell_One-Arm_Shoulder_Press", "One-Arm Shoulder Press"],
  "alternating deltoid raise": ["Alternating_Deltoid_Raise", "Deltoid Raise"],
  "hammer curls": ["Hammer_Curls", "Hammer Curls"],
  "dumbbell one-arm triceps extension": ["Dumbbell_One-Arm_Triceps_Extension", "Triceps Extension"],
  "zottman preacher curl": ["Zottman_Preacher_Curl", "Zottman Curl"],
  "tricep dumbbell kickback": ["Tricep_Dumbbell_Kickback", "Triceps Kickback"],
  "farmers walk": ["Farmers_Walk", "Farmer's Walk"],
  "russian twist": ["Russian_Twist", "Russian Twist"],
  "weighted sit-ups - with bands": ["Weighted_Sit-Ups_-_With_Bands", "Weighted Sit-Up"],
  "one-arm kettlebell swings": ["One-Arm_Kettlebell_Swings", "Kettlebell Swing"],
  "kettlebell thruster": ["Kettlebell_Thruster", "Kettlebell Thruster"],
  "calf stretch hands against wall": ["Calf_Stretch_Hands_Against_Wall", "Calf Stretch"],
  "barbell bench press - medium grip": ["Barbell_Bench_Press_-_Medium_Grip", "Bench Press"],
  "flat bench cable flyes": ["Flat_Bench_Cable_Flyes", "Cable Fly"],
  "leverage chest press": ["Leverage_Chest_Press", "Chest Press"],
  "cable chest press": ["Cable_Chest_Press", "Cable Chest Press"],
  "wide-grip lat pulldown": ["Wide-Grip_Lat_Pulldown", "Lat Pulldown"],
  "seated cable rows": ["Seated_Cable_Rows", "Seated Cable Row"],
  "band assisted pull-up": ["Band_Assisted_Pull-Up", "Band Assisted Pull-Up"],
  "elevated cable rows": ["Elevated_Cable_Rows", "Elevated Cable Row"],
  "leg press": ["Leg_Press", "Leg Press"],
  "lying leg curls": ["Lying_Leg_Curls", "Lying Leg Curl"],
  "smith machine calf raise": ["Smith_Machine_Calf_Raise", "Calf Raise"],
  "cable seated lateral raise": ["Cable_Seated_Lateral_Raise", "Cable Lateral Raise"],
  "leverage shoulder press": ["Leverage_Shoulder_Press", "Machine Shoulder Press"],
  "upright cable row": ["Upright_Cable_Row", "Upright Cable Row"],
  "triceps pushdown - rope attachment": ["Triceps_Pushdown_-_Rope_Attachment", "Rope Pressdown"],
  "dips - triceps version": ["Dips_-_Triceps_Version", "Triceps Dips"],
  "cable crunch": ["Cable_Crunch", "Cable Crunch"],
  "hanging leg raise": ["Hanging_Leg_Raise", "Hanging Leg Raise"],
  "pallof press": ["Pallof_Press", "Pallof Press"],
  "rowing, stationary": ["Rowing_Stationary", "Row Erg"],
  "recumbent bike": ["Recumbent_Bike", "Bike"],
  "sled push": ["Sled_Push", "Sled Push"],
  "stairmaster": ["Stairmaster", "Stairmaster"],
  "ankle circles": ["Ankle_Circles", "Ankle Circles"],
  "hamstring stretch": ["Hamstring_Stretch", "Hamstring Stretch"],
  "bench press - with bands": ["Bench_Press_-_With_Bands", "Band Bench Press"],
  "cross over - with bands": ["Cross_Over_-_With_Bands", "Band Cross Over"],
  "reverse band bench press": ["Reverse_Band_Bench_Press", "Reverse Band Bench Press"],
  "standing cable chest press": ["Standing_Cable_Chest_Press", "Standing Cable Chest Press"],
  "rack pull with bands": ["Rack_Pull_with_Bands", "Band Rack Pull"],
  "box squat with bands": ["Box_Squat_with_Bands", "Band Box Squat"],
  "squat with bands": ["Squat_with_Bands", "Squat with Bands"],
  "squats - with bands": ["Squats_-_With_Bands", "Squats with Bands"],
  "band good morning": ["Band_Good_Morning", "Band Good Morning"],
  "band good morning (pull through)": ["Band_Good_Morning_Pull_Through", "Band Good Morning Pull Through"],
  "deadlift with bands": ["Deadlift_with_Bands", "Band Deadlift"],
  "band hip adductions": ["Band_Hip_Adductions", "Band Hip Walk"],
  "hip extension with bands": ["Hip_Extension_with_Bands", "Band Hip Extension"],
  "hip flexion with band": ["Hip_Flexion_with_Band", "Band Hip Flexion"],
  "it band and glute stretch": ["IT_Band_and_Glute_Stretch", "IT Band and Glute Stretch"],
  "calf raises - with bands": ["Calf_Raises_-_With_Bands", "Band Calf Raise"],
  "shoulder press - with bands": ["Shoulder_Press_-_With_Bands", "Band Shoulder Press"],
  "lateral raise - with bands": ["Lateral_Raise_-_With_Bands", "Band Lateral Raise"],
  "external rotation with band": ["External_Rotation_with_Band", "Band External Rotation"],
  "internal rotation with band": ["Internal_Rotation_with_Band", "Band Internal Rotation"],
  "upright row - with bands": ["Upright_Row_-_With_Bands", "Band Upright Row"],
  "close-grip ez-bar curl with band": ["Close-Grip_EZ-Bar_Curl_with_Band", "Band Curl"],
  "band skull crusher": ["Band_Skull_Crusher", "Band Skull Crusher"],
  "speed band overhead triceps": ["Speed_Band_Overhead_Triceps", "Band Overhead Triceps"],
  "reverse cable curl": ["Reverse_Cable_Curl", "Reverse Curl"],
  "standing cable wood chop": ["Standing_Cable_Wood_Chop", "Wood Chop"],
  "pallof press with rotation": ["Pallof_Press_With_Rotation", "Pallof Rotation"],
  "standing lateral stretch": ["Standing_Lateral_Stretch", "Standing Lateral Stretch"]
};

const forgeFitExerciseImages = [
  [/incline push/i, "Incline_Push-Up", "Incline push-up", 0],
  [/wide push/i, "Incline_Push-Up_Wide", "Wide push-up", 1],
  [/decline push/i, "Decline_Push-Up", "Decline push-up", 0],
  [/close-grip push|diamond push/i, "Incline_Push-Up_Close-Grip", "Close-grip push-up", 1],
  [/push-up hold|tempo push|push-ups$|push up/i, "Push_Up_to_Side_Plank", "Push-up body line", 0],
  [/dumbbell floor press|close-grip floor press/i, "Dumbbell_Floor_Press", "Dumbbell floor press", 0],
  [/squeeze press|chest press machine/i, "Leverage_Chest_Press", "Chest press", 1],
  [/incline dumbbell press/i, "Incline_Dumbbell_Press", "Incline dumbbell press", 0],
  [/dumbbell fly/i, "Dumbbell_Flyes", "Dumbbell fly", 1],
  [/cable fly|band fly/i, "Flat_Bench_Cable_Flyes", "Cable fly", 0],
  [/bench press/i, "Barbell_Bench_Press_-_Medium_Grip", "Bench press", 0],
  [/band chest press|single-arm band press|close-grip band press/i, "Bench_Press_-_With_Bands", "Band chest press", 1],

  [/table row|towel row|band row/i, "Inverted_Row", "Inverted row", 0],
  [/one-arm row|single-arm band row/i, "One-Arm_Dumbbell_Row", "One-arm row", 0],
  [/chest-supported row|seated row|cable row/i, "Seated_Cable_Rows", "Seated row", 1],
  [/dumbbell pullover|pullover breathing/i, "Straight-Arm_Dumbbell_Pullover", "Dumbbell pullover", 0],
  [/rear delt row|rear delt fly|rear delt raises/i, "Dumbbell_Lying_Rear_Lateral_Raise", "Rear delt raise", 1],
  [/renegade row|band plank row/i, "Alternating_Renegade_Row", "Renegade row", 0],
  [/lat pulldown|band lat pulldown/i, "Wide-Grip_Lat_Pulldown", "Lat pulldown", 0],
  [/assisted pull|pull-apart|face pull|band rear delt pull/i, "Band_Pull_Apart", "Upper-back pull", 1],
  [/prone swimmer|reverse snow angel|superman/i, "Superman", "Superman back extension", 0],

  [/box squat/i, "Box_Squat", "Box squat", 0],
  [/goblet squat/i, "Goblet_Squat", "Goblet squat", 0],
  [/band squat|bodyweight squat|deep squat|squat to press/i, "Bodyweight_Squat", "Bodyweight squat", 1],
  [/leg press/i, "Leg_Press", "Leg press", 0],
  [/romanian deadlift|trap-bar deadlift/i, "Romanian_Deadlift", "Romanian deadlift", 0],
  [/good morning/i, "Good_Morning", "Good morning hinge", 1],
  [/walking lunge|dumbbell lunges|reverse lunges|reverse lunge/i, "Dumbbell_Lunges", "Lunge", 0],
  [/split squat|band split squat/i, "Split_Squats", "Split squat", 0],
  [/step-up|fast step-ups|dumbbell step-up/i, "Step-up_with_Knee_Raise", "Step-up", 1],
  [/glute bridge|band glute bridge/i, "Single_Leg_Glute_Bridge", "Glute bridge", 0],
  [/leg curl/i, "Lying_Leg_Curls", "Leg curl", 1],
  [/calf raise|calf stretch/i, "Rocking_Standing_Calf_Raise", "Calf raise", 0],
  [/wall sit/i, "Bodyweight_Squat", "Wall-sit leg position", 0],
  [/lateral band walks/i, "Band_Hip_Adductions", "Band hip walk", 1],

  [/wall handstand|handstand/i, "Handstand_Push-Ups", "Handstand hold", 0],
  [/pike push/i, "Handstand_Push-Ups", "Pike push-up pattern", 1],
  [/plank shoulder taps/i, "Push_Up_to_Side_Plank", "Shoulder tap plank", 1],
  [/half-kneeling press|dumbbell press/i, "Dumbbell_One-Arm_Shoulder_Press", "Dumbbell shoulder press", 0],
  [/arnold press/i, "Arnold_Dumbbell_Press", "Arnold press", 1],
  [/machine shoulder press|shoulder press|band overhead press/i, "Shoulder_Press_-_With_Bands", "Shoulder press", 0],
  [/lateral raise|band lateral raise|cable lateral raises/i, "Lateral_Raise_-_With_Bands", "Lateral raise", 1],
  [/front raise|band front raise/i, "Alternating_Deltoid_Raise", "Front raise", 0],
  [/upright row/i, "Upright_Cable_Row", "Upright row", 1],
  [/arm circles/i, "Arm_Circles", "Arm circles", 0],
  [/bear crawl/i, "Bear_Crawl_Sled_Drags", "Bear crawl hold", 0],
  [/band y raise/i, "Back_Flyes_-_With_Bands", "Band Y raise", 1],

  [/hammer curls|hammer band curls/i, "Hammer_Curls", "Hammer curl", 0],
  [/zottman/i, "Zottman_Preacher_Curl", "Zottman curl", 1],
  [/towel curls|band curls|cable curls|isometric curl|reverse curls/i, "Standing_Biceps_Cable_Curl", "Curl posture", 0],
  [/preacher curls/i, "Preacher_Curl", "Preacher curl", 1],
  [/overhead triceps extension|overhead band extension/i, "Dumbbell_One-Arm_Triceps_Extension", "Overhead triceps extension", 0],
  [/rope pressdown|band triceps pressdown/i, "Triceps_Pushdown_-_Rope_Attachment", "Rope pressdown", 1],
  [/kickbacks/i, "Tricep_Dumbbell_Kickback", "Triceps kickback", 0],
  [/bench dips|triceps dips/i, "Bench_Dips", "Bench dip", 0],

  [/dead bugs|weighted dead bugs|band dead bugs/i, "Dead_Bug", "Dead bug", 0],
  [/side plank/i, "Push_Up_to_Side_Plank", "Side plank", 1],
  [/hollow hold/i, "Jackknife_Sit-Up", "Hollow-body brace", 0],
  [/reverse crunch/i, "Cable_Reverse_Crunch", "Reverse crunch", 1],
  [/plank reaches|weighted plank/i, "Plank", "Plank", 0],
  [/suitcase carry|farmer carry|farmer/i, "Farmers_Walk", "Loaded carry", 0],
  [/russian twist/i, "Russian_Twist", "Russian twist", 0],
  [/plank pull-through/i, "Alternating_Renegade_Row", "Plank pull-through", 1],
  [/weighted sit-ups|sit-ups/i, "Sit-Up", "Sit-up", 0],
  [/cable crunch/i, "Cable_Crunch", "Cable crunch", 0],
  [/hanging knee/i, "Hanging_Leg_Raise", "Hanging knee raise", 1],
  [/pallof|anti-rotation/i, "Pallof_Press", "Pallof press", 0],
  [/wood chop/i, "Standing_Cable_Wood_Chop", "Wood chop", 1],
  [/back extension/i, "Hyperextensions_Back_Extensions", "Back extension", 0],

  [/high knees|march/i, "Walking_Treadmill", "Marching mechanics", 0],
  [/mountain climbers/i, "Mountain_Climbers", "Mountain climbers", 0],
  [/skater/i, "Alternate_Leg_Diagonal_Bound", "Skater bound", 1],
  [/squat thrust/i, "Mountain_Climbers", "Squat thrust", 1],
  [/dumbbell swings/i, "One-Arm_Kettlebell_Swings", "Swing hinge", 0],
  [/low-impact thruster|band thrusters|thruster/i, "Kettlebell_Thruster", "Thruster", 1],
  [/lateral shuffle/i, "Alternate_Leg_Diagonal_Bound", "Lateral shuffle", 0],
  [/incline treadmill/i, "Walking_Treadmill", "Incline treadmill", 1],
  [/row erg/i, "Rowing_Stationary", "Row erg", 0],
  [/bike intervals/i, "Recumbent_Bike", "Bike intervals", 1],
  [/sled push/i, "Sled_Push", "Sled push", 0],
  [/stair climber/i, "Stairmaster", "Stair climber", 1],
  [/fast band rows/i, "Band_Pull_Apart", "Fast band row", 0],

  [/world's greatest stretch/i, "Worlds_Greatest_Stretch", "World's greatest stretch", 0],
  [/hip flexor|couch stretch/i, "Kneeling_Hip_Flexor", "Hip flexor stretch", 0],
  [/thoracic|open-book/i, "Chair_Upper_Body_Stretch", "Thoracic rotation", 0],
  [/90\/90/i, "90_90_Hamstring", "90/90 mobility", 0],
  [/band shoulder opener/i, "Band_Pull_Apart", "Band shoulder opener", 1],
  [/ankle rocks/i, "Ankle_Circles", "Ankle mobility", 0],
  [/hamstring floss/i, "Hamstring_Stretch", "Hamstring stretch", 1],
  [/lat stretch/i, "Standing_Lateral_Stretch", "Lat stretch", 0],
  [/cat cow/i, "Cat_Stretch", "Cat cow mobility", 0]
];

const forgeFitFallbackImages = {
  Chest: ["Incline_Push-Up", "Dumbbell_Floor_Press", "Barbell_Bench_Press_-_Medium_Grip"],
  Back: ["Inverted_Row", "Wide-Grip_Lat_Pulldown", "Superman"],
  Legs: ["Bodyweight_Squat", "Dumbbell_Lunges", "Romanian_Deadlift"],
  Shoulders: ["Dumbbell_Shoulder_Press", "Lateral_Raise_-_With_Bands", "Arm_Circles"],
  Arms: ["Hammer_Curls", "Bench_Dips", "Triceps_Pushdown_-_Rope_Attachment"],
  Core: ["Dead_Bug", "Plank", "Russian_Twist"],
  Conditioning: ["Mountain_Climbers", "Rowing_Stationary", "Stairmaster"],
  Mobility: ["Kneeling_Hip_Flexor", "Hamstring_Stretch", "Ankle_Circles"]
};

function forgeFitExerciseMedia(move) {
  const exact = forgeFitExactImages[String(move.name || "").toLowerCase()];
  if (exact) return forgeFitImage(exact[0], exact[1], forgeFitSlug(move.name).length % 2);

  const match = forgeFitExerciseImages.find(([pattern]) => pattern.test(move.name));
  if (match) return forgeFitImage(match[1], match[2], match[3]);

  const fallbacks = forgeFitFallbackImages[move.part] || forgeFitFallbackImages.Core;
  const index = forgeFitSlug(move.name).length % fallbacks.length;
  return forgeFitImage(fallbacks[index], `${move.name} posture reference`, index % 2);
}

function forgeFitExerciseMediaSet(move) {
  const first = forgeFitExerciseMedia(move);
  const isBodyweight = /bodyweight/i.test(move.equipment || "");
  const isBand = /band/i.test(`${move.equipment || ""} ${move.name || ""}`);
  const showTwoViews = isBodyweight || isBand;

  if (!showTwoViews) return [first];

  const path = first.src
    .replace(EXERCISE_IMAGE_BASE, "")
    .replace(/\/[01]\.jpg$/, "");
  return [
    { ...first, src: `${EXERCISE_IMAGE_BASE}${path}/0.jpg`, credit: `${first.credit} - view 1` },
    { ...first, src: `${EXERCISE_IMAGE_BASE}${path}/1.jpg`, credit: `${first.credit} - view 2` }
  ];
}

function forgeFitPostureMedia(move) {
  const mediaSet = forgeFitExerciseMediaSet(move);
  const mode = mediaSet.length > 1 ? "posture-photo-wrap multi-view" : "posture-photo-wrap";
  return `
    <figure class="${mode}">
      <div class="posture-photo-grid">
        ${mediaSet.map((media, index) => `
          <img class="posture-photo" src="${media.src}" alt="${move.name} posture reference view ${index + 1}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.posture-photo-wrap').classList.add('image-failed'); this.remove();" />
        `).join("")}
      </div>
      <figcaption>
        <span>${mediaSet.length > 1 ? `${move.name} - two posture views` : mediaSet[0].credit}</span>
        <a href="${mediaSet[0].url}" target="_blank" rel="noopener noreferrer">Free Exercise DB</a>
      </figcaption>
    </figure>
  `;
}

function exerciseVisual(move) {
  const focus = focusMuscles(move.part);
  const cues = postureCues[move.part] || postureCues.Core;
  return `
    <div class="exercise-visual" aria-label="Posture guide for ${move.name}">
      ${forgeFitPostureMedia(move)}
      <div class="focus-row">${focus.map((item) => `<span>${item}</span>`).join("")}</div>
      <ul>${cues.map((cue) => `<li>${cue}</li>`).join("")}</ul>
    </div>
  `;
}

if (typeof renderAll === "function") {
  renderAll();
}
