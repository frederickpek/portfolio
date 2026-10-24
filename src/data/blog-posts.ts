import type { BlogPost } from '../types/blog'

export const blogPosts: BlogPost[] = [
  {
    slug: 'experience-with-beli',
    title: 'My experience with the Beli app',
    publishedAt: '2026-10-24',
    excerpt:
      'Why I do not have one comfort food — and how Beli, binary-search rankings, and building Savor changed how I eat in Singapore.',
    coverImage: 'blog/beli/cover.webp',
    coverAlt: 'Friends sharing food at a restaurant',
    coverFit: 'cover',
    body: [],
    blocks: [
      {
        type: 'p',
        text: 'I was recently asked to name a comfort food in a team meeting of about fifteen people. Everyone had an answer — ice cream, lasagne, the usual suspects. I did not. I could not pick one dish without feeling like I was lying. I am always chasing the next meal, the next combination, the next novel taste to savor. That is probably why Beli stuck for me: it treats eating as an ongoing ranking problem, not a single nostalgic anchor.',
      },
      {
        type: 'h2',
        text: 'The Beli app',
      },
      {
        type: 'figure',
        src: 'blog/beli/in-app-experience.png',
        alt: 'Beli in-app experience: lists, ratings, and rankings',
      },
      {
        type: 'p',
        text: 'Beli helps you track, share, and discover restaurants around the world. You keep collections of places you have been and rate them — complementary to Google Maps, but social. You follow people, see how their palate lines up with yours, and decide whose scores you trust. It is a specialty app, so the crowd skews foodie; that alone makes the signal feel sharper than a generic five-star blob.',
      },
      {
        type: 'p',
        text: 'The feed is the habit loop: friends rate somewhere new, you skim their score, notes, and photos, and bookmark it for later if it looks promising. It is an embarrassingly easy way to find the next spot.',
      },
      {
        type: 'h2',
        text: 'The user experience',
      },
      {
        type: 'figure',
        src: 'blog/beli/rating-flow.jpg',
        alt: 'Beli step-by-step rating flow with this-or-that comparisons',
      },
      {
        type: 'p',
        text: 'The product orbits two journeys. First, look up a place — average rating, photos, what other people wrote. Second, log somewhere you just tried. The rating step is the clever part: you do not type a number. Beli walks you through something like a binary search against places you have already ranked, slotting the new meal into your list. The score ends up between its neighbors. I have not seen that pattern elsewhere, and it matches how I actually think — hard to assign an absolute score, easy to say “better than X, worse than Y.”',
      },
      {
        type: 'h2',
        text: 'Adoption in Singapore',
      },
      {
        type: 'p',
        text: 'Beli’s footprint here is still small — thousands of users, hundreds active daily, if I had to guess. That sounds thin, but the ratings I see line up with what I get on the ground more often than I expected. I hope more food-centric people show up so the long tail fills in.',
      },
      {
        type: 'p',
        text: 'What helps today is concentration, not scale. The people who bother to use Beli here tend to rate the trendier spots, the higher-end rooms, the places where the camera eats first — exactly the list I care about when I open a dedicated food app. Usage aligns with intent even if adoption is modest.',
      },
      {
        type: 'h2',
        text: 'Savor',
      },
      {
        type: 'p',
        text: 'Savor is my attempt to bring Beli’s ratings to a wider local audience. You can search almost every food place in Singapore, browse them on a map without pins disappearing when you zoom out — unlike Google Maps, where non-food clutter and density hide half the interesting spots. Hover what you want, open the card, move on.',
      },
      {
        type: 'p',
        text: 'It also ships weekly picks for different moods: date night (higher budget), cheap eats (strictly $), casual any-day draws with a minimum score floor — so you always have a shortlist for the week’s exploration.',
      },
      {
        type: 'h2',
        text: 'Rating statistics',
      },
      {
        type: 'figure',
        src: 'blog/beli/rating-stats.png',
        alt: 'Beli score distribution and medians by price and MICHELIN tier',
      },
      {
        type: 'p',
        text: 'The score distribution looks like a mild normal curve — mean around 7.5–8, which feels fair for a community that actually likes food. More interesting is how it shifts by price: medians generally climb as you move from $ to $$$$, which is what you would expect — better ingredients, service, ambience, the whole package.',
      },
      {
        type: 'p',
        text: 'The $$ tier dipping below $ is the fun part. Either hawker and casual $ spots punch above their price on value, especially with Gen Z still living in that scene, or a lot of $$ places are a bit pretentious and priced for rent as much as for flavor. My bet is both are true, and Beli’s aggregates just surface the tension. None of this replaces showing up — it gives you one more lens before you commit.',
      },
      {
        type: 'p',
        text: 'Beli fits how I eat: comparative, social, always looking for the next good meal. Savor is the local layer I wanted on top of the same data. If you are in Singapore and you care about where you eat, both are worth a look — one for keeping score with friends, one for seeing the whole map at once.',
      },
    ],
    links: {
      repoUrl: 'https://github.com/frederickpek/savor',
      demoUrl: 'https://frederickpek.github.io/savor/',
    },
  },
  {
    slug: 'vol-surfaces-and-smiles',
    title: 'Reading event risk on vol surfaces',
    publishedAt: '2026-10-17',
    excerpt:
      'A personal CBOE-backed dashboard for term structure and vol surfaces — built to see when earnings are priced rich before putting on credit spreads.',
    coverImage: 'showcase/observable/aapl-surface.png',
    coverAlt: 'AAPL implied volatility surface by expiry and delta',
    imageCaption:
      'Dark green marks a bump in implied vol for AAPL over that expiry, across delta levels. The kink fits event risk the market is placing around early November — after earnings on 2 Nov, with elevated vol still showing into the 6 Nov neighbourhood on this snapshot.',
    body: [
      'Options data for US equities does not come easy. Most broker apps hide chains behind a paywall, or show one strike at a time. I built Observable for myself: a place to see term structure and the vol surface without drowning in tables. The charts are meant to stay readable — enough structure that a newer options learner can follow what they are looking at, without turning into a terminal.',
      'How I use it in practice is narrow. I care whether vol looks expensive heading into earnings, especially when I am thinking about locking in credit spreads. The surface and term structure together answer a simple question: is the market already paying up for uncertainty in the window I would sell? If yes, that is when the visualization earns its keep.',
      'The data is CBOE’s end-of-day snapshot — a full cross-section per name, collected after the US close. That latency is fine for my monthly horizon; I am not scalping intraday vol. Each day’s grid is interpolated across expiries, strikes, and deltas: implied vol from mids with Black–Scholes, using the forward on the underlying so the surface is comparable slice to slice.',
      'I only host a small universe of tickers. Pulling and storing every US name would be costly on GitHub Pages, so I stick to names I trade often and that span the sectors I care about. That subset also keeps quality sane — illiquid strikes and wide bid–ask spreads would distort a surface, and these are liquid enough that I rarely fight that problem.',
      'Observable is not a signal engine. It is the picture I want before I commit to a spread: where vol bumps, where the term structure bends, and where dated event risk shows up as colour on the surface. That is the whole point of the tool.',
    ],
    links: {
      repoUrl: 'https://github.com/frederickpek/observable',
      demoUrl: 'https://frederickpek.github.io/observable/',
    },
  },
  {
    slug: 'ai-and-its-implications',
    title: 'How I think AI should be used',
    publishedAt: '2026-10-05',
    excerpt:
      'Same LLMs, wildly different outcomes — hike when it matters, verify when it counts, and do not forget how to work without the tool.',
    coverImage: 'blog/ai/cover.jpg',
    coverAlt: 'Bell curve meme — how people use AI',
    coverFit: 'cover',
    body: [],
    blocks: [
      {
        type: 'p',
        text: 'The smartest person you know probably uses AI. So does the least prepared. Same technology — very different results. When I say AI here, I mean the stuff most of us actually touch day to day: ChatGPT, Claude, Codex, Cursor, and the other large language models wired into our editors and browsers.',
      },
      {
        type: 'h2',
        text: 'Hiker and helicopter',
      },
      {
        type: 'p',
        text: 'Terence Tao uses a simple image: two people reach the same waterfall. One hikes — slow, tired, learns the terrain, and often finds things along the way they would never have seen from above. One flies in a helicopter — fast, clean photo, home for dinner. Same destination, very different trip. The hike can be more meaningful not just because it is hard, but because those side discoveries stick. AI is the helicopter for a lot of work now. That is fine when all you need is the photo. It is a problem when you needed the hike to build skill, judgment, or the ability to find your way back without the ride.',
      },
      {
        type: 'figure',
        src: 'blog/ai/terence-tao.jpg',
        alt: 'Terence Tao speaking in an interview',
        caption: 'The paradox at the heart of AI and science | Terence Tao',
        captionHref: 'https://www.youtube.com/watch?v=svl_1upFpQo',
      },
      {
        type: 'h2',
        text: 'The same tool in different hands',
      },
      {
        type: 'p',
        text: 'Two people can paste the same prompt into the same model and walk away with opposite outcomes. One reads the answer, argues with it, checks the weird parts, and keeps only what survives. The other copy-pastes the first reply and ships it. Both “used AI.” Only one can explain what they submitted when someone asks a follow-up.',
      },
      {
        type: 'p',
        text: 'The model does not know which person you are. It answers with the same confidence either way. So the gap is not the subscription — it is what you do after the text appears.',
      },
      {
        type: 'h2',
        text: 'Thinking moved, not always lost',
      },
      {
        type: 'p',
        text: 'I used to spend a lot of time on research rabbit holes — especially on problems where I did not even know what I did not know. Learning a new library or stack could eat days of docs, forums, and dead ends. LLMs shrink that. Context around a topic is rarely the bottleneck anymore.',
      },
      {
        type: 'p',
        text: 'The question is not whether thinking moved, but whether something useful replaced it. For me, a lot of research time turned into implementation time — actually building what the task needed. That is a win. It is still a discovery process. When the model dumps context on you, you should question as you go — poke holes, ask “why this,” skip what you already trust — so you learn faster instead of nodding along.',
      },
      {
        type: 'h2',
        text: 'The verification gap',
      },
      {
        type: 'p',
        text: 'This is where AI use gets tested. How do you know the plan or code it proposed is actually valid for your problem? You need enough experience in your field to smell nonsense, and you need the habit of pushing back — make it explain steps, cite sources, run the edge cases, talk itself through objections until you are convinced. Never take the first answer on face value just because it reads well.',
      },
      {
        type: 'h2',
        text: 'The cost of borrowed intelligence',
      },
      {
        type: 'p',
        text: 'Use AI to empower your process, but do not let it replace your understanding along the way. Delegation is not free. Subscriptions change. Models get deprecated. Workflows built around one vendor’s quirks lose slack when pricing or behavior shifts.',
      },
      {
        type: 'p',
        text: 'I learned that the hard way. We hit a production issue after our team blew through its AI budget — pipelines burned tokens, dev keys stopped working because we were over cap. I was debugging at night without the crutch I had gotten used to: AI to search symptoms and draft reports for me. I still had to fix it by hand. Stark reminder that I need to stay fluent doing the work manually when the tool goes away.',
      },
      {
        type: 'h2',
        text: 'Summary',
      },
      {
        type: 'p',
        text: 'Yes — AI can often help in one good prompt. That does not mean you should be over-reliant on the output. Learn to question it, follow how it got to an answer, and check that the proposal is sound. You do not have to do all of that by hand. Prompt it back: explain, justify, walk me through the risky parts.',
      },
      {
        type: 'p',
        text: 'Over time you get faster at knowing what you can one-shot and what needs more care. You build a feel for what these models are good at, where they bluff, and how to verify before it costs you. That is how I think AI should be used: helicopter when speed is enough, hiker when the path is the point — and always keep shoes that work when the flight is cancelled.',
      },
    ],
  },

  {
    slug: 'claude-codex-and-cursor',
    title: 'My experiences with Claude, Codex, and Cursor',
    publishedAt: '2026-09-08',
    excerpt:
      'Early 2026 is when all three clicked for me — here is how Cursor, Codex, and Claude split my week, and why picking a forever winner stopped making sense.',
    coverImage: 'blog/ai-assistants-cover.svg',
    coverAlt: 'Cursor, Codex, and Claude',
    coverFit: 'cover',
    body: [],
    blocks: [
      {
        type: 'p',
        text: 'I started leaning on all three heavily in early 2026, when the models started to feel genuinely capable and noticeably less sloppy on everyday engineering work. This is not a benchmark — just how they landed in my habits after a year of bouncing between subscriptions.',
      },
      {
        type: 'h2',
        text: 'Cursor',
      },
      {
        type: 'p',
        text: 'Like a lot of people, my first LLM subscription was OpenAI — but my first coding assistant was Cursor, through a company plan back in 2025. That was my entry point. Cursor (and Composer in particular) felt exceedingly fast and lightweight: high-level prompts, tight edit loops, and enough accuracy that I could iterate on personal repos with confidence. It was stupid cheap at the time. The editor is a VS Code fork, so the muscle memory was instant, and Cursor was among the first IDEs that made “AI-native” feel normal. Great on-ramp, easy to live in. I still use it for personal projects today.',
      },
      {
        type: 'h2',
        text: 'Codex',
      },
      {
        type: 'p',
        text: 'Codex on the CLI was a solid, often cheaper alternative to Claude for code-shaped tasks — but it always felt half a step behind on the hard stuff. When OpenAI tried to outgun Anthropic, some of the models felt over-tuned and over-priced for what I got. These days ChatGPT is my daily pocket assistant: quick questions, drafts, random life admin. I keep Codex around for heavier reasoning, web search, and scraping when I do not want to open the IDE. I rarely use it as my primary coding surface anymore.',
      },
      {
        type: 'h2',
        text: 'Claude',
      },
      {
        type: 'p',
        text: 'Claude is the one that broke my brain in the best way. Once the Opus-class releases started landing, it really did feel like “we might all be redundant” for a minute — then the next generation showed up, and the goalposts moved again. The running joke in my head is that the solution to everything is to run it by Claude: production down, new feature, email you do not want to write, PM message you do not fully parse — paste the whole thing and go. The context window, the intuition on messy prompts, and the ecosystem of skills and connectors people publish make complex workflows feel reproducible instead of one-off hacks.',
      },
      {
        type: 'h2',
        text: 'So where does that leave me?',
      },
      {
        type: 'p',
        text: 'Cursor is still my default for personal code — fast, cheap, in the repo. Codex / ChatGPT is the price-conscious generalist and research tab. Claude is the high-ceiling option when the task is ambiguous or high stakes. That was the split for most of early 2026.',
      },
      {
        type: 'p',
        text: 'By mid 2026, the gap narrowed. All three are competitive; they copy each other’s features; configs and habits port more easily than the marketing wars suggest. The real question is not which tool is better — it is how comfortable you are piloting them: steering the output, catching the mistakes, and knowing when to take the wheel back.',
      },
    ],
  },
  {
    slug: 'trueshot-ratings-and-results',
    title: 'Trueshot: comparing League teams at a glance',
    publishedAt: '2026-08-24',
    excerpt:
      'LoL esports analytics for the metrics I actually check — composition, form, head-to-head history, Elo, and rough win probabilities before a match.',
    coverImage: 'showcase/trueshot/compare.png',
    coverAlt: 'Trueshot team comparison view',
    body: [],
    blocks: [
      {
        type: 'p',
        text: 'I built Trueshot to compare League of Legends teams quickly. Before a series I do not want to hop between wikis, VOD tags, and spreadsheets. I want one place for the metrics I care about: team composition trends, recent match history, direct head-to-head record, Elo, and a simple predicted win probability when two teams meet.',
      },
      {
        type: 'p',
        text: 'The site is built around that compare flow — pick two sides and see how they stack up on those dimensions. Elo is one input, not the whole story; the rest of the views exist because context matters as much as a single number.',
      },
      {
        type: 'h2',
        text: 'Elo calculation',
      },
      {
        type: 'figure',
        src: 'showcase/trueshot/elo.png',
        alt: 'Team Elo rankings over time',
      },
      {
        type: 'p',
        text: 'Under the hood, the rating layer tracks historical performance across the major leagues: every game in those circuits updates team Elo after the final. Over time that builds a long run of post-game ratings per team, which I use as a baseline for head-to-head win/loss probabilities when two names meet.',
      },
      {
        type: 'p',
        text: 'A few things I have learned using it — and why I treat the probability as a rough proxy, not a forecast.',
      },
      {
        type: 'p',
        text: 'Elos evolve mostly inside their region. LCK, LEC, LPL, and the others do not play each other often, so ratings drift independently. The weakest and strongest teams in different regions can look similar on paper even when one region is clearly stronger overall. International tournaments — especially Worlds — pull those numbers back toward something more comparable, but that correction is episodic.',
      },
      {
        type: 'p',
        text: 'The history spans roughly three to four years, so several Worlds cycles are in the mix. Still, each season spends most months in domestic play, so regional divergence builds again between globals. Roster changes, pick/ban meta, player–champion comfort, team compositions, fearless draft, and form on the day all sit outside what a plain Elo update sees.',
      },
      {
        type: 'p',
        text: 'So the Elo line and the win-probability readout are intentionally simple: a fast, honest sketch of strength from results alone. Trueshot is useful because it puts that sketch next to composition, history, and head-to-head — not because the number is oracle.',
      },
    ],
    links: {
      repoUrl: 'https://github.com/frederickpek/trueshot',
      demoUrl: 'https://frederickpek.github.io/trueshot',
    },
  },
  {
    slug: 'why-i-still-leetcode',
    title: 'Why I still LeetCode in this age of AI',
    publishedAt: '2026-07-14',
    excerpt:
      'Competitive programming was never just interview prep — and in a world where almost all shipped code is AI-assisted, I still grind to keep the muscle memory.',
    coverImage: 'blog/leetcode-cover.webp',
    coverAlt: 'LeetCode logo',
    coverFit: 'cover',
    body: [],
    blocks: [
      {
        type: 'p',
        text: 'I have always enjoyed competitive programming and writing algorithmic solutions. Before I knew it, getting a problem right could turn into a loop: submit, pass, instinctively hit “Next problem,” and start again. It is not only LeetCode — I solve on Kattis, CSES, Codeforces, and others. LeetCode is what pulled me in because you skip the ceremony: no custom input reading, no output formatting, just the idea.',
      },
      {
        type: 'p',
        text: 'That low friction is still why I open it on a quiet evening. The puzzle is the whole point.',
      },
      {
        type: 'h2',
        text: 'The era of AI',
      },
      {
        type: 'p',
        text: 'After AI showed up in daily engineering, ask anyone what share of production code they actually typed character by character. I would bet most honest answers land near “almost none of it” — and that is true for me too. The job shifted: more describing the problem, more diagnosing why the generated patch is wrong, more owning the architecture while the editor fills in the boilerplate.',
      },
      {
        type: 'p',
        text: 'That is a different shape of “engineer” than the one who lived in the iterate-compile-debug loop all day. You can manage your own stack and still rarely practice the tight feedback cycle of writing a solution from a blank file. I still LeetCode to stay in shape — partly because I like it, partly because I do not want that skill to dull. If I ever sit a coding interview again, I would rather not discover I had outsourced the part that matters.',
      },
    ],
  },]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
