# Coding skills evaluation

Date: 14 November 2026. Scope: initial authoring of the five standalone coding skills.

## Author walkthrough

The following is a manual inspection of instruction paths against concrete scenarios. It
checks whether the written contracts cover the intended decision and its false-positive
control. These are author walkthrough results, not observed agent-task outcomes or claims
that an installed host follows the instructions.

| Scenario and supplied context                                                                                                                                                                                                                                     | Expected decision and owner                                                                                   | Instruction inspection result                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A TypeScript formatter must join existing labels with a fixed separator; the installed shared helper already does exactly that. No providers or alternate separators are required.                                                                                | Implementation reuses the helper; no registry or configurable layer.                                          | Covered by the direct-path order and present-purpose criterion in `implement-simply`.                                                                                     |
| A private helper has no imports, registrations, side effects or public export; the local graph and relevant history are available. A control file is a Nuxt convention-discovered route, and another is a registered Directus hook.                               | Bloat identifies the private orphan; preserves both discovered entry points.                                  | Reachability is required in the core; the evidence reference explicitly names both discovery controls. Actual framework behavior still needs target-project verification. |
| Every caller reaches a private helper immediately after a verified parser transformation, with no mutation in between; a later branch repeats the same ruled-out check. A separate public request handler merely annotates external input with a TypeScript type. | Bloat can identify the redundant internal branch while preserving runtime validation at the handler.          | Core and evidence reference distinguish a verified invariant from a type annotation and require checking every entry path.                                                |
| A Directus-style hook transforms data, decides eligibility and composes mail in one mixed flow; changes to mail copy require reading the eligibility logic. A control function is short and cohesive.                                                             | Hygiene suggests a concrete responsibility boundary; leaves the control intact.                               | Cohesion criteria require distinct reasons to change and a maintenance consequence; size alone is only a clue.                                                            |
| One test constructs a fake object and compares its value with the same setup value, never invoking production. A control calls a real parser and asserts one externally specified rejection.                                                                      | Test value recommends removing the setup-only assertion and keeping the short rejection test.                 | Oracle/path tracing and the fixture contrast cover the first; the explicit rejection contrast covers the control.                                                         |
| Three cases traverse the same ordinary success path and assert the same contract-derived result; another case checks malformed-input rejection.                                                                                                                   | Test value can consolidate redundant success evidence while retaining rejection.                              | Duplicate decisions require matching input class, path, result and failure mode; rejection protection is explicit.                                                        |
| A mail adapter is real but its external send operation is faked; the assertion checks the specified recipient and payload. Another test verifies the order of unrelated private helpers.                                                                          | Keep the boundary interaction; consider improving the internal sequence assertion.                            | Pattern reference distinguishes externally meaningful payload/order contracts from internal call-graph transcription.                                                     |
| A comment explains an upstream transaction ordering constraint; another claims a now-removed fallback still runs.                                                                                                                                                 | Hygiene preserves the constraint and flags stale text; cleanup corrects only the affected statement.          | Comments criteria preserve reasons and invariants. Incidental corrections stay in coding scope.                                                                           |
| A published export has no local consumers and external usage is unknown. An already clear local module has no concrete issue.                                                                                                                                     | Bloat preserves the export under uncertainty; reviewers can return no findings.                               | External consumers and missing evidence are explicit; no finding quotas or compulsory refactor.                                                                           |
| Older findings propose renaming a helper, removing uncertain compatibility support and simplifying a proven equivalent branch. The current request authorizes cleanup only.                                                                                       | Cleanup rechecks evidence, applies justified changes, preserves compatibility and continues independent work. | Classification separates equivalent transformations, proven redundancy, supported-behavior changes and unresolved items.                                                  |
| A serializer and reader pass a newly generated round trip after a refactor; an existing supported stored record uses the previous shape.                                                                                                                          | Cleanup checks the pre-change record before claiming compatibility.                                           | Cleanup explicitly warns about shared writer/reader regressions and requires supported examples.                                                                          |
| Tests read an untracked local artifact or write generated output into the checkout; an optional SDK skip also hides fake-only tests.                                                                                                                              | Test value identifies execution and fixture reliability problems without expanding into a new test framework. | Collection and support inspection plus artifact/skip contrasts cover both; read-only execution must use temporary/no-write options.                                       |

