# TypeScript conventions evaluation

Date: 14 November 2026. Scope: the standalone conventions reference and its boundaries with the
five existing coding workflows. Research provenance is in
[source research and design](typescript-conventions-research.md).

## Instruction evaluation

A fresh-context subagent read the new skill and nine references, then all five existing skill
entries. It received task scenarios and constraints without the expected answers. It did not
edit files or run an installed skill. These are observed instruction-review decisions, not
measurements of production task success or automatic skill selection.

| Scenario                                                               | Observed decision                                                                                                                                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Add an option in a compiled Node ESM package with different formatting | Effective local formatting wins; import specifiers and export/declaration semantics follow the real build; raw/resolved types and falsy values stay distinct.                        |
| Review JSON assertions, async `forEach` and a releasing `finally`      | Establish the validation owner; assertions add no runtime checks; `forEach` does not await callbacks; keep `return await` when resource lifetime requires settlement before release. |
| Define conventions for a worker without Node globals                   | Use the actual runtime's globals and injected environment representation; no `process` global is required.                                                                           |
| Hygiene review with the conventions reference active                   | Hygiene retains scope, read-only behavior, findings and verification; no extra convention-review phase or standards document.                                                        |

The initial review identified generic cohesion/helper-extraction advice already owned by the
existing workflows. Those passages were removed. The formatting reference was clarified so
applying versus checking formatting follows the active workflow's write permissions. The five
existing skill directories were not modified.

The final instruction review found no remaining material workflow or generic-principle
duplication. A search of the installable directory found none of the inspiration project names
or links. A malformed Markdown table row was corrected after the first full check reported it.

## Example checks

All 22 fenced TypeScript blocks were extracted into temporary modules. The two-file import
example was preserved as `contracts.ts` and `consumer.ts`; other blocks were isolated modules.
The harness supplied no schema or framework dependency. It compiled with the repository's
TypeScript 7.0.2 and executed emitted JavaScript under Node 24.19.0.

Compiler options included `strict`, ES2022, NodeNext module/resolution, DOM declarations for
the `URL` example, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`
and `noUnusedParameters`. DOM declarations here enable an example API type; they are not a
recommended project-wide server configuration.

Runtime assertions covered valid and rejected import configuration, canonical-mode membership,
union-state rendering, literal inference output, preserved `false`/`0`/empty strings,
environment boolean parsing, layer precedence, error-code narrowing, sequential operations,
lease release after settlement on success and failure, and aggregate result order.

| Command                                                                                                                                                                               | Result                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec tsc --project /tmp/typescript-conventions-research.jw0Beu/examples/tsconfig.json`                                                                                          | Passed for all 22 blocks, including the paired Node ESM type-import example.                                            |
| `node --input-type=module` with the temporary inline assertion harness                                                                                                                | Passed the described runtime contracts.                                                                                 |
| `/tmp/typescript-conventions-research.jw0Beu/validation-env/bin/python /Users/remihuigen/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/typescript-conventions` | Passed: skill frontmatter and name validation. PyYAML was installed only in the temporary validation environment.       |
| `pnpm format`                                                                                                                                                                         | Passed.                                                                                                                 |
| `pnpm check`                                                                                                                                                                          | Passed: all gates; repository validation 997 passed, 0 failed, 5 skipped; tooling tests 50 passed, 0 failed, 0 skipped. |

Temporary extraction/assertion scaffolding is not repository tooling or a shipped dependency.
These checks validate examples in one compiler/runtime combination; they do not establish
every target compiler, platform or toolchain. The skill directs agents to installed-version
and runtime evidence for such decisions.

## Repository and host boundaries

The full repository gate is `pnpm check`: reference drift, formatting, Markdown/TypeScript
lint, type checking, content/inventory validation and tooling tests. The five skipped validations
are existing shared plugin-source links, checked in their installed copies instead. No new skill
resource check was skipped. These checks do not execute the coding workflows.

No upstream package builds or test suites were run. No skill was installed or uploaded to a
host, and no workspace policy or existing agent dependency was changed. Installation, explicit
and implicit activation, co-installed selection and installed reference loading remain
unverified for ChatGPT, Codex and Claude. The instruction simulation does not substitute for
those checks.

The skill uses the repository-required `metadata.agents: []`, which extends the standard
string-valued metadata contract. Check host acceptance through the chosen installation route,
including the bundled references and optional presentation metadata, before claiming runtime
support. See [creating skills](creating-skills.md) for that route.
