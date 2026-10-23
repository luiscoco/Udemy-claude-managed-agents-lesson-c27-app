import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 27,
  title: "Vaults and Credentials",
  description: "An agent may need an OAuth token for an M C P server or an API credential for a command-line client. The secret should not become model-visible text merely because the task needs service access.",
  concepts: ["Credential references are not secret values", "Review destination and injection location", "Vault authorization remains host-owned"],
  scope: "Builds a redacted credential-injection plan. No real secrets are accepted, persisted, or provisioned into a vault. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Plan header-only injection", "input": {"destination": "https://api.example.com/reports", "location": "header", "authorizedVault": true}, "expected": "passed", "checks": {"secretInPrompt": false}}, {"id": "1", "label": "Reject an unreviewed destination", "input": {"destination": "https://unreviewed.invalid/upload", "location": "body", "authorizedVault": true}, "expected": "rejected", "checks": {}}],
  async run(input) {

const destination=new URL(text(input,"destination"));
if(!flag(input,"authorizedVault")||destination.protocol!=="https:"||destination.hostname!=="api.example.com"||text(input,"location")!=="header")return report("rejected","The reviewed vault injection policy does not permit this destination or location",{},["Authorize the vault reference","Match the reviewed hostname","Restrict substitution to the intended header"]);
return report("passed","Prepared a redacted host credential plan",{vaultReference:"demo-vault-reference",destination:destination.origin,injection:"header-only",secretInPrompt:false,credentialValue:"not collected"},["Keep credential values outside model text","Bind a reference to a reviewed destination","Service actions still need least privilege"]);

  }
};
