# QORVIA

Learn beyond limits. QORVIA is a browser-based learning MVP for English vocabulary and grammar, IELTS and SAT practice, and daily study.

## Run locally

Open PowerShell in the QORVIA folder with Node.js 22.13 or newer and run:

```powershell
npm.cmd start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in a modern browser. You can also run `node server.mjs` directly. If the port is busy, run `npm.cmd start -- 4174` and open the printed address. The server uses Node.js built-in modules, so it runs without installing packages.

## Accounts

Open [Sign up](http://127.0.0.1:4173/signup.html) through the Node server to create a username and password. QORVIA signs you in after registration. Later, use **Log in** and sign out from **Profile**. Guest study is available from the homepage and both account pages.

The Node server stores salted password hashes and sessions in a private SQLite database. On Windows, its default location is `%LOCALAPPDATA%\QORVIA\accounts.sqlite`. Use `QORVIA_ACCOUNTS_FILE` to select another database path. Guest progress and each account's progress are kept in separate storage records in the current browser. The account forms use usernames, so they require no email address.

## Project files

| Page | HTML entry point | JavaScript | Course data |
| --- | --- | --- | --- |
| Home | [index.html](index.html) | [js/app.js](js/app.js) | — |
| Log in and sign up | [login.html](login.html), [signup.html](signup.html) | [js/auth-page.js](js/auth-page.js), [js/auth.js](js/auth.js) | Local account database |
| Dashboard | [dashboard.html](dashboard.html) | [js/dashboard.js](js/dashboard.js) | Vocabulary and grammar data |
| Vocabulary | [vocabulary.html](vocabulary.html) | [js/vocabulary.js](js/vocabulary.js) | [data/vocabulary.js](data/vocabulary.js) |
| Grammar | [grammar.html](grammar.html) | [js/grammar.js](js/grammar.js) | [data/grammar.js](data/grammar.js) |
| IELTS preparation | [ielts.html](ielts.html) | [js/ielts.js](js/ielts.js) | [data/ielts.js](data/ielts.js) |
| SAT preparation | [sat.html](sat.html) | [js/sat.js](js/sat.js) | [data/sat.js](data/sat.js) |
| Daily Challenge | [challenge.html](challenge.html) | [js/challenge.js](js/challenge.js) | [data/challenge.js](data/challenge.js) |
| Progress & Analytics | [progress.html](progress.html) | [js/progress.js](js/progress.js) | Browser learning history |
| Profile | [profile.html](profile.html) | [js/profile.js](js/profile.js) | Browser profile settings |
| Pricing | [pricing.html](pricing.html) | [js/pricing.js](js/pricing.js) | Plan descriptions in the page module |

- [js/app.js](js/app.js) mounts the shared navigation and loads each page module.
- [js/ui.js](js/ui.js) contains icons, shared components, and multiple-choice grading.
- [js/store.js](js/store.js) saves learning state in `localStorage`. Progress belongs to the current browser and site address.
- [css/style.css](css/style.css) and [css/responsive.css](css/responsive.css) define the shared design. [css/exams.css](css/exams.css) and [css/learning.css](css/learning.css) style specialized layouts.
- [assets/qorvia.svg](assets/qorvia.svg) contains the QORVIA favicon. The bundled Inter typeface is distributed under its [SIL Open Font License](assets/fonts/OFL.txt).
- [server.mjs](server.mjs) serves the application locally and [auth-server.mjs](auth-server.mjs) handles accounts and sessions.

## Study and test

1. Set a display name, CEFR level, and daily goal in Profile.
2. Learn and save a vocabulary word, then try flashcards or choose a Quick Quiz format. Translate in either direction, complete sentences, or practice all three in a mixed round. Learned words are scheduled for review after one day, with longer intervals after successful due reviews.
3. Complete a grammar quiz, an IELTS practice activity, a SAT question set, and the Daily Challenge.
4. Reload the site and check the dashboard and analytics. The dashboard and weekly chart show estimated study minutes based on the activities completed.
5. Open the Pricing plan details. Premium and Pro are previews and checkout is unavailable.

Vocabulary translations are in Spanish. IELTS listening can use browser speech synthesis or the included transcripts. Writing and speaking use self-review checklists. Scores throughout the exam modules describe practice performance.

## Publish

For guest study, copy the HTML files and the `assets/`, `css/`, `data/`, and `js/` folders to a static website host. Use the same directory layout and set `index.html` as the entry point. Account sign-up and login use the local Node server. A real public contact address can replace the labeled sample address in `index.html` when available.
