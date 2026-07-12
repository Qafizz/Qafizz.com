/* ==========================================================================
   TRUST ME BRO — app.js
   Modules: Theme, MockAPI (swap for real backend), Votes, Feed, Detail,
   Comments, Search, Create, Nav, Sidebar, MobileNav
   ========================================================================== */

"use strict";

/* Hand-drawn brush triangle (pointing up) — curved sides, uneven rounded corners */
const BRUSH_TRI =
  "M11.4 3.3 C11.9 2.8 12.8 2.9 13.3 3.7 C15.9 7.8 18.4 12.1 20.8 16.5 " +
  "C21.4 17.7 20.8 18.9 19.5 19.1 C14.7 19.8 9.1 19.8 4.3 19.2 " +
  "C3 19 2.5 17.8 3.1 16.6 C5.6 12.1 8.2 7.7 10.9 3.9 C11 3.7 11.2 3.4 11.4 3.3 Z";

/* ---------- THEME ---------- */
const Theme = (() => {
  const STORAGE_KEY = "tmb-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-checked", String(theme === "dark"));
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const preferred =
      saved ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    apply(preferred);

    toggle.addEventListener("click", () => {
      apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  return { init };
})();

/* ---------- MOCK API ----------
   Replace these functions with real fetch() calls when the backend lands.
   `hoursAgo` powers the sort logic; a real API would return timestamps. */
const MockAPI = (() => {
  const TIERS = ["S", "A", "B", "C", "D"];

  const page1 = [
    {
      id: 1, title: "World Cup 2026: Who's Actually Winning It All",
      category: "World Cup", author: "footyoracle", time: "34m ago", hoursAgo: 0.5,
      votes: 8912, comments: 1204,
      tiers: {
        S: ["France", "Spain"],
        A: ["Argentina", "England"],
        B: ["Brazil", "Portugal"],
        C: ["Germany", "USA"],
        D: ["Everyone else"],
      },
    },
    {
      id: 2, title: "Best Players of WC 2026 So Far",
      category: "World Cup", author: "xgmerchant", time: "1h ago", hoursAgo: 1,
      votes: 7345, comments: 893,
      tiers: {
        S: ["Lamine Yamal", "Mbappé"],
        A: ["Bellingham", "Vinícius Jr"],
        B: ["Musiala", "Valverde"],
        C: ["Kane"],
        D: ["The ref from the quarterfinal"],
      },
    },
    {
      id: 3, title: "Every WC 2026 Kit, Ranked by Drip",
      category: "World Cup", author: "kitcollector", time: "3h ago", hoursAgo: 3,
      votes: 5120, comments: 467,
      tiers: {
        S: ["Nigeria", "Japan"],
        A: ["Mexico", "France"],
        B: ["USA", "Argentina"],
        C: ["England"],
        D: ["Germany"],
      },
    },
    {
      id: 4, title: "Most Painful WC 2026 Eliminations",
      category: "World Cup", author: "tearscollector", time: "6h ago", hoursAgo: 6,
      votes: 4310, comments: 622,
      tiers: {
        S: ["Brazil on penalties"],
        A: ["Italy in the group stage", "Morocco in the last 16"],
        B: ["Netherlands"],
        C: ["Croatia"],
        D: ["Belgium (we all saw it coming)"],
      },
    },
    {
      id: 5, title: "Fast Food Fries, Ranked by Someone With Taste",
      category: "Fast Food", author: "burgerlord", time: "2h ago", hoursAgo: 2,
      votes: 4821, comments: 342,
      tiers: {
        S: ["McDonald's (fresh)", "Five Guys"],
        A: ["Popeyes Cajun", "Checkers"],
        B: ["Wendy's", "Chick-fil-A Waffle"],
        C: ["Burger King", "KFC"],
        D: ["McDonald's (cold)"],
      },
    },
    {
      id: 6, title: "Every Zelda Game — No Nostalgia Allowed",
      category: "Games", author: "hyrulehater", time: "5h ago", hoursAgo: 5,
      votes: 3907, comments: 518,
      tiers: {
        S: ["Breath of the Wild", "Tears of the Kingdom"],
        A: ["Ocarina of Time", "Wind Waker"],
        B: ["Majora's Mask", "Link's Awakening"],
        C: ["Skyward Sword"],
        D: ["Zelda II"],
      },
    },
    {
      id: 7, title: "Anime Openings That Go Way Too Hard",
      category: "Anime", author: "sakugasan", time: "8h ago", hoursAgo: 8,
      votes: 3312, comments: 267,
      tiers: {
        S: ["Attack on Titan OP1", "JJK OP1"],
        A: ["Chainsaw Man OP", "FMAB OP4"],
        B: ["Naruto OP16", "One Piece OP1"],
        C: ["Bleach OP13"],
        D: ["That one filler arc OP"],
      },
    },
    {
      id: 8, title: "Programming Languages by How Much They Hurt",
      category: "Tech", author: "segfaultsally", time: "12h ago", hoursAgo: 12,
      votes: 2988, comments: 731,
      tiers: {
        S: ["Rust (after 6 months)", "Python"],
        A: ["TypeScript", "Go"],
        B: ["Kotlin", "C#"],
        C: ["Java", "C++"],
        D: ["PHP 5", "COBOL"],
      },
    },
    {
      id: 9, title: "Sneaker Silhouettes of All Time (Objective)",
      category: "Fashion", author: "griptape", time: "14h ago", hoursAgo: 14,
      votes: 2410, comments: 189,
      tiers: {
        S: ["Jordan 1", "AF1"],
        A: ["NB 550", "Dunk Low"],
        B: ["Samba", "Gazelle"],
        C: ["Yeezy Foam Runner"],
        D: ["Skechers Shape-Ups"],
      },
    },
    {
      id: 10, title: "Movie Trilogies Where Part 3 Didn't Ruin It",
      category: "Movies", author: "reelcritic", time: "19h ago", hoursAgo: 19,
      votes: 2156, comments: 298,
      tiers: {
        S: ["Lord of the Rings", "Toy Story (1-3)"],
        A: ["Back to the Future", "Dark Knight"],
        B: ["Spider-Man (Raimi)"],
        C: ["The Matrix"],
        D: ["The Hangover"],
      },
    },
    {
      id: 11, title: "Cereal Mascots by Trustworthiness",
      category: "Memes", author: "milkfirst", time: "1d ago", hoursAgo: 24,
      votes: 1873, comments: 156,
      tiers: {
        S: ["Tony the Tiger"],
        A: ["Snap, Crackle, Pop", "Toucan Sam"],
        B: ["Cap'n Crunch"],
        C: ["Trix Rabbit"],
        D: ["The Honey Smacks Frog"],
      },
    },
    {
      id: 12, title: "Gym Exercises by Pain-to-Gain Ratio",
      category: "Sports", author: "dumbbelldave", time: "1d ago", hoursAgo: 26,
      votes: 1655, comments: 203,
      tiers: {
        S: ["Lat Pulldown", "Leg Press"],
        A: ["Bench Press", "Rows"],
        B: ["Deadlift", "Pull-ups"],
        C: ["Squats"],
        D: ["Bulgarian Split Squats"],
      },
    },
  ];

  /* 100 trendy topics (July 2026). Items are ordered best → worst;
     toTiers() distributes them across the five ranks. */
  const TRENDY_TOPICS = [
    // ---- World Cup 2026 ----
    { t: "Best WC 2026 Goals So Far", c: "World Cup", i: ["The 35-yard screamer", "Yamal's solo run", "The overhead kick", "The 96th-minute winner", "Deflected off a defender's back"] },
    { t: "WC 2026 Stadiums Ranked", c: "World Cup", i: ["Estadio Azteca", "SoFi", "MetLife", "BC Place", "Estadio BBVA", "The one with the bad grass"] },
    { t: "WC 2026 Goal Celebrations", c: "World Cup", i: ["Griddy at the corner flag", "The baby cradle", "Knee slide in the rain", "Staring dead into the camera", "Shirt off (instant yellow)"] },
    { t: "Best Anthem Scenes at WC 2026", c: "World Cup", i: ["Italy fans (they still came)", "Brazil's drum section", "France", "Mexico at the Azteca", "USA doing their best"] },
    { t: "WC 2026 Keepers Ranked", c: "World Cup", i: ["The penalty-save guy", "The sweeper keeper", "The 40-year-old legend", "The one who plays out from the back", "The one who should not"] },
    { t: "Best XI of the Tournament So Far", c: "World Cup", i: ["Yamal", "Mbappé", "Bellingham", "Valverde", "Musiala", "That random fullback having a career month"] },
    { t: "Biggest WC 2026 Flops", c: "World Cup", i: ["The €150m striker with 0 goals", "The hyped wonderkid", "The team that posted 'we're so back'", "VAR", "The official song"] },
    { t: "WC Penalty Takers by Trustworthiness", c: "World Cup", i: ["The stone-cold veteran", "The keeper who came up to take one", "The stutter-step guy", "The captain (rushed it)", "Whoever went fifth"] },
    { t: "World Cup Mascots of All Time", c: "World Cup", i: ["Footix '98", "Zabivaka", "The 2026 moose thing", "La'eeb", "Goleo (cursed)"] },
    { t: "USMNT at Their Home World Cup", c: "World Cup", i: ["Pulisic", "The keeper", "The midfield shift", "The vibes", "The finishing"] },
    { t: "WC Refs by Card Happiness", c: "World Cup", i: ["The one who lets play flow", "The calm conversation guy", "Average enjoyer", "Pocket-reacher", "Red card speedrunner"] },
    { t: "Group Stage Games That Went Off", c: "World Cup", i: ["The 4-3", "The 95th-minute equalizer", "The upset nobody predicted", "The rivalry match", "0-0 that was somehow good"] },
    // ---- Sports ----
    { t: "F1 2026 Cars (New Regs) Ranked", c: "Sports", i: ["The one dominating", "The surprise podium car", "The midfield banger", "The team blaming the engine", "The one already on next year"] },
    { t: "F1 Drivers Right Now", c: "Sports", i: ["The championship leader", "The rookie sensation", "The radio menace", "The veteran holding on", "The pay driver"] },
    { t: "NBA Finals 2026 Moments", c: "Sports", i: ["The game-winner", "The 40-point closeout", "The block", "The bench reaction", "The podium interview"] },
    { t: "Summer 2026 Transfer Rumors", c: "Sports", i: ["The one that's actually happening", "Here we go pending", "Agent leak", "Fan-made in Photoshop", "'My uncle works at the club'"] },
    { t: "Pickup Basketball Player Types", c: "Sports", i: ["The silent hooper", "Passes first, wins games", "Mid-range assassin", "Calls every foul", "Brings his own rules"] },
    { t: "Gym Machines by Aura", c: "Sports", i: ["Squat rack", "Cable station", "Pec deck", "Smith machine", "That hip thing everyone avoids"] },
    { t: "Pickleball vs Everything", c: "Sports", i: ["Padel", "Pickleball", "Tennis", "Badminton", "Racquetball (RIP)"] },
    { t: "Sports Docs to Binge", c: "Sports", i: ["Drive to Survive", "The WC 2026 behind-the-scenes", "Last Dance rewatch", "Full Swing", "The one about your team (painful)"] },
    // ---- Games ----
    { t: "GTA VI Features We're Most Hyped For", c: "Games", i: ["The map", "The heists", "Online day one", "The physics", "The loading screens (please be fast)"] },
    { t: "Switch 2 Games Ranked", c: "Games", i: ["Mario Kart World", "The 3D Mario", "Metroid Prime 4", "The launch port you already owned", "Tech demo cardboard thing"] },
    { t: "Mario Kart World Tracks", c: "Games", i: ["Rainbow Road", "The city sprawl", "The desert loop", "The retro remake", "The one with the wall you always hit"] },
    { t: "Roblox Brainrot Games Ranked", c: "Games", i: ["Steal a Brainrot", "Grow a Garden", "The new copy of the copy", "Brainrot tower defense", "The one with 47 gamepasses"] },
    { t: "Fortnite Seasons of All Time", c: "Games", i: ["Chapter 1 S1 (nostalgia)", "The Travis Scott one", "The Marvel one", "Whatever's live now", "The one everyone skipped"] },
    { t: "Elden Ring Bosses by Trauma", c: "Games", i: ["Malenia", "The horse guy", "The double gank fight", "Margit (first wall)", "The reused one"] },
    { t: "Games of 2026 So Far", c: "Games", i: ["The GOTY frontrunner", "The indie that ate 80 hours", "The remake done right", "The live-service comeback", "The $70 disappointment"] },
    { t: "Minecraft Updates Ranked", c: "Games", i: ["The one that changed everything", "Caves & Cliffs", "The Nether update", "This year's mob vote winner", "The mob vote losers (justice)"] },
    { t: "Handhelds in 2026", c: "Games", i: ["Steam Deck OLED", "Switch 2", "ROG Ally", "The phone controller clip", "Your dead 3DS (emotionally S)"] },
    { t: "CoD Campaigns Ever", c: "Games", i: ["MW2 (2009)", "Black Ops", "MW (2019)", "The space one", "The one with no campaign"] },
    { t: "Cozy Games for 3am", c: "Games", i: ["Stardew", "Animal Crossing", "The new cozy hit", "Minecraft peaceful mode", "Unpacking (emotional damage)"] },
    { t: "Horror Games You Can't Play Alone", c: "Games", i: ["The co-op scream fest", "The asylum one", "The PS1-style indie", "The VR one (never)", "The jumpscare compilation game"] },
    { t: "Speedrun Categories by Chaos", c: "Games", i: ["Any% glitchless", "100%", "Any% (game broken in half)", "Blindfolded", "The one with a pause-buffer meta"] },
    { t: "Game Consoles Ever (2026 Edition)", c: "Games", i: ["PS2", "Switch 2", "PS5 Pro", "Xbox Series X", "Virtual Boy"] },
    { t: "FC 26 Ratings Reveal Reactions", c: "Games", i: ["The striker who deserved it", "The 89 that should be 91", "My club's entire squad (robbed)", "The rating that started a war", "Goalkeepers (always wrong)"] },
    // ---- Tech ----
    { t: "AI Video Generators Ranked", c: "Tech", i: ["The one that broke the internet last month", "The open-source one", "The watermarked free tier", "The one that melts hands", "Slideshow with vibes"] },
    { t: "Phones of 2026 So Far", c: "Tech", i: ["The foldable that finally makes sense", "iPhone", "The camera monster", "The battery king", "The one with 'AI button' nobody presses"] },
    { t: "Folding Phones by Crease", c: "Tech", i: ["Basically invisible", "You forget it's there", "Visible but fine", "You feel it every scroll", "Structural weakness"] },
    { t: "Earbuds Tier List", c: "Tech", i: ["AirPods Pro", "The audiophile pick", "The gym pair", "The $20 ones that slap", "The ones that fall out"] },
    { t: "Smartwatches in 2026", c: "Tech", i: ["The one that reads your sleep scarily well", "Apple Watch", "The fitness brand one", "The hybrid analog", "The one you charge daily and hate"] },
    { t: "Browsers by Vibes", c: "Tech", i: ["The fast new one", "Firefox (respect)", "Chrome (RAM tax)", "Safari", "The one that came with the laptop"] },
    { t: "Social Apps Right Now", c: "Tech", i: ["The group chat", "TikTok", "The new one everyone's trying", "Instagram", "The one that's just ads now"] },
    { t: "Laptops for Students", c: "Tech", i: ["MacBook Air", "The gaming laptop (be honest)", "The $400 workhorse", "The tablet with keyboard cope", "The school Chromebook"] },
    { t: "VR/AR Headsets 2026", c: "Tech", i: ["The lightweight glasses", "Quest", "Vision Pro", "The PC-tethered beast", "The one gathering dust"] },
    { t: "EVs in 2026", c: "Tech", i: ["The one with insane range", "The affordable one finally", "The truck", "The luxury spaceship", "The one with subscription seat heating"] },
    { t: "Chargers by Betrayal Level", c: "Tech", i: ["The braided cable (loyal)", "65W brick", "The car charger", "The one that only works at an angle", "Hotel room USB port"] },
    { t: "Wi-Fi Spots by Reliability", c: "Tech", i: ["Home ethernet", "The café that lets you sit 4 hours", "Library", "Airport wifi", "Hotel 'premium' wifi"] },
    // ---- Music ----
    { t: "Songs of Summer 2026", c: "Music", i: ["The WC anthem remix", "The one from TikTok", "The surprise drop", "The festival closer", "The one your mom knows"] },
    { t: "Rappers Right Now", c: "Music", i: ["The one who just dropped", "The lyricist", "The hitmaker", "The one beefing again", "The one still teasing the album"] },
    { t: "K-pop Groups 2026", c: "Music", i: ["The one selling out stadiums", "The comeback of the year", "The rookie group", "The subunit", "The disbanded one (still S in our hearts)"] },
    { t: "Festival Lineups 2026", c: "Music", i: ["The one with the secret guest", "Coachella", "Glasto", "The local one that overperformed", "The one that got cancelled"] },
    { t: "One-Hit Wonders of the 2020s", c: "Music", i: ["The 2021 one you still play", "The TikTok sped-up one", "The summer 2023 one", "The one-week wonder", "You already forgot it"] },
    { t: "Album Covers of 2026", c: "Music", i: ["The minimalist one", "The film photo one", "The AI one (controversial)", "The childhood photo one", "Just text on white"] },
    { t: "Diss Tracks of All Time", c: "Music", i: ["The 2024 one (you know)", "Ether", "Hit 'Em Up", "The response that came too late", "The apology track after"] },
    { t: "Boy Bands Ever", c: "Music", i: ["The Beatles (cheating)", "*NSYNC", "BTS", "One Direction", "The one from the cereal ad"] },
    { t: "TikTok Sounds Rn", c: "Music", i: ["The sped-up one", "The audio from that one video", "The 2016 throwback", "The AI voice one", "The one stuck in your head against your will"] },
    { t: "Concert Crowd Types", c: "Music", i: ["The barricade veterans", "The scream-every-word section", "The couple slow dancing to a rage song", "Phone-up-all-night guy", "The pit that opens for no reason"] },
    // ---- Movies & TV ----
    { t: "Spider-Man: Brand New Day — Villain Wishlist", c: "Movies", i: ["The one from the leaks", "A street-level arc", "The symbiote (again, but right)", "The multiverse cameo", "Another dance scene (no)"] },
    { t: "Summer 2026 Blockbusters", c: "Movies", i: ["The one that's actually good", "The sequel that justified itself", "The horror sleeper hit", "The reboot nobody asked for", "The one that moved to streaming"] },
    { t: "A24 Movies by Emotional Damage", c: "Movies", i: ["The one you can't rewatch", "The weird one you defend", "The horror one", "The coming-of-age one", "The one that's just vibes"] },
    { t: "Dune Movies (Waiting for Part 3)", c: "Movies", i: ["Part Two", "Part One", "The 1984 one (camp classic)", "The popcorn bucket", "Waiting until December (D tier experience)"] },
    { t: "Star Wars Shows Ranked", c: "Movies", i: ["Andor", "The Mandalorian S1-2", "The one with the lightsaber episode", "The mid one", "The one we don't discuss"] },
    { t: "Netflix Originals 2026", c: "Movies", i: ["The Korean one everyone binged", "The docuseries", "The rom-com that worked", "Season 3 of the thing", "Cancelled after one season (pattern)"] },
    { t: "Horror Franchises by Consistency", c: "Movies", i: ["The Conjuring-verse", "Scream", "The new indie franchise", "Saw (chaotic)", "The one on part 11"] },
    { t: "Rom-Coms Ever", c: "Movies", i: ["The 90s classic", "The 2000s comfort one", "The recent one that revived the genre", "The Netflix formula one", "The one where they end up with the wrong person"] },
    { t: "Movie Theater Snack Strategy", c: "Movies", i: ["Smuggled snacks (S tier economics)", "Popcorn + ICEE", "Nachos (loud)", "The $12 candy", "Full dinner in the dark"] },
    { t: "Awards Season 2026 Moments", c: "Movies", i: ["The speech that went viral", "The upset win", "The snub discourse", "The bit that ran too long", "The audience reaction cam"] },
    { t: "Avatar Movies (Fire and Ash Era)", c: "Movies", i: ["The one you saw in IMAX", "Way of Water rewatch", "The first one", "Waiting 3 more years", "The blue cat memes (eternal)"] },
    { t: "TV Finales by Landing", c: "Movies", i: ["Stuck the landing", "Good enough", "Rushed but fine", "The one we pretend ended a season early", "Ruined the whole show"] },
    // ---- Anime ----
    { t: "Anime of 2026 So Far", c: "Anime", i: ["The one with the insane animation budget", "The sequel season", "The sleeper hit", "The isekai (a good one!)", "The adaptation that hurt the manga readers"] },
    { t: "JJK Season 3 Fights", c: "Anime", i: ["The one that broke Twitter", "The sorcerer showdown", "The flashback fight", "The one-sided beatdown", "The off-screened one (crime)"] },
    { t: "One Piece Arcs Ranked", c: "Anime", i: ["Enies Lobby", "Marineford", "Wano payoff", "Water 7", "The filler island"] },
    { t: "Solo Leveling Moments", c: "Anime", i: ["ARISE", "The dungeon reveal", "The stat-check fight", "Training arc", "The webtoon panel they nailed"] },
    { t: "Shonen Protagonists by W-L Record", c: "Anime", i: ["The one who never loses", "The strategist", "The lovable idiot (wins anyway)", "The one carried by friends", "The one who loses round one every time"] },
    { t: "Anime Betrayals Ranked", c: "Anime", i: ["The one you never saw coming", "The double agent", "The childhood friend", "The mentor (classic)", "The one spoiled by the opening"] },
    { t: "Ghibli Movies by Comfort", c: "Anime", i: ["Totoro", "Kiki's", "Howl's", "Spirited Away", "Grave of the Fireflies (comfort: none)"] },
    { t: "Isekai Premises by Laziness", c: "Anime", i: ["Actually original", "Truck-kun classic", "Reborn as a noble", "Reborn as an item", "Reborn as a vending machine (real)"] },
    // ---- Memes / Internet ----
    { t: "Brainrot Terms of 2026", c: "Memes", i: ["The new one from last week", "Aura (still alive)", "The one your teacher said", "Skibidi (retired but respected)", "The one brands started using (dead instantly)"] },
    { t: "TikTok Trends Rn", c: "Memes", i: ["The dance that's everywhere", "The recipe one", "The POV format", "The AI filter one", "The one that's just people lying"] },
    { t: "YouTubers 2026", c: "Memes", i: ["The one who built a city this time", "The video essayist", "The comeback arc", "The one posting once a year", "The apology video guy"] },
    { t: "Streamers by Chaos", c: "Memes", i: ["The marathon streamer", "The variety king", "The one who plays one game forever", "The just-chatting empire", "The banned-again one"] },
    { t: "Group Chat Member Types", c: "Memes", i: ["The planner (carries)", "The meme supplier", "The lurker who likes everything", "Leaves on read for 3 days", "The one who replies to week-old messages"] },
    { t: "Emojis by Power Level", c: "Memes", i: ["💀", "🙏", "😭", "👍 (passive aggressive)", "The one only your dad uses"] },
    { t: "Viral Animals Hall of Fame", c: "Memes", i: ["This year's zoo baby", "Moo Deng (legacy)", "The capybara era", "The screaming cat", "Whatever's viral by Friday"] },
    { t: "AI Memes by Cursedness", c: "Memes", i: ["The obviously fake one everyone believed", "The historical figure vlogs", "The AI song that charted", "The uncanny hands era (vintage)", "Your uncle's AI profile pic"] },
    // ---- Food ----
    { t: "Energy Drinks by Heart Rate", c: "Fast Food", i: ["The 200mg problem", "The gamer one", "The gas station classic", "The 'natural' one", "Whatever the gym bro hands you"] },
    { t: "Summer Snacks Ranked", c: "Fast Food", i: ["Watermelon (cold)", "The ice cream truck order", "Freezer pops", "Gas station slushie", "Warm cooler sandwich"] },
    { t: "Ice Cream Flavors (No Cowards)", c: "Fast Food", i: ["Cookies and cream", "Pistachio (trust)", "Mango sorbet", "Vanilla (reliable)", "Rum raisin (who)"] },
    { t: "Gas Station Snack Run", c: "Fast Food", i: ["The perfect chip pull", "Beef jerky (rich day)", "The 2-for-1 candy", "The roller grill gamble", "Expired protein bar"] },
    { t: "Sodas Ranked by First Sip", c: "Fast Food", i: ["Ice-cold glass bottle Coke", "The fountain mix", "Cream soda", "The store brand (surprisingly ok)", "Flat soda from yesterday"] },
    { t: "Pizza Chains by Trust", c: "Fast Food", i: ["The local spot (not a chain, still wins)", "The deep dish one", "The 30-min delivery one", "The school lunch one (nostalgia)", "Airport pizza"] },
    { t: "Coffee Orders by Personality", c: "Fast Food", i: ["Espresso (no time)", "Cold brew (menace)", "The 9-word custom order", "Matcha (switched sides)", "Decaf (why)"] },
    { t: "Matcha vs The World", c: "Fast Food", i: ["Iced matcha latte", "Hot matcha (purist)", "Matcha lemonade", "Coffee (the old king)", "The $9 one that's mostly milk"] },
    // ---- Fashion ----
    { t: "Sneaker Drops 2026", c: "Fashion", i: ["The collab that broke the app", "The retro re-release", "The running shoe that went lifestyle", "The one that sat on shelves", "The AI-designed one (no)"] },
    { t: "Summer Fits by Effort", c: "Fashion", i: ["Linen everything", "Jersey + shorts (WC summer)", "The jorts revival", "Tank top rotation", "Same hoodie, 95 degrees"] },
    { t: "Caps by Aura", c: "Fashion", i: ["The perfectly broken-in one", "The team fitted", "The vintage strapback", "The stiff new one", "The free bank one"] },
    { t: "Sunglasses Ranked", c: "Fashion", i: ["The ones that survive every summer", "The rectangle ones", "Sport wraparounds (ironic then real)", "The $5 pair (loyal)", "The ones on your head right now (lost)"] },
    // ---- Life ----
    { t: "Summer 2026 Activities", c: "Memes", i: ["Watch party for the final", "Beach day", "The cookout", "Rooftop anything", "Doomscrolling in AC (honest)"] },
    { t: "Vacation Destinations 2026", c: "Memes", i: ["The WC host city trip", "The cheap flight you found", "The beach town", "The national park", "Staycation (budget went to jerseys)"] },
    { t: "Sleep Schedules by Delusion", c: "Memes", i: ["10pm-6am (who are you)", "12-8 (respectable)", "2am-10am (student)", "4am 'one more episode'", "Reverse jetlag (WC games in every timezone)"] },
  ];

  const AUTHOR_POOL = [
    "footyoracle", "xgmerchant", "kitcollector", "auxgoblin", "bloxxed",
    "cordcutter", "promptlord", "gatec12", "postcredits", "sakugasan",
    "burgerlord", "segfaultsally", "griptape", "reelcritic", "milkfirst",
    "dumbbelldave", "tearscollector", "hyrulehater", "casualenjoyer", "lurker_supreme",
  ];

  function timeLabel(h) {
    if (h < 1) return Math.round(h * 60) + "m ago";
    if (h < 24) return Math.round(h) + "h ago";
    return Math.round(h / 24) + "d ago";
  }

  function toTiers(items) {
    const tiers = {};
    items.forEach((item, i) => {
      const tier = TIERS[Math.min(4, Math.floor((i * 5) / items.length))];
      (tiers[tier] = tiers[tier] || []).push(item);
    });
    return tiers;
  }

  const trendy = TRENDY_TOPICS.map((topic, i) => {
    const hoursAgo = +(0.4 + i * 0.37).toFixed(1);
    const votes = Math.max(180, 6400 - i * 41 - (i % 9) * 230);
    return {
      id: 100 + i,
      title: topic.t,
      category: topic.c,
      author: AUTHOR_POOL[i % AUTHOR_POOL.length],
      time: timeLabel(hoursAgo),
      hoursAgo,
      votes,
      comments: Math.max(12, Math.round(votes / 9) - (i % 5) * 40),
      tiers: toTiers(topic.i),
    };
  });

  const PAGE_SIZE = 12;

  const comments = {
    default: [
      {
        id: "c1", author: "casualenjoyer", op: false, time: "1h ago",
        text: "Putting that in the top spot is the bravest thing I've seen on this site.",
        votes: 214,
        replies: [
          {
            id: "c1-1", author: "burgerlord", op: true, time: "58m ago",
            text: "Brave AND correct. Trust me bro.",
            votes: 156,
            replies: [
              {
                id: "c1-1-1", author: "casualenjoyer", op: false, time: "50m ago",
                text: "…ok that's fair actually.",
                votes: 87, replies: [],
              },
            ],
          },
        ],
      },
      {
        id: "c2", author: "contrarian99", op: false, time: "2h ago",
        text: "This entire list is wrong and I will not be elaborating.",
        votes: -32,
        replies: [
          {
            id: "c2-1", author: "peacekeeper", op: false, time: "1h ago",
            text: "The comment section delivering as always 🍿",
            votes: 64, replies: [],
          },
        ],
      },
      {
        id: "c3", author: "lurker_supreme", op: false, time: "3h ago",
        text: "First time commenting in 4 years. This list moved me.",
        votes: 341, replies: [],
      },
    ],
  };

  const leaderboard = [
    { name: "footyoracle", points: "18.2k" },
    { name: "sakugasan", points: "12.4k" },
    { name: "burgerlord", points: "9.8k" },
    { name: "segfaultsally", points: "8.1k" },
    { name: "reelcritic", points: "6.7k" },
  ];

  return {
    TIERS,
    getLists: async (page = 1) =>
      page === 1 ? page1 : trendy.slice((page - 2) * PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getComments: async (listId) => comments[listId] || comments.default,
    getLeaderboard: async () => leaderboard,
    // POST stubs — wire to backend later
    submitVote: async (listId, direction) => ({ ok: true, listId, direction }),
    submitComment: async (listId, text, parentId = null) =>
      ({ ok: true, id: "c" + Math.random().toString(36).slice(2, 8), listId, text, parentId }),
  };
})();

/* ---------- VOTES (shared by cards, items, comments) ---------- */
const Votes = (() => {
  // userVotes[id] = 1 | -1 | undefined — mirrors what the backend would track per-user
  const userVotes = {};

  function format(n) {
    const abs = Math.abs(n);
    if (abs >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  /** Toggle/switch a vote. Returns the new displayed total and the user's vote state. */
  function cast(id, baseVotes, direction) {
    const prev = userVotes[id] || 0;
    const next = prev === direction ? 0 : direction; // clicking again removes the vote
    userVotes[id] = next;
    return { total: baseVotes + next, state: next };
  }

  return { cast, format };
})();

/* ---------- FEED ---------- */
const Feed = (() => {
  const grid = document.getElementById("feedGrid");
  const template = document.getElementById("tierCardTemplate");
  const titleEl = document.getElementById("feedTitle");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const AD_EVERY = 4; // insert an in-feed ad after every 4 cards
  const BAR_WIDTHS = { S: 100, A: 84, B: 66, C: 48, D: 30 };

  let all = [];
  let nextPage = 2;
  const state = { sort: "hot", category: null, query: "" };

  function buildAdCard(index) {
    const ad = document.createElement("div");
    ad.className = "ad-banner ad-banner--infeed";
    ad.dataset.adSlot = "infeed-" + index;
    ad.innerHTML =
      '<span class="ad-label">Advertisement</span><div class="ad-placeholder">Responsive In-Feed Unit</div>';
    return ad;
  }

  function buildPreview(tiers) {
    const frag = document.createDocumentFragment();
    MockAPI.TIERS.forEach((tier) => {
      if (!(tiers[tier] || []).length) return;
      const row = document.createElement("div");
      row.className = "tier-preview-row";
      row.innerHTML =
        `<span class="tier-preview-bar" style="width:${BAR_WIDTHS[tier]}%;` +
        `background:var(--tier-${tier.toLowerCase()})"></span>`;
      frag.appendChild(row);
    });
    return frag;
  }

  function buildCard(list, index) {
    const card = template.content.cloneNode(true).firstElementChild;
    card.style.animationDelay = `${(index % 8) * 40}ms`;
    card.dataset.listId = list.id;

    card.querySelector(".tier-card-category").textContent = list.category;
    card.querySelector(".tier-card-time").textContent = list.time;
    card.querySelector(".tier-card-link").textContent = list.title;
    card.querySelector(".tier-card-author").innerHTML = `by <b>@${list.author}</b>`;
    card.querySelector(".comment-num").textContent = Votes.format(list.comments);
    card.querySelector(".tier-preview").appendChild(buildPreview(list.tiers));

    // Voting
    const countEl = card.querySelector(".vote-count");
    const upBtn = card.querySelector(".vote-btn--up");
    const downBtn = card.querySelector(".vote-btn--down");
    countEl.textContent = Votes.format(list.votes);

    function onVote(direction) {
      const { total, state: voteState } = Votes.cast("list-" + list.id, list.votes, direction);
      countEl.textContent = Votes.format(total);
      countEl.classList.toggle("is-up", voteState === 1);
      countEl.classList.toggle("is-down", voteState === -1);
      upBtn.classList.toggle("is-voted", voteState === 1);
      downBtn.classList.toggle("is-voted", voteState === -1);
      MockAPI.submitVote(list.id, voteState); // fire-and-forget; backend later
    }
    upBtn.addEventListener("click", () => onVote(1));
    downBtn.addEventListener("click", () => onVote(-1));

    // Clicking anywhere on the card body opens the detail view (vote rail is separate)
    card.querySelector(".tier-card-main").addEventListener("click", () => Detail.open(list));

    return card;
  }

  function currentTitle() {
    if (state.query) return `Search: "${state.query}"`;
    if (state.category) return `${state.category} Tier Lists`;
    switch (state.sort) {
      case "fresh": return "Fresh Tier Lists";
      case "top": return "Top Tier Lists Today";
      case "controversial": return "Controversial Tier Lists";
      default: return "Trending Tier Lists";
    }
  }

  function applyState() {
    let out = [...all];
    if (state.category) out = out.filter((l) => l.category === state.category);
    if (state.query) {
      const q = state.query.toLowerCase();
      out = out.filter(
        (l) => l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
      );
    }
    switch (state.sort) {
      case "fresh":
        out.sort((a, b) => a.hoursAgo - b.hoursAgo);
        break;
      case "top":
        out = out.filter((l) => l.hoursAgo <= 24).sort((a, b) => b.votes - a.votes);
        break;
      case "controversial":
        out.sort((a, b) => b.comments - a.comments);
        break;
      default: // hot — votes decayed by age
        out.sort((a, b) => b.votes / (b.hoursAgo + 2) - a.votes / (a.hoursAgo + 2));
    }
    return out;
  }

  function render() {
    const lists = applyState();
    titleEl.textContent = currentTitle();
    grid.innerHTML = "";
    if (!lists.length) {
      const empty = document.createElement("p");
      empty.className = "feed-empty";
      empty.textContent = "No tier lists here (yet). Make the first one, bro.";
      grid.appendChild(empty);
      return;
    }
    lists.forEach((list, i) => {
      grid.appendChild(buildCard(list, i));
      // Strategic in-feed ad placement — after every AD_EVERY cards
      if ((i + 1) % AD_EVERY === 0) grid.appendChild(buildAdCard(i));
    });
  }

  function syncChips() {
    const chipFor = { hot: "hot", top: "top", controversial: "controversial", fresh: "new" };
    document.querySelectorAll(".feed-filters .chip").forEach((c) => {
      const active = c.dataset.filter === chipFor[state.sort] && !state.query && !state.category;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-selected", String(active));
    });
  }

  function setSort(sort) {
    state.sort = sort;
    state.query = "";
    syncChips();
    render();
  }

  function setCategory(category) {
    state.category = category;
    state.query = "";
    syncChips();
    render();
  }

  function setQuery(query) {
    state.query = query.trim();
    syncChips();
    render();
  }

  function reset() {
    state.sort = "hot";
    state.category = null;
    state.query = "";
    syncChips();
    render();
  }

  function addList(list) {
    all.unshift(list);
    reset();
  }

  async function loadMore() {
    const extra = await MockAPI.getLists(nextPage);
    if (!extra.length) return;
    all = all.concat(extra);
    nextPage++;
    render();
    // Peek ahead — disable the button once the well is dry
    const peek = await MockAPI.getLists(nextPage);
    if (!peek.length) {
      loadMoreBtn.textContent = "That's all of them, bro 🤝";
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = ".55";
    }
  }

  async function init() {
    all = await MockAPI.getLists(1);
    render();

    const sortFor = { hot: "hot", top: "top", controversial: "controversial", new: "fresh" };
    document.querySelectorAll(".feed-filters .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.category = null;
        setSort(sortFor[chip.dataset.filter] || "hot");
      });
    });

    loadMoreBtn.addEventListener("click", loadMore);
  }

  return { init, setSort, setCategory, setQuery, reset, addList };
})();

/* ---------- DETAIL VIEW (full tier list + comments) ---------- */
const Detail = (() => {
  const overlay = document.getElementById("detailOverlay");
  const titleEl = document.getElementById("detailTitle");
  const metaEl = document.getElementById("detailMeta");
  const tiersEl = document.getElementById("detailTiers");
  let currentList = null;

  /* Vote-share model: every item gets a weight (tier sets the ballpark, the
     item name nudges it), then shares are normalized so the list totals 100%. */
  function itemWeights(tiers) {
    const base = { S: 95, A: 70, B: 48, C: 30, D: 16 };
    const entries = [];
    MockAPI.TIERS.forEach((tier) => {
      (tiers[tier] || []).forEach((item) => {
        let hash = 0;
        for (let i = 0; i < item.length; i++) hash = (hash * 31 + item.charCodeAt(i)) % 97;
        entries.push({ tier, item, weight: base[tier] + (hash % 9) - 4 });
      });
    });
    const total = entries.reduce((sum, e) => sum + e.weight, 0);
    entries.forEach((e) => (e.share = Math.round((e.weight / total) * 1000) / 10));
    // Absorb rounding drift into the biggest share so it sums to exactly 100.0
    const drift = Math.round((100 - entries.reduce((s, e) => s + e.share, 0)) * 10) / 10;
    entries.sort((a, b) => b.share - a.share);
    entries[0].share = Math.round((entries[0].share + drift) * 10) / 10;
    return entries;
  }

  function renderTiers(tiers) {
    tiersEl.innerHTML = "";
    // One row per item, benchmark-chart style: bar length = share of the vote
    const entries = itemWeights(tiers);
    const maxShare = entries[0].share;
    entries.forEach(({ tier, item, share }) => {
      {
        const width = (share / maxShare) * 100;
        const row = document.createElement("div");
        row.className = "tier-row";
        row.innerHTML =
          `<div class="tier-row-label" title="${item}">${item}</div>` +
          `<div class="tier-row-track">` +
          `<div class="tier-row-bar" style="width:${width}%;background:var(--tier-${tier.toLowerCase()})"></div>` +
          `<span class="tier-row-pct">${share.toFixed(1)}%</span>` +
          `</div>` +
          `<div class="item-votes">` +
          `<button class="item-vote item-vote--up" aria-label="Upvote ${item}">` +
          `<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="${BRUSH_TRI}"/></svg></button>` +
          `<button class="item-vote item-vote--down" aria-label="Downvote ${item}">` +
          `<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor"><path d="${BRUSH_TRI}" transform="rotate(180 12 11.2)"/></svg></button>` +
          `</div>`;

        const upBtn = row.querySelector(".item-vote--up");
        const downBtn = row.querySelector(".item-vote--down");
        const voteKey = `item-${currentList.id}-${item}`;
        function onItemVote(direction) {
          const { state } = Votes.cast(voteKey, 0, direction);
          upBtn.classList.toggle("is-on", state === 1);
          downBtn.classList.toggle("is-on", state === -1);
        }
        upBtn.addEventListener("click", () => onItemVote(1));
        downBtn.addEventListener("click", () => onItemVote(-1));

        tiersEl.appendChild(row);
      }
    });
  }

  async function open(list) {
    currentList = list;
    titleEl.textContent = list.title;
    metaEl.textContent = `${list.category} · by @${list.author} · ${list.time} · ${Votes.format(list.votes)} votes`;
    renderTiers(list.tiers);
    await Comments.load(list.id);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    currentList = null;
  }

  function init() {
    document.getElementById("detailClose").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) close();
    });
  }

  return { init, open, getCurrentId: () => currentList?.id };
})();

