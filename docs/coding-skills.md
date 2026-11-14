# Coding skills

Five standalone skills help deliver and maintain the simplest sufficient implementation.
They adapt selected upstream workflows rather than installing the original overlapping skills.
The content is English and tool-neutral; no framework, test runner, external app or companion
skill is required. A coding host must provide access to the relevant source and checks, plus
editing capability for implementation and cleanup.

## Choose a skill

| Request                                                    | Skill                                                         | Result                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| Implement a feature or fix; choose a design or dependency. | [implement-simply](../skills/implement-simply/SKILL.md)       | Complete focused implementation and proportionate verification. |
| Find unnecessary complexity in an area or change.          | [review-code-bloat](../skills/review-code-bloat/SKILL.md)     | Read-only findings about necessity and supported removal/reuse. |
| Review structure and maintainability.                      | [review-code-hygiene](../skills/review-code-hygiene/SKILL.md) | Read-only findings about concrete maintenance costs.            |
| Assess tests, including only those added by an agent.      | [review-test-value](../skills/review-test-value/SKILL.md)     | Keep, improve, consolidate or remove recommendations.           |
| Apply findings or clean up a named area.                   | [clean-code](../skills/clean-code/SKILL.md)                   | Scoped changes, affected-code updates and verification.         |

Descriptions support natural-language discovery and explicit invocation. Implementation is
intended to be reachable during coding; reviewer triggers ask for a review rather than
imposing one on every change. Cleanup consumes the current authorization and needs no fresh
audit or approval for ordinary in-scope refactoring. There is no orchestrator or lifecycle hook.

For a broad code-quality review, necessity and hygiene can both be relevant, with test-value
review when tests or supporting fixtures are in scope. Give each root cause one finding:
an unnecessary abstraction belongs to bloat; confusing responsibilities in a useful abstraction
belong to hygiene; a test asserting its own fixture belongs to test value. A self-supporting
production/test cluster is one bloat finding with supporting test evidence.

All reviewers use the same compact content: location and issue, evidence and cost, smallest
remedy, behavior impact, confidence/missing evidence, and relevant verification. Small findings
can combine these in prose. No quotas, mandatory report files or JSON schema are involved.
An empty review or no-change cleanup is valid.

## Testing policy

> Test primarily the intended workflow, not every possible misuse of its input. Tests should
> protect meaningful behavioral contracts and concrete risks, not implementation history or
> theoretical edge cases.

The goal is the smallest maintainable test suite that provides sufficient confidence, rather
than maximum coverage or the fewest possible tests. Implementation, test review and cleanup
carry the applicable decisions independently:

- A bug fix does not automatically require a permanent regression test, especially before
  the first release. Decide from the protection gap and the value of retaining the case.
- Prefer improving existing tests over redundant new cases, excessive parameterization and
  implementation-specific assertions.
- Use real integration or E2E tests where mocks cannot establish the actual runtime contract.
  A mocked outbound payload can still protect application behavior; it cannot establish real
  framework, SDK or persistence wiring by itself.
- Keep rejection and failure cases justified by supported contracts or concrete risks.
- Explicit current requirements can supersede historical test expectations. An inferred
  preference cannot authorize changing the contract.

This policy is supplied by the maintainer. It governs the selected upstream material, including
examples that would otherwise prescribe a new regression test for every fix.

## Source research and selection

Consulted 14 November 2026. Revisions below are the branch heads resolved that day; all source
links are pinned to those commits, rather than relying on moving branch links. Full upstream
skills and relevant linked references were read. Root license files were inspected, and
complete repository trees were checked where no license file was discoverable.