## Testing-policy walkthrough

The maintainer's testing mantra and requirement-versus-history rule were added after the
initial source comparison. The following are additional author inspections of the written
rules, with the same limitation: no fresh-agent or host behavior is measured.

| Scenario and supplied context                                                                                                                                                                                | Expected decision                                                                                                        | Instruction inspection result                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The current request explicitly changes a specified default; an old test expects the previous default. A control request only asks for cleanup and says nothing about changing defaults.                      | Update the obsolete expectation for the explicit requirement; preserve the control's behavior.                           | All five skill definitions distinguish an explicit current requirement from an inferred preference.                                                                  |
| Before the first release, a small bug is reproduced, fixed and already covered by an improved existing workflow test; a proposed additional case repeats that protection.                                    | Confirm the fix and retain the improved workflow test without automatically adding a permanent regression case.          | Implementation, test review and cleanup explicitly make permanent regression tests a value decision, including before first release.                                 |
| A parser's intended workflow and specified rejection are covered; a proposed matrix adds many hypothetical input-misuse permutations without a concrete risk.                                                | Preserve the meaningful workflow and rejection cases; decline redundant permutations.                                    | Workflow-first criteria and the misuse-permutation contrast distinguish supported failure contracts from theoretical cases.                                          |
| Mocked SDK calls return success, but the task requires confidence that real serialization and framework registration work together. A control test only checks the application's specified outbound payload. | Use a focused real integration or E2E test for the runtime contract; keep useful payload assertions where mocks suffice. | Implementation, hygiene verification, test review and cleanup name the limits of mocks; the test-pattern reference distinguishes payload choice from runtime wiring. |
| A short low-level test catches a known rounding risk that the normal E2E flow misses.                                                                                                                        | Keep the useful test despite a preference for a smaller suite.                                                           | The goal is sufficient confidence with a maintainable suite, and the existing numerical-test contrast preserves distinct failure protection.                         |

The walkthroughs found the intended ownership and testing-policy decisions in the written instructions. They do
not measure model reliability, comprehension, false-positive rates or improvement over a
baseline. In particular, the shared documentation skill's broad description could still
affect selection in a co-installed host; no existing skill was changed to pre-empt that risk.

## Local verification

Repository validation checks frontmatter, exact skill names, consumer declarations, inventory
coverage and skill-local resource links. Formatting, linting, type checking and the repository's
validator tests run through `pnpm check`. These checks do not execute the skill workflows.

| Command                                   | Result                                                                                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm format`                             | Passed.                                                                                                                                                        |
| `pnpm check`                              | Passed: reference drift, formatting, Markdown/TypeScript lint, type checking, repository validation and tests.                                                 |
| Repository validation within `pnpm check` | 976 passed, 0 failed, 5 skipped. The skips are shared plugin source links, checked in their installed copies instead; the new skill-local links are validated. |
| Tests within `pnpm check`                 | 50 passed, 0 failed, 0 skipped. These exercise repository tooling, not coding-skill behavior.                                                                  |

## Runtime evaluation and pilot status

Not run: fresh-agent scenario comparisons, installation and implicit/explicit activation,
uploaded resource loading, or bounded Nuxt and Directus pilots. No target Nuxt/Directus
checkout or completed change was selected in this authoring task. The supplied plan's rollout
and workspace-policy proposals are not treated as authorization to activate skills or change
repository guidance.

Before claiming a host is supported, install each skill with its local resources and notices
through that host's supported route. Check metadata acceptance, direct and natural-language
selection, reviewer read-only behavior and reference loading. Compare fresh runs with and
without the skill using task/code context alone; keep expected decisions with the evaluator.
Repeat inconsistent cases and inspect all changes for behavior preservation, false positives
and proportionate verification.

Use two bounded completed changes, including a Nuxt area and a Directus area, for the first
reviewer pilot. Then exercise implementation on one small feature and cleanup on justified
findings. Record the host and skill revision, actual findings/diffs, checks, and any issue
that blocked activation. Deletion of a real entry point or required boundary validation is
a blocking false positive. Keep this a small reviewed record rather than a new evaluation
service or mandatory coding workflow.