/* ---------- COMMENTS (nested thread) ---------- */
const Comments = (() => {
  const thread = document.getElementById("commentThread");
  const countEl = document.getElementById("commentsCount");
  const composer = document.getElementById("commentComposer");
  const input = document.getElementById("commentInput");

  function countAll(list) {
    return list.reduce((n, c) => n + 1 + countAll(c.replies || []), 0);
  }

  function buildComment(c, depth = 0) {
    const el = document.createElement("div");
    el.className = "comment";
    el.dataset.commentId = c.id;

    const initial = c.author[0].toUpperCase();
    el.innerHTML = `
      <div class="avatar" aria-hidden="true">${initial}</div>
      <div class="comment-body">
        <div class="comment-head">
          <span class="comment-author ${c.op ? "is-op" : ""}">@${c.author}${c.op ? " · OP" : ""}</span>
          <span class="comment-time">${c.time}</span>
        </div>
        <p class="comment-text"></p>
        <div class="comment-actions">
          <button class="comment-vote">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="${BRUSH_TRI}"/></svg>
            <span class="comment-vote-count">${Votes.format(c.votes)}</span>
          </button>
          ${depth < 3 ? '<button class="comment-reply-btn">Reply</button>' : ""}
        </div>
      </div>`;

    // textContent, not innerHTML — comment text is user input
    el.querySelector(".comment-text").textContent = c.text;

    // Comment voting
    const voteBtn = el.querySelector(".comment-vote");
    const voteCount = el.querySelector(".comment-vote-count");
    voteBtn.addEventListener("click", () => {
      const { total, state } = Votes.cast("comment-" + c.id, c.votes, 1);
      voteCount.textContent = Votes.format(total);
      voteBtn.classList.toggle("is-voted", state === 1);
    });

    // Inline reply composer
    const replyBtn = el.querySelector(".comment-reply-btn");
    if (replyBtn) {
      replyBtn.addEventListener("click", () => {
        const body = el.querySelector(".comment-body");
        const existing = body.querySelector(".reply-composer");
        if (existing) { existing.remove(); return; }

        const form = document.createElement("form");
        form.className = "reply-composer";
        form.innerHTML = `
          <input type="text" class="comment-input" placeholder="Reply to @${c.author}…" maxlength="500" />
          <button type="submit" class="btn btn-primary btn-sm">Reply</button>`;
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const text = form.querySelector("input").value.trim();
          if (!text) return;
          addReply(el, text, depth + 1, c.id);
          form.remove();
        });
        body.appendChild(form);
        form.querySelector("input").focus();
      });
    }

    // Nested replies
    if (c.replies?.length) {
      const children = document.createElement("div");
      children.className = "comment-children";
      c.replies.forEach((r) => children.appendChild(buildComment(r, depth + 1)));
      el.querySelector(".comment-body").appendChild(children);
    }

    return el;
  }

  function makeLocalComment(text) {
    return { id: "local-" + Date.now(), author: "you", op: false, time: "just now", text, votes: 1, replies: [] };
  }

  function addReply(parentEl, text, depth, parentId) {
    const body = parentEl.querySelector(":scope > .comment-body");
    let children = body.querySelector(":scope > .comment-children");
    if (!children) {
      children = document.createElement("div");
      children.className = "comment-children";
      body.appendChild(children);
    }
    children.appendChild(buildComment(makeLocalComment(text), depth));
    bumpCount(1);
    MockAPI.submitComment(Detail.getCurrentId(), text, parentId);
  }

  let total = 0;
  function bumpCount(delta) {
    total += delta;
    countEl.textContent = `(${total})`;
  }

  async function load(listId) {
    const comments = await MockAPI.getComments(listId);
    thread.innerHTML = "";
    comments.forEach((c) => thread.appendChild(buildComment(c)));
    total = countAll(comments);
    countEl.textContent = `(${total})`;
  }

  function init() {
    composer.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      thread.prepend(buildComment(makeLocalComment(text)));
      bumpCount(1);
      input.value = "";
      MockAPI.submitComment(Detail.getCurrentId(), text);
    });
  }

  return { init, load };
})();

