# Plugin releases

Plugin manifests are the version source. A small manifest-native workflow prepares
versions on each PR to `main`, before merge. It creates plugin-scoped Git tags after
merge. There are no Changesets, npm packages, changelogs or generated release notes.
The root tooling package and individual skills are never released separately.

## Everyday use

Open a PR to `main`. The **Prepare release** workflow commits synchronized references and the expected plugin
versions to the same branch, then runs its **validate** job for that resulting commit.
Review the version diff along with the content. Repeated runs or additional commits
in the same PR calculate from the base version rather than bumping again.

Default: **patch**. Add labels before merging to select another bump:

| Label                                    | Effect                                      |
| ---------------------------------------- | ------------------------------------------- |
| `release:patch`                          | Explicit patch for changed plugins          |
| `release:minor`                          | Minor for changed plugins                   |
| `release:major`                          | Major for changed plugins                   |
| `release:nieuwsbrief-style-review:minor` | Override the PR-wide choice for this plugin |

Create these labels in GitHub as needed. Scoped labels use the canonical plugin
name. Choose at most one PR-wide label and one scoped label per plugin; conflicting
choices fail. An invalid `release:` label fails rather than silently choosing patch.
Labels for unrelated plugins do not release those plugins. There is no automated
inference from commit messages or file contents: maintainers choose a minor or major
when the public capability changes. A major bump on `0.x.y` becomes `1.0.0`.

All changed files inside an existing plugin count, including its README, assets,
connections, bundled skills and references. Repository-level docs, catalogs and
tooling alone do not bump plugins. A manifest edit that only changes the version is
restored to the base version; it does not create a release. Brand-new plugins retain
their declared initial stable version. Removed plugins are not released; a renamed
plugin is a new identity. Automation supports stable `major.minor.patch` versions;
prerelease/build versions require an explicit future extension.

The root `plugins/<name>/plugin.json` and any existing
`.claude-plugin/plugin.json` or `.codex-plugin/plugin.json` receive the same version.
No overlays are created. Catalogs currently contain no versions to synchronize.
Unchanged plugins retain their versions. Automated preparation sets the expected
version exactly; hand-editing a different version is not an alternative bump policy.

## Merge enforcement and initial setup

A workflow file alone cannot prevent a merge. In the existing **Protect main**
ruleset, require the **validate** check and enable **Require branches to be up to
date before merging**. Keep direct pushes restricted and choose bypass actors
accordingly. The existing ruleset already requires `validate`, but its strict
up-to-date policy was disabled when inspected on 20 October 2026. This implementation
does not change repository settings or bypass permissions.

Prepared-commit validation and fork PR validation check expected
versions against `origin/main`. The preparation script rejects a base that is not
an ancestor of the PR. After another PR merges, update your branch from `main`;
preparation and validation run again. This prevents parallel PRs from consuming the
same plugin version. Merge queues are not configured by this workflow; adding one
requires `merge_group` support and a version allocation strategy before enabling it.

Merge these workflow/tooling changes before relying on automatic preparation. The
preparation job deliberately runs the script from the PR's base commit, so it cannot
use a release script introduced only in its own PR. Its first bootstrap run may fail
until that script exists on `main`; normal validation can verify this tooling-only PR.
No existing plugin versions are changed during adoption.

Repository Actions policy must allow the workflow's scoped `contents: write` and
`actions: write` permissions. No PAT, GitHub App, registry credential or extra secret
is needed. The bot never force-pushes; if the PR moves while preparation runs, the
old run fails instead of overwriting newer work. Check the failed run and rerun on
the current PR head if necessary. The current implementation assumes GitHub.com
and the standard GitHub-hosted Ubuntu runner with `gh` available.

Automatic branch updates apply to same-repository PRs. Forks and Dependabot PRs
with read-only token restrictions use local preparation and commit the version
updates themselves. PR validation remains mandatory:

```sh
git fetch origin main
# Commit content changes first; preparation requires a clean working tree.
pnpm release:prepare origin/main
# Commit generated references, ownership manifests and version updates, then push normally.
pnpm release:check origin/main
```

