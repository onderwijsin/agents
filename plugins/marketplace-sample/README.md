# Marketplace sample

A minimal plugin for administrators investigating GitHub marketplace import failures.
It contains one sample skill and a portable root manifest, with no MCP server, app connection,
OpenAI presentation extension, or external service requirement.

## Test import and activation

1. Make this package and both updated catalogs available on the GitHub revision selected
   by the workspace marketplace, then select **Sync now** in the Admin Console.
2. Record the revision and the import status of `marketplace-sample` alongside
   `onderwijs-in-redacteur`. A successful sample import establishes that this minimal
   package imports; it does not identify which additional component caused the other failure.
3. Install the sample plugin and start a new chat. Invoke `sample-confirmation` or ask:
   “Test the marketplace sample plugin.”
4. Confirm the response is exactly `Marketplace sample skill activated.`
5. In another new chat, ask an unrelated question, such as “What is 2 + 2?”
   Confirm the sample skill does not replace the normal answer.

Onderwijs in owns the skill as part of this plugin. Install the entire plugin.
There are no additional resources to load.

## Compatibility and validation

Packaging follows the [OpenAI portable plugin guide](https://developers.openai.com/plugins/build/plugins).
The [workspace import reference](https://learn.chatgpt.com/docs/enterprise/plugin-management)
documents Agent Plugins 1.0 packages and repository-relative catalog paths.
Both repository catalogs expose the same package for intended ChatGPT/Codex and Claude testing.
Import, installation, activation, and behavior remain unverified on these hosts;
catalog inclusion does not establish runtime compatibility.

Run `pnpm format` and `pnpm check` for repository validation. These checks do not exercise
the Admin Console importer. This diagnostic plugin is separate from the editorial plugin
and provides no editorial capability.