/* ---------- SEARCH ---------- */
const Search = (() => {
  function init() {
    const bar = document.getElementById("searchBar");
    const input = document.getElementById("searchInput");
    document.getElementById("searchBtn").addEventListener("click", () => {
      bar.hidden = !bar.hidden;
      if (!bar.hidden) input.focus();
      else { input.value = ""; Feed.setQuery(""); }
    });
    input.addEventListener("input", () => Feed.setQuery(input.value));
  }
  return { init };
})();

/* ---------- CREATE TIER LIST ---------- */
const Create = (() => {
  const overlay = document.getElementById("createOverlay");
  const form = document.getElementById("createForm");
  const titleInput = document.getElementById("createTitle");
  const categoryInput = document.getElementById("createCategory");
  const itemsInput = document.getElementById("createItems");

  function open() {
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    titleInput.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    form.reset();
  }

  function init() {
    document.querySelectorAll(".btn-create").forEach((btn) =>
      btn.addEventListener("click", open)
    );
    document.getElementById("createCancel").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) close();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lines = itemsInput.value.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length || !titleInput.value.trim()) return;

      // Distribute items across tiers by position — best at the top
      const tiers = {};
      lines.forEach((item, i) => {
        const tier = MockAPI.TIERS[Math.min(4, Math.floor((i * 5) / lines.length))];
        (tiers[tier] = tiers[tier] || []).push(item);
      });

      const list = {
        id: "local-" + Math.random().toString(36).slice(2, 8),
        title: titleInput.value.trim(),
        category: categoryInput.value.trim() || "Random",
        author: "you", time: "just now", hoursAgo: 0,
        votes: 1, comments: 0, tiers,
      };
      close();
      Feed.addList(list);
      Detail.open(list);
    });
  }

  return { init };
})();

