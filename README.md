# C27 · Vaults and Credentials

Builds a redacted credential-injection plan. No real secrets are accepted, persisted, or provisioned into a vault. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Credential references are not secret values
- Review destination and injection location
- Vault authorization remains host-owned

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3027`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3027
```

## How the app was build

### 1. Authorize the injection destination

The local policy requires an authorized reference, HTTPS, the exact reviewed hostname and header-only injection. A credential reference alone cannot authorize another endpoint.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const destination = new URL(text(input, "destination"));

if (
  !flag(input, "authorizedVault") ||
  destination.protocol !== "https:" ||
  destination.hostname !== "api.example.com" ||
  text(input, "location") !== "header"
)
  return report(
    "rejected",
    "The reviewed vault injection policy does not permit this destination or location",
    {},
    [
      "Authorize the vault reference",
      "Match the reviewed hostname",
      "Restrict substitution to the intended header",
    ],
  );
```

### 2. Keep secret values out of the plan

The output records only a demo reference, destination origin and injection location. credentialValue is not collected and secretInPrompt is false; no vault read or credential substitution occurs.

Source: [src/lesson.ts](src/lesson.ts#L15)

```typescript
return report(
  "passed",
  "Prepared a redacted host credential plan",
  {
    vaultReference: "demo-vault-reference",
    destination: destination.origin,
    injection: "header-only",
    secretInPrompt: false,
    credentialValue: "not collected",
  },
  [
    "Keep credential values outside model text",
    "Bind a reference to a reviewed destination",
    "Service actions still need least privilege",
  ],
);
```

### Check your understanding

Run **Plan header-only injection** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "destination": "https://api.example.com/reports",
    "location": "header",
    "authorizedVault": true
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "secretInPrompt": false
  }
}
```

Then try **Reject an unreviewed destination**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
