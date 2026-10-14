# Distributing plugins through the workspace marketplace

ChatGPT Business is our first target. Administrators manage the marketplace; colleagues use
the plugin GUI. The catalog now includes
[Onderwijs in Redacteur](../plugins/onderwijs-in-redacteur/README.md).
Actual ChatGPT workspace import and new-plugin runtime behavior have not been tested.
The [marketplace sample](../plugins/marketplace-sample/README.md) provides a minimal
skills-only import and activation test for diagnosing sync failures.
Verify feature availability, installation, resource loading and representative tasks
in your workspace before rollout.

## Administrator import

Follow [official plugin management](https://learn.chatgpt.com/docs/enterprise/plugin-management).
With a workspace admin account and GitHub access to the repository, open **Admin → Plugins →
Add → Import marketplace**. Use these settings for this repository:

| Setting                | Value                                                                           |
| ---------------------- | ------------------------------------------------------------------------------- |
| Source                 | `https://github.com/onderwijsin/agents`                                         |
| Path                   | Leave empty: marketplace is at the repository root                              |
| Branch, tag, or commit | `main` to follow reviewed changes, or a fixed revision for a controlled rollout |

Authorize GitHub access and review import results. Once content exists, configure each imported
plugin's installation policy. Repository catalogs make content discoverable; administrators
control availability and installation for workspace roles.

## Permissions and updates

Importing plugins does not grant connected-app access or authenticate members. Manage required
apps and their permitted actions separately, and ensure members have the relevant service access.
See [plugin controls](https://learn.chatgpt.com/docs/enterprise/apps-and-connectors).

New imports enable daily sync. Use **Admin → Plugins → Marketplaces → Sync now** to request an
update. A fixed commit does not follow later commits. Review catalog changes before merging:
sync can introduce new plugins. Inspect sync errors; invalid updates retain the last working copy.
Removing a catalog entry does not remove its imported workspace copy. Deleting a marketplace
removes its imported plugins, so do not use deletion merely to reconnect GitHub access.

GitHub is the source of truth; this repository has no deploy or publishing workflow. Neither a
public GitHub repository nor workspace import publishes plugins in the universal public directory.
Colleagues can browse available workspace plugins and install those permitted by their role once
an administrator has imported real content. Report missing access to your workspace administrator.

## Other hosts

Codex can consume `.agents/plugins/marketplace.json` through its native marketplace system.
Claude Code uses `.claude-plugin/marketplace.json`. See the
[Claude marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces) for installation.
These are distribution targets, not tested runtime guarantees; the first package must establish
host-specific compatibility. Standalone skills use the host's Agent Skills installation route.

## Empty catalog compatibility for future changes

Empty catalogs remain valid repository scaffolds. Their structural handling rests on these checks:

- The [Codex marketplace parser](https://github.com/openai/codex/blob/main/codex-rs/core-plugins/src/marketplace.rs)
  accepts a plugin list without a minimum length. Its
  [tests](https://github.com/openai/codex/blob/main/codex-rs/core-plugins/src/marketplace_tests.rs)
  include an empty catalog.
- The [Claude marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference#validation-messages)
  classifies an empty plugin list as a warning, rather than an error.

These checks establish structural acceptance, not successful ChatGPT workspace import. Verify
import and installation in the intended workspace before claiming deployment support.
