---
title: "BCBS 239 Data Quality Controls: A Guide"
excerpt: "What BCBS 239 asks of risk data, which principles drive data quality, and how to turn them into automated checks your auditors can trace."
date: "2026-09-26"
category: "Data Observability"
author: "AlertMend Team"
keywords: "BCBS 239, risk data aggregation, data quality controls, data quality policy, banking data governance, data observability"
---

BCBS 239 is the Basel Committee's standard for how banks aggregate and report risk data. Published in January 2013 as *Principles for effective risk data aggregation and risk reporting*, it was aimed first at global systemically important banks, with a compliance date of January 2016, and many supervisors now expect domestic systemically important banks to follow it too.

Most banks have a written data quality policy that maps to BCBS 239. The hard part is proving, every day, that the policy is actually enforced. This guide covers what the standard asks for, which principles translate into data quality controls, and how to make those controls continuous instead of a quarterly spreadsheet exercise.

## The 14 principles at a glance

BCBS 239 groups its 14 principles into four areas:

| Area | Principles | What it covers |
|---|---|---|
| Governance and infrastructure | 1–2 | Board oversight, data architecture and IT infrastructure |
| Risk data aggregation | 3–6 | Accuracy and integrity, completeness, timeliness, adaptability |
| Risk reporting | 7–11 | Report accuracy, comprehensiveness, clarity, frequency, distribution |
| Supervisory review | 12–14 | How supervisors review, remediate and cooperate |

For a data team, principles 3 to 7 are where the daily work happens.

## Principles that become data quality checks

**Principle 3 – Accuracy and integrity.** Risk data should be accurate and reliable, with aggregation largely automated to minimise errors. In practice this means checks for uniqueness of keys, valid values and ranges, referential integrity between tables, and reconciliation between source and aggregated figures.

**Principle 4 – Completeness.** A bank should capture all material risk data across the group. Translate this into completeness checks on mandatory fields (for example no missing counterparty identifiers) and volume checks that catch a feed that suddenly delivers half its usual rows.

**Principle 5 – Timeliness.** Risk data must be available in time for reporting, including under stress. This is a freshness check: every critical table has an expected arrival time, and a late load is an incident, not a surprise in the morning meeting.

**Principle 6 – Adaptability.** Aggregation should flex for ad-hoc and stress requests. For monitoring, the implication is that checks must be easy to add and change without a development cycle.

**Principle 7 – Accuracy of reports.** Reports must reflect the underlying data accurately. That requires knowing which reports read which tables, so a failed check upstream can be traced to the reports it affects.

## Why policies stay on paper

Most data quality policies are written once and only partly monitored. Someone has to turn every clause into a rule by hand, rules drift away from the policy over time, and when an auditor asks "show me how this principle is enforced", the answer is days of spreadsheets. Failures are often found by business users who notice wrong numbers before the data team does.

## A practical control framework

1. **Map clauses to checks.** For each policy clause, list the tables and columns it covers and the check types that enforce it (completeness, uniqueness, validity, freshness, volume, referential integrity).
2. **Keep the link.** Every check should record which clause it enforces. This is what turns monitoring into audit evidence.
3. **Approve before go-live.** Data owners should review and approve each check, with the approval recorded.
4. **Alert with cause and impact.** When a check fails, the alert should name the pipeline job that caused it and the reports that read the table.
5. **Version every change.** Checks change as the business changes. Keep a history with who changed what and why, and make changes reversible.
6. **Report a score that can't hide failures.** An average quality score can look healthy while a critical check fails. Cap the score when any critical check is failing.

## How AlertMend helps

[AlertMend Data Observability](/data-observability) turns a data quality policy into live checks. You upload the policy as a PDF (BCBS 239, an internal standard or a data contract), AlertMend proposes checks that each cite the clause they enforce, and nothing goes live until a person approves it.

- A read-only agent runs inside your network, holds the warehouse credentials and connects out only.
- Checks run on Snowflake and Oracle, with 87 ready-made check types built in a guided wizard.
- When a check fails, the alert in Slack or Microsoft Teams names the failed Airflow or Oracle ODI job and the Power BI reports that read the table.
- Every check change is versioned with a reason and can be rolled back.

See [data pricing](/pricing#data): checks and users are unlimited on every plan.

## Key takeaways

- BCBS 239 principles 3 to 7 map directly onto accuracy, completeness, timeliness and report-accuracy checks.
- The audit question is traceability: which check enforces which clause, who approved it, and when it last passed.
- Continuous checks with cause and impact replace quarterly evidence gathering.
