---
title: "Turn a Data Quality Policy into Automated Checks"
excerpt: "A step-by-step method for turning written data quality policy clauses into approved, automated checks that stay traceable for audit."
date: "2026-09-26"
category: "Data Observability"
author: "AlertMend Team"
keywords: "data quality policy, data quality rules, automated data quality checks, data contracts, data governance, audit trail"
---

Almost every regulated company has a data quality policy. Far fewer can show which parts of it are monitored today. The gap is not intent; it is the manual work of translating each clause into a rule, keeping the rules in step with the policy, and proving it to auditors.

Here is a method that works whether you do it by hand or with tooling.

## Step 1: Break the policy into testable clauses

Read the policy clause by clause and rewrite each one as something a query can answer. "Customer records must be complete" is not testable. "Every active customer has a non-empty address, date of birth and tax ID" is.

For each clause, note:

- the **dataset** and **columns** it covers,
- the **dimension** it enforces (completeness, uniqueness, validity, freshness, volume, referential integrity, consistency),
- the **threshold** (zero tolerance, or an allowed rate),
- the **owner** who can approve it.

## Step 2: Choose a check type per clause

| Policy wording | Check type | Example |
|---|---|---|
| "must be present" | Completeness | null or blank rate on `address` ≤ 0.5% |
| "must be unique" | Uniqueness | no duplicate `account_id` |
| "must be valid" | Validity | `currency` in approved list |
| "must be available by 07:00" | Freshness | latest load before 07:00 |
| "must reconcile" | Consistency | source total equals aggregate |
| "must reference a valid customer" | Referential integrity | every `loan.account_id` exists |

## Step 3: Keep the link from check to clause

Store the clause reference on every check (for example "Policy 4.2, BCBS 239 Principle 3"). This single field is what turns monitoring output into audit evidence: for any clause you can show the checks enforcing it, their history and their current state.

## Step 4: Approve before anything goes live

Checks written by one person and never reviewed become noise. Route each new or changed check to the data owner, record the approval, and only then activate it.

## Step 5: Alert with cause and impact

A failed check should answer three questions in the alert itself:

1. **What failed?** The check, the dataset and the observed value.
2. **Why?** The pipeline run that loaded the data, with its error.
3. **Who is affected?** The reports and teams that read the table.

## Step 6: Version and review

Policies change. Keep a history of every check change with the reason, and review coverage regularly: which clauses have no check yet, and which checks have no clause.

## Common pitfalls

- **Rules without owners.** Every check needs someone who can approve it and act when it fails.
- **Averages that hide failures.** A 97% average quality score can hide a critical failing check. Let any failing critical check cap the score.
- **Thresholds guessed on day one.** Start with the policy's hard rules, then add history-based anomaly checks once each dataset has enough history.

## How AlertMend automates this

With [AlertMend Data Observability](/data-observability) you upload the policy or data contract as a text-based PDF. AlertMend proposes checks, each linked to the clause it enforces; nothing goes live until you approve it; and every change is versioned with a reason and can be rolled back. The Data Quality Copilot lets you add, change or route checks in plain English, and every change is again a proposal you approve.

Checks run on Snowflake and Oracle through a read-only agent in your network, and failures reach Slack or Teams with the failed job and the affected Power BI reports. For a banking example, see [BCBS 239 data quality controls](/blog/bcbs-239-data-quality-controls).