| Source and pinned revision                                                                                                                                                                                | Retained and destination                                                                                                                                                     | Rewritten or omitted                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ponytail](https://github.com/DietrichGebert/ponytail/blob/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills/ponytail/SKILL.md), `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846`                                 | Reuse order, complete task scope, affected callers and preserving moved validation → implementation.                                                                         | Persona, persistent levels, prescribed sign-off, line-count preference, blanket dependency/abstraction rules and automatic test creation.                     |
| [Karpathy Guidelines](https://github.com/multica-ai/andrej-karpathy-skills/blob/2c606141936f1eeef17fa3043a72095b4765b9c2/skills/karpathy-guidelines/SKILL.md), `2c606141936f1eeef17fa3043a72095b4765b9c2` | Scope discipline and observable completion informed the selection for implementation; no passages reproduced.                                                                | Stopping for every ambiguity, single-use-abstraction veto, arbitrary line limits and mandatory tests-first examples.                                          |
| [deslop](https://github.com/MrZoyo/deslop-GPT/blob/3913d8afeb18ed5c3cabc3ec39202ce02587ca87/skills/deslop/SKILL.md), `3913d8afeb18ed5c3cabc3ec39202ce02587ca87`                                           | Purpose outside a self-supporting cluster, reachability, preserved contracts and evidence quality → bloat; independent oracles and distinct failure protection → test value. | Its priority ordering, apply/deep modes, negative-change budget and routine evidence accounting. Confidence is kept separate from risk and importance.        |
| [Vinta's overengineering review](https://github.com/vinta/hal-9000/blob/7a8b22047fd10080c763acb8a896db5c8478f9f9/skills/fuck-over-engineering/SKILL.md), `7a8b22047fd10080c763acb8a896db5c8478f9f9`       | Concrete removal/reuse candidates, dynamic consumers, external exports and version-checked alternatives → bloat.                                                             | Whole-tree default, automatic delegation, editing and selection UI, net-line targets and caller-count verdicts.                                               |
| [Sentry code-simplifier](https://github.com/getsentry/skills/blob/e94f22214528d69899d09c627b3315ddc3544816/skills/code-simplifier/SKILL.md), `e94f22214528d69899d09c627b3315ddc3544816`                   | Clarity over compression, cohesion, useful abstractions, names and behavior preservation → hygiene and cleanup.                                                              | React and function-style rules, persona, automatic execution during review and aesthetic-only recommendations.                                                |
| [remove-tautological-tests](https://github.com/brandhaug/skills/blob/9cb193614af39847d80ab687ef3a8de01841632e/remove-tautological-tests/SKILL.md), `9cb193614af39847d80ab687ef3a8de01841632e`             | Compared oracle independence, interaction assertions and refactor fragility against deslop; no text or examples adapted.                                                     | Blanket snapshot judgments, mandatory replacements and edit workflow. No discoverable license; overlapping material was sourced from licensed deslop instead. |
| [Han refactor](https://github.com/testdouble/han/blob/abba73a773528905a8f3d15956029394746e5c7f/han-coding/skills/refactor/SKILL.md), `abba73a773528905a8f3d15956029394746e5c7f`                           | Named target, current findings, small named transformations, behavior preservation and recoverability → cleanup.                                                             | Claude-only configuration/scripts, mandatory full suite after each step, tests as the only verification route and stopping on unrelated failures.             |
| [antfu-simplify](https://github.com/antfu/skills/blob/d524ed287eef22757297827ce42e3cad88abd20c/skills/antfu-simplify/SKILL.md), `d524ed287eef22757297827ce42e3cad88abd20c`                                | Stated outcome, ablation, derived state/types and general-rule fixes → the five skills in their existing roles.                                                              | Caller/repetition thresholds, type-only runtime guarantees, test pass/fail as proof, and mandatory reports or verification after every deletion.              |

The deslop comparison included its
[test-smells](https://github.com/MrZoyo/deslop-GPT/blob/3913d8afeb18ed5c3cabc3ec39202ce02587ca87/skills/deslop/references/test-smells.md),
[code-smells](https://github.com/MrZoyo/deslop-GPT/blob/3913d8afeb18ed5c3cabc3ec39202ce02587ca87/skills/deslop/references/code-smells.md),
[verification-and-trust](https://github.com/MrZoyo/deslop-GPT/blob/3913d8afeb18ed5c3cabc3ec39202ce02587ca87/skills/deslop/references/verification-and-trust.md)
and [evidence-and-reachability](https://github.com/MrZoyo/deslop-GPT/blob/3913d8afeb18ed5c3cabc3ec39202ce02587ca87/skills/deslop/references/evidence-and-reachability.md)
references. These supplied the important contrasts: same-process persistence can have an
independent failure domain; public exports can have outside consumers; endpoint unit tests
can miss a broken edge; removing a redundant test does not retire production behavior.

Han's [refactoring discipline](https://github.com/testdouble/han/blob/abba73a773528905a8f3d15956029394746e5c7f/han-coding/skills/refactor/references/refactoring-discipline.md)
informed small transformations and the distinction between characterization and correctness.
Its assertion that only tests can support refactoring was not carried over: type checking,
caller analysis and focused runtime checks can be sufficient for a bounded transformation.

Sentry credits Anthropic's code-simplifier. The
[original agent](https://github.com/anthropics/claude-plugins-official/blob/b5b01ac4f889fec0c4c6bb89f27ca7c8574473f6/plugins/code-simplifier/agents/code-simplifier.md)
and its package license were inspected for attribution. Its proactive cleanup instruction was
not carried into the read-only reviewer or made an automatic post-implementation stage.

## antfu-simplify assessment

The full skill was inspected at the revision above on 14 November 2026, including its hard
rules, workflow, ablation table, keep/cut criteria, smell list and report example. Its declared
skill version is `2026.10.31`. The skill directory contains only `SKILL.md`; the repository
[LICENSE.md](https://github.com/antfu/skills/blob/d524ed287eef22757297827ce42e3cad88abd20c/LICENSE.md)
supplies the MIT grant and Anthony Fu's copyright notice.

The strongest addition is ablation: make a mechanism's contribution explicit by considering
its removal, inlining or merging. Existing skills already required a present purpose and
small refactorings; this adds a concrete way to compare simpler alternatives. Role boundaries
remain intact: reviewers reason without edits, implementation checks new mechanisms, and
cleanup can use safe reversible local experiments.

| Source mechanism                                                                           | Adaptation and reason                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| One-sentence goal and a bounded diff                                                       | Implementation, bloat review and cleanup use a stated outcome as the yardstick. PR/change cleanup stays within changed code and necessary dependent updates. A directly named module still permits module-level work.                            |
| Base selection and surrounding context                                                     | Existing actual-comparison-base and caller inspection remain. The PR target can differ from the repository default, so the source's default-branch example is not prescribed.                                                                    |
| Inventory helpers, options, branches, types, files and dependencies                        | Bloat review accounts for mechanisms introduced by the change; implementation and cleanup check remaining purpose. An inventory can remain working reasoning, without a mandatory report.                                                        |
| Remove, inline or merge and verify                                                         | Bloat uses a read-only counterfactual; cleanup can try a reversible local cut and check the affected contract. A green check that does not exercise the risk is insufficient evidence.                                                           |
| A failed cut proves the original piece necessary                                           | Rejected as a conclusion. Failure may expose a required behavior, an implementation-coupled test, or a bad transformation. Diagnose the cause and restore unsafe cuts; a different simple design may still preserve the contract.                |
| Helpers with two callers, extraction at the third repetition, abstractions that save lines | Replaced with current responsibility, domain meaning, lifecycle and change-cost criteria. Counts can suggest investigation but cannot decide necessity or readability.                                                                           |
| Infer or derive repeated types                                                             | Reuse authoritative type knowledge where it is genuinely shared. Preserve independent domain, wire and public contracts where derivation would create coupling or obscure meaning. Export status alone is not a verdict.                         |
| State, flags or caches derivable from existing data                                        | Added to bloat review and implementation, with hygiene checks for conflicting sources of truth. Preserve intentional snapshots, reactive semantics, lifetimes and concrete performance/resource roles.                                           |
| General rule rather than a bug-report literal                                              | Implementation fixes the cause across the supported input class; cleanup consolidates only where a current contract establishes the rule. Preserve genuine exceptions and avoid speculative new supported cases.                                 |
| Real edge cases and robust behavior                                                        | Existing contract/risk checks remain, including runtime validation, concurrency, cleanup and error propagation. TypeScript types alone do not validate external data; robustness does not mandate every possible misuse test.                    |
| Similar paths and duplicated logic                                                         | Consolidate shared domain knowledge while preserving supported differences, errors and side-effect ordering. Similar syntax can belong to independently changing responsibilities.                                                               |
| Remove a test and see what is unprotected                                                  | Test review asks which plausible regression becomes undetected. Remaining tests passing does not establish that protection survived. Existing preference for improving tests and using real runtime checks where mocks are insufficient remains. |
| Checks after each batch and a cut/keep table with diff statistics                          | Keep proportionate focused verification and required final checks. Explain non-obvious retention when useful; compulsory typecheck/lint/test runs per cut, tables and line-reduction targets are omitted.                                        |
| Match style, retain useful comments, avoid unrelated changes and commits                   | Existing repository-convention, comment-purpose, scope and authorization rules already cover these. Their meaning is retained without duplicating another workflow.                                                                              |

No dependency on antfu's other skills, tooling or instructions is introduced. The two existing
optional reference files remain sufficient; specialized state/type evidence extends bloat's
existing reference rather than creating another prerequisite.

## Licensing and independent distribution

Ponytail, deslop, Vinta, Han and antfu-simplify include MIT license grants and copyright notices. Karpathy's
frontmatter and README declare MIT but provide no separate license file or copyright notice;
its general ideas were compared without reproducing passages. The brandhaug tree has no
discoverable license declaration or file. Its text and examples are excluded from adaptation.

Sentry and Anthropic's code-simplifier package use Apache-2.0. Sentry's license carries
Copyright 2025 Functional Software, Inc. dba Sentry. Hygiene and cleanup combine MIT and
Apache-2.0 material after the antfu adaptation; the other three coding skills use MIT.

Each independently distributable skill includes its own `NOTICES.md` with pinned source links,
changes made and complete applicable license files. Required terms travel inside the skill's
directory; repository-only research links are not runtime dependencies. Keep these notices
when copying or uploading an individual skill.

## Packaging and compatibility

These are standalone sources under `skills/`, with `metadata.agents: []`: no workspace agent
dependencies, plugin releases or catalog entries change. Upload or install them through the
chosen host's supported route. They are not activated by adding these files to this repository.
See [creating skills](creating-skills.md) for the repository route and [evaluation status](coding-skills-evaluation.md)
for what has and has not been verified.

The [Agent Skills specification](https://agentskills.io/specification), consulted
14 November 2026, defines the name/description fields, optional license field, skill-local
resources and string-to-string metadata. The required consumer array here is a repository
extension, as documented in the authoring guide; host acceptance of that array is unverified.
No claim of ChatGPT, Codex or Claude installation, implicit activation or runtime compatibility
is made from passing repository checks. No host-specific frontmatter, lifecycle hooks, model
names or tool allowlists were added. Actual task verification uses each target repository's
commands rather than prescribing a runtime or test framework.

The existing `code-documentation` skill was inspected because it advertises inline comments
and JSDoc as well as whole-project documentation. The new skills keep incidental comment
corrections within coding work and reserve broader documentation workflows for separately
requested deliverables. Its trigger and instructions remain unchanged; these new skills do
not require it as a dependency. Co-installed selection behavior remains part of host testing.