/* ---------- NAV (desktop + mobile links) ---------- */
const Nav = (() => {
  function init() {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const action = link.dataset.nav;
        document.querySelectorAll("[data-nav]").forEach((l) =>
          l.classList.toggle("is-active", l.dataset.nav === action)
        );
        MobileNav.closeMenu();

        if (action === "trending") Feed.reset();
        if (action === "new") { Feed.setCategory(null); Feed.setSort("fresh"); }
        if (action === "categories")
          document.querySelector(".tag-cloud").scrollIntoView({ behavior: "smooth", block: "center" });
        if (action === "leaderboard")
          document.getElementById("miniLeaderboard").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    // Sidebar category tags filter the feed
    document.querySelectorAll(".tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        e.preventDefault();
        Feed.setCategory(tag.textContent.trim());
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Logo goes home
    document.querySelector(".logo").addEventListener("click", (e) => {
      e.preventDefault();
      Feed.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  return { init };
})();

/* ---------- SIDEBAR WIDGETS ---------- */
const Sidebar = (() => {
  async function init() {
    const ol = document.getElementById("miniLeaderboard");
    const board = await MockAPI.getLeaderboard();
    ol.innerHTML = board
      .map(
        (u, i) => `
        <li>
          <span class="rank ${i === 0 ? "rank--gold" : ""}">${i + 1}</span>
          <span class="avatar" aria-hidden="true">${u.name[0].toUpperCase()}</span>
          <span>@${u.name}</span>
          <span class="points">${u.points}</span>
        </li>`
      )
      .join("");
  }
  return { init };
})();

/* ---------- MOBILE NAV ---------- */
const MobileNav = (() => {
  let btn, nav;
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }
  function init() {
    btn = document.getElementById("mobileMenuBtn");
    nav = document.getElementById("mobileNav");
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }
  return { init, closeMenu };
})();

/* ---------- BOOT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  Theme.init();
  Feed.init();
  Detail.init();
  Comments.init();
  Search.init();
  Create.init();
  Nav.init();
  Sidebar.init();
  MobileNav.init();
});