For local minor/major preparation, pass the same labels used on the PR:

```sh
RELEASE_LABELS='["release:minor"]' pnpm release:prepare origin/main
```

## Workflow and extension points

1. **Prepare release** checks out the base revision with credentials disabled.
   Its dependency-free Node script compares Git snapshots, reads regular manifest
   blobs and synchronizes reachable references before calculating versions. It
   builds temporary Git snapshots and creates one commit containing generated copies,
   ownership manifests, stale generated-file deletions and version edits. Generated
   changes can themselves require a plugin bump. It does not check out or execute PR
   content, install PR dependencies or
   follow PR symlinks. The temporary index leaves the checkout untouched.
2. The write step pushes that commit to the PR branch and dispatches the same
   **Prepare release** workflow on that branch with its exact SHA. The dispatched
   run skips preparation and runs only the **validate** job with a read-only token. This
   places the required check on the prepared commit, rather than its predecessor.
   The validation job installs
   dependencies, runs reference migration, and requires a clean committed result
   (including no untracked plugin output) before running validation and version checks.
   A migration failure stops later validation steps. This prevents runner-only copies
   from passing CI while marketplace consumers still lack the files. `pnpm check`
   starts with an additional read-only migration drift check.
3. After merge, **Release** compares the snapshots before and after the push and tags
   new or changed plugin versions as `<plugin>@<version>`. Existing tags at the expected
   commit are accepted on rerun; a collision at another commit fails without moving
   the tag. Tags are identifiers, not a separate packaging or publication channel.
   Squash, merge and rebase merges tag the final snapshot, never intermediate
   version edits within the PR. No GitHub Releases or release notes are generated.

Reference synchronization is implemented in `scripts/sync-references.ts`. Shared
sources stay in plugin-root `reference/`; only files reachable from each skill's
Markdown graph are copied into its `reference/`. Ownership manifests protect
private files and detect edits to generated copies. See the
[resource contract](reference-synchronization.md) for authoring,
conflicts and cleanup. This applies equally to single-skill and multi-skill plugins;
skill-private reference files remain directly authored inside their skill.

Future pre-release transformations belong before version planning in the preparation
stage. Include their output in the prepared commit, then validate that exact commit.
GitHub-backed marketplaces consume committed files, not runner artifacts. Keep
transformations deterministic and add a read-only drift check and targeted tests.

When introducing changes to preparation tooling, the PR still runs the existing
trusted implementation from its base revision. Run the new migration locally and
commit its output in the rollout PR; subsequent PRs use the new planner after merge.

Post-release work belongs after the tagging step in `release.yml`. Keep it idempotent
and rerunnable; it must not change already tagged content. The workflow's manual
**Run workflow** accepts `before` and `after` commits to retry a merged mainline range.
Partial success is safe to retry because existing tags are checked before creation.
Pre/post tasks currently have no plugin registry or generic hook abstraction; use
ordinary workflow steps or focused functions as the concrete work requires.

## Distribution and limitations

Marketplace consumers still receive the committed `main` content through the
provider's GitHub synchronization. A tag does not trigger ChatGPT sync. Follow the
[distribution guide](marketplace-distribution.md) and test installed behavior in a
new chat. This release workflow changes version bookkeeping, not host compatibility.

GitHub documents that [GITHUB_TOKEN-triggered events](https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
do not generally start ordinary workflows automatically, while explicit
`workflow_dispatch` does. It also documents that required checks must cover the
[latest commit and merge queue events](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).
These behaviors are why preparation dispatches its own validation job and strict
branch freshness is part of setup. Sources consulted on 20 October 2026.

Local Git-fixture tests cover planning, SemVer selection, overlay synchronization,
repeat runs, file boundaries and tag identities. GitHub bot permissions, dispatched
validation jobs, ruleset enforcement and remote tag publication still require an end-to-end
PR after this workflow reaches `main`; local checks cannot establish those results.
