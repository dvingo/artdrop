![Alt text](/artdrop-screenshot.png?raw=true "Screenshot")

Artdrop
=======

Artdrop React App

# Setup

Clone the repo.
Run:
```bash
npm i
npm start
```

# Running Tests

Run the following two commands:
```bash
./scripts/compile_tests.sh; mocha test-build/tests.js
```

When developing tests you can have them both watch for changes while you code:
```bash
./scripts/compile_tests.sh --watch
mocha test-build/tests.js --watch
```
