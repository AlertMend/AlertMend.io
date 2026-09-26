---
title: "Oracle Data Quality Monitoring Guide"
excerpt: "SQL checks for completeness, uniqueness, validity and freshness in Oracle, and how to link failures to Oracle ODI jobs for faster root cause."
date: "2026-09-26"
category: "Data Observability"
author: "AlertMend Team"
keywords: "Oracle data quality, Oracle data quality monitoring, ODI data quality, Oracle Data Integrator, data observability Oracle"
---

Many banks, insurers and large enterprises still run core reporting on Oracle, often loaded by Oracle Data Integrator (ODI). Monitoring data quality there matters as much as in a cloud warehouse, and the same checks apply.

## Core checks in Oracle SQL

**Completeness**: mandatory columns filled.

```sql
SELECT COUNT(*) AS total_rows,
       SUM(CASE WHEN address IS NULL OR TRIM(address) IS NULL THEN 1 ELSE 0 END) AS missing_address
FROM kyc_customers;
```

In Oracle, an empty string is treated as NULL, so `TRIM(address) IS NULL` covers both blanks and nulls.

**Uniqueness**: no duplicate keys.

```sql
SELECT account_id, COUNT(*) AS copies
FROM customer_accounts
GROUP BY account_id
HAVING COUNT(*) > 1
FETCH FIRST 100 ROWS ONLY;
```

**Validity**: values in the allowed set or range.

```sql
SELECT COUNT(*) AS invalid_rows
FROM loans
WHERE currency NOT IN ('USD', 'EUR', 'GBP', 'INR', 'SGD')
   OR interest_rate NOT BETWEEN 0 AND 0.5;
```

**Freshness**: did today's data arrive?

```sql
SELECT ROUND((SYSDATE - MAX(loaded_at)) * 24 * 60) AS minutes_since_load
FROM loans_daily_balance;
```

**Referential integrity**: foreign keys resolve.

```sql
SELECT COUNT(*) AS orphan_rows
FROM loans l
WHERE NOT EXISTS (SELECT 1 FROM customer_accounts a WHERE a.account_id = l.account_id);
```

## Keep checks light on production

Oracle often serves operational workloads too. Keep checks safe:

- run them with a **read-only** user,
- cap query time,
- schedule heavy checks after loads, not during peak hours,
- prefer aggregate queries and sampled outputs over full-table exports.

## Linking failures to Oracle ODI

When a check fails, the fastest root cause is usually the load job. An ODI session that failed or partially loaded (for example on a constraint error such as `ORA-01400`, cannot insert NULL) explains most completeness and volume failures. Linking each monitored table to the ODI job that loads it means the alert can say "nightly_load failed with ORA-01400" instead of "row count dropped".

## Oracle monitoring with AlertMend

[AlertMend Data Observability](/data-observability) monitors Oracle through a read-only agent inside your network: the agent refuses anything but read queries, caps query time and connects out only, and a generated grant script sets up a least-privilege role. Checks can be proposed from your data quality policy, each citing its clause, and a failed check is linked to the Oracle ODI job and error, plus the Power BI reports it affects. See the [Oracle integration](/integrations/oracle).
