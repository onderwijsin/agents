# TypeScript conventions: source research and design

## Contents

- [Research scope and method](#research-scope-and-method)
- [Directus seeder hook](#directus-seeder-hook)
- [Nuxt DevTools](#nuxt-devtools)
- [NuxtHub core](#nuxthub-core)
- [Cross-project synthesis](#cross-project-synthesis)
- [What defines a coding standard](#what-defines-a-coding-standard)
- [Boundary with the five coding skills](#boundary-with-the-five-coding-skills)
- [Packaging and validation](#packaging-and-validation)

## Research scope and method

Research date: 14 November 2026. The requested branch heads were resolved once and source
inspection used those immutable revisions. Sources were read through the GitHub connector;
temporary local copies supported cross-file inspection. All three complete repository trees
were enumerated. Seventy-eight selected files were retrieved across the requested packages,
their inherited configuration, repository guidance, representative tests and license files.
The analysis concentrated on architecture, public contracts, typed boundaries, configuration,
failure/lifecycle behavior and style. It did not execute or install the upstream projects.

| Requested source                                                                                                                                | Resolved revision                          | Selected files retrieved |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------ |
| [Seeder hook](https://github.com/onderwijsin/directus-extensions/tree/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook) | `ac34c45a1e7cc7499f08923882b83b34da2df6a1` | 27                       |
| [DevTools package](https://github.com/nuxt/devtools/tree/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools)                            | `d46936e89034ea26b49f061cf8ba8ec97b24c9ce` | 26                       |
| [NuxtHub core](https://github.com/nuxt-hub/core/tree/5772ded7da326afb5a737a05fdb69f9a4ef15f29)                                                  | `5772ded7da326afb5a737a05fdb69f9a4ef15f29` | 25                       |

Observations below identify what the inspected source does. Transfer recommendations are
synthesis, not claims that every file follows them or that the maintainers adopted a universal
standard. Tests supply evidence of intended contracts; their existence is not a reported pass.
The installable skill contains no references to these three inspiration projects. This report
retains the research provenance separately from the reusable instructions.

## Directus seeder hook

### Organization and execution flow

The package is a hook with a CLI-facing orchestration layer. Its source separates `commands/`,
`seeders/`, `services/`, `strategies/` and `lib/`. These directories express distinct roles rather
than a generic application scaffold:

1. `src/index.ts` establishes enablement and validated environment options, registers commands
   and attaches development-only extraction hooks.
2. Command handlers interpret CLI input, resolve effective configuration and own command-level
   reporting and exit behavior.
3. Seeding orchestration selects collections, establishes order and preflights relevant invariants.
4. Strategy implementations provide insert-missing, insert-update and full-idempotent behavior.
5. Service adapters translate these operations into Directus item/file services.

This division is visible in the [entry point](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/index.ts),
[seed command](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/commands/seedCommand.ts)
and [collection orchestration](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/lib/seedCollections.ts).

**Transfer:** separate registration, typed policy and provider translation when those roles exist.
The directory names themselves are not the convention. A smaller project can express the same
contracts with fewer files, and a feature-oriented project can place them together.

### Types and validation are tied to actual ownership

The [environment schema](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/env.schema.ts)
defines defaults, constrained choices and normalized lists and derives `SeederOptions` from Zod.
It consumes values after Directus's environment casting. That host-specific representation
matters: copying this parser into a raw `process.env` boundary would change the input contract.

The [consumer configuration resolver](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/seeders/resolveConfig.ts)
accepts unknown JSON, checks collection settings, resolves order and distinguishes absent optional
configuration from an explicitly supplied invalid file. Explicit CLI values override environment
values without losing deliberate `false` through truthy defaulting. Error wrapping retains the
cause and the configured filename.

The [configuration schema](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/seeders/config.schema.ts)
also demonstrates that shape validation is not evaluation: it describes supported query forms
without running filters or resolving database fields. It uses constrained recursive definitions
for a concrete external query contract, not a generic recursive-type exercise.

An important counterexample to blanket "validate every row immediately" advice appears in
[seed values](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/lib/seedItem.ts)
and the [items adapter](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/services/ItemsServiceAdapter.ts).
Individual legacy rows remain `unknown`; Directus owns their mutation validation. The comments
explain that filtering bad rows could alter failure location or produce destructive empty seeds.
The skill therefore teaches precise trust boundaries and honest types, not indiscriminate
normalization or an assertion that all external data must match a newly invented schema.

### Strategy and adapter contracts

[SeederStrategy](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/strategies/SeederStrategy.ts)
defines the operation and result shape. The [factory and strategies](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/strategies/index.ts)
share batch processing and result reporting while retaining distinct mutation semantics. Results
include counts, duration and an optional error. This is an explicit "failure as result data"
contract: a resolved promise does not imply the collection succeeded.

The [service contract](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/services/ServiceAdapter.ts)
derives its context from the existing hook type and substitutes validated environment options.
Its factory fills missing operations with empty successful results for legacy compatibility.
That behavior is useful evidence of a trade-off, not a desirable default for new mandatory
capabilities. The reusable reference instead shows required implementations and narrow capability
types, while acknowledging intentionally documented no-op contracts.

Several seeding functions take many positional values and mode booleans. They encode established
compatibility and orchestration needs, but do not justify a general style preference for long
positional signatures. New examples use named policy shapes without proposing an upstream API
migration. Whether to refactor an existing signature belongs to the implementation/hygiene skills.

### Mutation order and lifetime

Collection orchestration preflights keys and management boundaries before mutations and preserves
dependency order. This illustrates that an input's validity can depend on operation-specific
semantics, beyond its TypeScript interface. Preflight is not proof of transaction isolation or
rollback; the skill keeps those concepts distinct.

The [process flag](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/lib/processLock.ts)
uses exclusive file creation, an owner token and owner-aware release. The
[integration case](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/__tests__/locking.integration.test.ts)
exercises built-hook processes, contention, stale replacement and process exit. Static inspection
does not establish correctness for every timing interleaving. The transferable convention is
explicit acquisition/release ownership; a temp-file flag is not a general distributed lock recipe.

[Automatic extraction](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/src/seeders/autoExtract.ts)
returns a disposer for scheduled work. The entry point registers it for stop/unload. This ties
background work to host lifecycle rather than treating a discarded promise as ownership.

### Style and tool evidence

The root [formatter configuration](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/.oxfmtrc.jsonc)
uses tabs, single quotes, no semicolons, trailing commas and explicit import groups.
The [linter configuration](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/.oxlintrc.jsonc)
requires broad JSDoc coverage, with test overrides. The [shared TypeScript base](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/packages/typescript-config/base.json)
enables strictness, indexed-access checking and explicit module syntax. Those settings are
local adopted standards, not language-wide obligations.

[Configuration tests](https://github.com/onderwijsin/directus-extensions/blob/ac34c45a1e7cc7499f08923882b83b34da2df6a1/extensions/directus-seeder-hook/__tests__/config.test.ts)
connect generated JSON schema to its canonical Zod definition and validate the shipped example.
This informs the single-definition convention. The new skill does not duplicate test-selection
guidance or prescribe this project's tooling to others.

## Nuxt DevTools

### Execution domains determine organization

The package separates `src/` host integration, `src/runtime/` injected runtime resources,
`src/server-rpc/` server handlers, `src/integrations/` external tool integration and `client/`
as a separate Nuxt UI application. This is a stronger lesson than copying a components folder:
code organization follows what executes the code and what it is allowed to depend on.

The [module entry](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/src/module.ts)
checks activation and dynamically loads the larger implementation. The
[main integration](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/src/module-main.ts)
then assembles plugins, RPC and assets for the active development/builder context. Dynamic loading
here follows an activation contract; it is not an instruction to lazily import every helper.

The [build configuration](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/build.config.ts)
contains a particularly useful boundary example: browser-side web components cannot use the
Node-only loader that serves ordinary development stubs. Their stub is handled separately.
The resulting convention is to make development, built and consumer execution domains explicit.
Source-level import success does not establish all three.

### RPC has typed surfaces and a compatibility interior

[RPC setup](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/src/server-rpc/index.ts)
assembles feature-specific handlers, buffers pre-connection broadcasts and exposes a connected
host. Legacy proxies and aliases preserve older integrations. The implementation uses several
`any` types and assertions at this dynamic boundary. Those are observations of compatibility
pressure, not general permission to weaken TypeScript throughout a project.

The same file preserves a live context getter by returning the context object rather than
spreading it. Object spread would read the getter before connection and permanently snapshot
`undefined`. This concrete JavaScript behavior became a convention example about live state and
object copying, rather than a framework-specific rule.

The [client RPC adapter](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/client/composables/rpc.ts)
documents an assertion for an external declaration gap and describes idempotent registration.
The transferable form is a narrow, evidenced compatibility adapter with a removal condition.
It does not override a target repository's stronger ban on assertions.

### Authorization-adjacent input must follow runtime normalization

[Storage handlers](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/src/server-rpc/storage.ts)
normalize storage keys before matching excluded mounts and check item operations as well as
listing. They return an object checked with `satisfies Partial<ServerFunctions>`. This illustrates
both typed handler subsets and the difference between the presented list and the actual callable
boundary.

The [denylist test](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/test/storage-denylist.test.ts)
uses filesystem-backed mounts and alternate key spellings, then observes the protected file.
It documents the runtime key contract without proving the entire DevTools authorization model.
The skill generalizes the typing/normalization distinction; security review and test-value
assessment remain separate work.

Storage also distinguishes an optional unavailable integration from application data: loading
the optional backend can disable the storage browser, while existing mount operations use the
available instance. Some failures are logged and represented as empty/null results. That may suit
a development UI contract, but must not become a universal policy for required storage services.

[Watcher setup](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/src/server-rpc/storage-watch.ts)
returns a stable cleanup shape whether or not a driver supports watching. This differs from
defaulting a required persistence method to successful no-op: optionality is part of the former
operation's explicit contract.

### Local presets, compatibility and public exports

The [ESLint configuration](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/eslint.config.mjs)
uses an Antfu preset and conditionally consumes the client application's generated configuration.
The fallback deals with a plugin/rule that is unavailable before preparation. A configuration
can therefore be valid for one preparation state and incomplete evidence of another.

The [package compiler config](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/tsconfig.json)
uses strict checking, bundler resolution and local source paths. The
[root config](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/tsconfig.json)
extends generated client configuration. These facts do not justify a portable universal tsconfig.

The [manifest](https://github.com/nuxt/devtools/blob/d46936e89034ea26b49f061cf8ba8ec97b24c9ce/packages/devtools/package.json)
declares explicit entries plus a wildcard export. Consumers can rely on exposed subpaths; making
the surface narrower later is a compatibility decision. Optional peers and externalized host
packages also express ownership of runtime instances, not just dependency housekeeping.

## NuxtHub core

### Feature ownership with build/runtime separation

NuxtHub groups `blob`, `db`, `kv` and `cache` capabilities, with feature setup, runtime code,
libraries and types. The [module](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/module.ts)
resolves common context and invokes feature setup. This differs from the seeder's technical-role
directories and still yields meaningful ownership.

The [build configuration](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/build.config.ts)
preserves runtime/library directories as shipped artifacts. The
[manifest](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/package.json)
exposes runtime, driver and type-related subpaths separately. Directory structure, build output
and package resolution must agree; a source-only view misses much of the public contract.

### Driver contracts and typed composition

[BlobDriver](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/blob/lib/drivers/types.ts)
states the provider capability surface and parameterizes provider options. List, get, put,
metadata and multipart operations are explicit. Optional multipart handling expresses a real
provider extension rather than a generic future-proof hook.

[Storage composition](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/blob/lib/storage.ts)
adds shared behavior around a driver and checks object shapes with `satisfies`, then supplies
either provider-specific or generic multipart handling. The resulting skill examples retain
typed object composition and capability optionality without requiring an equivalent class tree.

The [pathname helpers](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/blob/lib/utils.ts)
decode and validate keys, explicitly considering separators, traversal segments and malformed
encoding. This demonstrates operation-specific meaning beyond the static type `string`.
It is not evidence that a generic regex alone establishes filesystem security for every host.

The source also contains assertions and broad error wrapping. For example, upload handling wraps
errors into a storage error, which can obscure distinctions if generalized without examining
the API contract. The skill therefore preserves the distinction between typed/known failures
and arbitrary caught values rather than copying every catch block.

### Configuration has phases and provider-specific variants

[Blob setup](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/blob/setup.ts)
normalizes boolean/object configuration and chooses a driver from explicit options, environment
or hosting context. It also writes a generated package and declarations for external bundlers.
The transferable conventions are explicit raw/resolved phases and aligned generated contracts.
Writing into `node_modules` is this integration's mechanism, not a generic application pattern.

[Database setup](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/db/setup.ts)
handles dialects, providers, driver imports, migrations, runtime credential resolution, schema
generation and lifecycle hooks. It is a substantial module with meaningful internal functions.
Its size is evidence that a file-length rule would be a poor substitute for understanding the
changing contracts. It is not proof that every responsibility belongs in one file.

Generated lazy database templates and the
[request-context bridge](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/db/runtime/plugins/request-context.ts)
show that a provider connection can depend on runtime/request context unavailable during build.
The general convention is lifetime-accurate configuration and state, not a global hook for every
project. Generated templates also need escaping appropriate to their destination language.

The [CLI client factory](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/src/db/lib/client.ts)
selects provider imports and translates connection option names. Its asserted HTTP response
shape is a useful counterexample: an annotation alone does not establish a remote response
contract. The new examples use honest unknown/narrowing at uncertain boundaries.

### Style, artifacts and evidence limits

The [ESLint configuration](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/eslint.config.js)
selects a Nuxt preset with no trailing commas and a specific brace style, and disables the
explicit-any rule. That is different from the other projects. Permitted syntax still requires
an appropriate type contract; a disabled rule does not certify its uses as safe.

The [compiler configuration](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/tsconfig.json)
references generated environment projects. Effective settings require those generated files;
strictness cannot be concluded solely from a root config that contains no such option.

[Export checks](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/test/package-exports.test.ts)
cover entry resolution and an atomic KV runtime export. A successful `require.resolve` identifies
a path; it is not evidence that all CommonJS consumers can execute that path.
The [runtime database case](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/test/database.postgres-runtime.test.ts)
builds a fixture and imports generated JavaScript with driver stubs. This observes generated
behavior but not an actual remote database connection. These distinctions informed artifact
conventions, without importing a testing workflow into the skill.

The manifest advertises Apache-2.0, while the inspected root
[LICENSE](https://github.com/nuxt-hub/core/blob/5772ded7da326afb5a737a05fdb69f9a4ef15f29/LICENSE)
contains an MIT grant with a Vercel notice. This inconsistency prevents treating a package field
alone as authoritative for copying. No source-project implementation or license-restricted
passage was copied into the new skill; its code examples and instructions are original synthesis.

## Cross-project synthesis

| Concern       | Transferable convention                                                  | Deliberately not generalized                                                         |
| ------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Organization  | Ownership, execution domain and public boundaries should be visible      | One mandatory `src` tree or framework folder taxonomy                                |
| Integration   | Registration and provider translation have explicit typed contracts      | Framework-specific hooks, contexts or generated packages                             |
| Type design   | Unknown boundaries, narrowing, raw/resolved phases and valid states      | Universal casts, enums, interface/type preference or blanket assertion ban           |
| Configuration | Defined precedence and distinct absent/empty/disabled/invalid values     | One environment representation or deep-merge policy                                  |
| Composition   | Required and optional capabilities are honestly represented              | A driver or strategy abstraction for every operation                                 |
| Async         | Promise ownership, receiver behavior and lifetime semantics are explicit | Concurrent mutation as a style preference                                            |
| Errors        | Failure representation is part of the API                                | Every failure throws, every failure returns data, or all errors become empty results |
| Style         | Effective project configuration owns mechanical choices                  | Tabs/spaces, comma/brace settings or broad JSDoc requirements                        |
| Packaging     | Runtime entries and declarations must describe the same consumer surface | Universal ESM/CJS or bundler settings                                                |

The examples are useful because they differ. Agreement on a language/runtime property supports
transfer. Agreement on a local ecosystem habit is weaker evidence. A single implementation is
not enough to declare a universal standard; qualifications belong beside the retained rule.

## What defines a coding standard

Primary-source research covered organizational guides, language/tool specifications, security
guidance and quality models. The full source-to-rule mapping travels with the skill in
[research sources](../skills/typescript-conventions/references/research-sources.md).

The central distinction is between an expectation and an assessment mechanism. Formatting is
an executable convention. Runtime validation, naming, module contracts and error representation
can also be conventions; some require human interpretation or runtime evidence. A coding
standard becomes usable when its scope, reason, examples, enforcement and exceptions are clear.

[Google's TypeScript guide](https://google.github.io/styleguide/tsguide.html) and
[TypeScript's contributor guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
both qualify their applicability. Their specific policies cannot be presented as universal
TypeScript rules. [Prettier's comparison](https://prettier.io/docs/comparison) clarifies why
formatting and code-quality rules have different roles.

[NIST SSDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf) connects
secure coding to language/environment and organizational requirements. The public
[ISO quality-model abstract](https://www.iso.org/standard/78176.html) connects quality to
requirements and evaluation, without prescribing a code layout. These support an outcome-based
definition rather than a claim that formatting equals quality. No formal compliance is claimed.

## Boundary with the five coding skills

All five existing skill entries were read before finalizing the new scope. They remain unchanged
and independently usable. The convention skill is a reference supplement, not a sixth process.

| Existing skill                                                | Owns                                                                                          | Convention supplement supplies                                                   |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [implement-simply](../skills/implement-simply/SKILL.md)       | Requirement discovery, reuse/dependency decisions, complete implementation and verification   | Concrete TypeScript syntax, configuration and module idioms                      |
| [review-code-bloat](../skills/review-code-bloat/SKILL.md)     | Necessity, unreachability, redundancy and supported removal                                   | Accurate meaning of optional versus required typed capabilities                  |
| [review-code-hygiene](../skills/review-code-hygiene/SKILL.md) | Maintenance-cost diagnosis, cohesion, naming/type/flow findings and review output             | Naming forms, narrowing, union types, import semantics and project-style sources |
| [review-test-value](../skills/review-test-value/SKILL.md)     | Oracles, regression protection, mocks, fixtures and keep/improve/consolidate/remove decisions | No duplicated testing policy or assessment procedure                             |
| [clean-code](../skills/clean-code/SKILL.md)                   | Authorized transformation sequence, behavior preservation and cleanup delivery                | Forms to use when an authorized transformation involves TypeScript conventions   |

Overlapping subject matter is not a second workflow: a hygiene reviewer can use the union
example as language reference while retaining its own evidence and finding criteria. The new
skill contains no generic simplicity/reuse checklist, necessity audit, extraction heuristics,
test-selection procedure, mandatory cleanup pass or handoff template. It requires none of the
other skills as a dependency and does not call them automatically.

## Packaging and validation

The source is [skills/typescript-conventions](../skills/typescript-conventions/SKILL.md), with
skill-local references and optional Codex presentation metadata. It is a standalone workspace
skill using the repository-required `metadata.agents: []`; it is not a marketplace plugin and
does not change existing agents or catalogs. Upload/copy the whole directory with its resources.

The consumer array is a repository extension: the
[Agent Skills specification](https://agentskills.io/specification) defines metadata as a
string-to-string map. Acceptance of this array and presentation metadata must be established
in the chosen host. File validation and instruction evaluation do not establish installation,
implicit activation or installed-resource loading in ChatGPT, Codex or Claude.

Repository checks, example validation and forward-test outcomes are recorded in
[evaluation status](typescript-conventions-evaluation.md). Upstream package builds and suites
were not run, and no upstream runtime compatibility claim follows from this static analysis.
