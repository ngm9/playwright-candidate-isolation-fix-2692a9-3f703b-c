# Playwright Candidate Isolation Fix

## Task Overview

The HR recruiting team at TalentBridge relies on an automated test suite to verify that candidate records appear correctly in the recruiting dashboard. Recently, the QA team noticed that the `candidate list shows Jamie Lee` test fails intermittently — but only when the full spec is run, not when that test is executed alone. The root cause is that both tests in `tests/candidates.spec.ts` share a single `page` object created in `beforeAll`, meaning actions in one test (archiving a candidate) silently corrupt the state seen by the next test. This is unacceptable because it produces false failures in CI, erodes team confidence in the suite, and hides real regressions behind noise.

---

## Objectives

- Replace the `beforeAll` hook with a `beforeEach` hook so that each test starts with a fresh browser page and no leftover state from a previous test.
- Before each test, use Playwright's built-in `request` fixture to call `POST /api/test/candidates` with the body `{ "name": "Jamie Lee" }` to seed a known candidate into the app.
- Update the candidate list test to assert that a row containing the text **"Jamie Lee"** is visible, using a user-facing locator rather than a brittle CSS class or index-based selector.
- Both tests must pass consistently when run together with `npx playwright test`, regardless of execution order.
- No `waitForTimeout` or hard-coded sleeps should remain in the spec after your changes.

---

## Helpful Tips

- Consider what `beforeAll` actually does to state across tests in the same `describe` block — ask yourself whether a page created once can ever reflect truly clean state for a second test that runs after the first has mutated the UI.
- Think about what Playwright's `request` fixture gives you without needing to import anything extra, and how you would use it inside a `beforeEach` to call an API before the browser page is involved.
- Consider how you would navigate the page **after** seeding the data, so the browser reflects the freshly created candidate.
- Explore what user-facing locators Playwright provides for finding an element by the text it displays to the user, and prefer those over selectors tied to DOM structure.
- Think about what "test isolation" means in practice: if you deleted all candidates in one test, would the next test still have the data it needs?
- Review how `beforeEach` differs from `beforeAll` in terms of when it runs and what it sets up for each individual test.
- Consider whether closing the page or context at the end of each test is necessary, or whether Playwright handles that for you with certain patterns.

---

## How to Verify

- Run the full spec file with `npx playwright test tests/candidates.spec.ts` — both tests must pass on the first run.
- Run the spec at least three consecutive times to confirm there is no flakiness related to shared state.
- Confirm that the spec no longer contains `beforeAll` for page or context setup.
- Confirm that `POST /api/test/candidates` is called via Playwright's `request` fixture inside `beforeEach`, not manually or via a third-party HTTP library.
- Confirm that the list assertion targets the candidate by their visible name ("Jamie Lee") using a user-facing locator, not by row index or a CSS class.
- Confirm that no `waitForTimeout` or `setTimeout`-based delays exist anywhere in the spec.
- Swap the order of the two `test(...)` blocks manually and re-run — both must still pass, proving the fix is order-independent.
