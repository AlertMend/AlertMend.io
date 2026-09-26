---
title: "Snowflake Data Quality Checks: A Practical Guide"
excerpt: "SQL patterns for freshness, volume, null, uniqueness and validity checks in Snowflake, plus how to run them continuously without writing every rule by hand."
date: "2026-09-26"
category: "Data Observability"
author: "AlertMend Team"
keywords: "Snowflake data quality, Snowflake data quality checks, data freshness Snowflake, data observability Snowflake, SQL data quality"
---

Snowflake makes it easy to load data and hard to notice when that data is wrong. A late load, a duplicated key or a column that silently fills with nulls rarely fails a query; it just produces a wrong number in a report.

This guide shows the core data quality checks for Snowflake as plain SQL you can run today, and what it takes to run them continuously.

## 1. Freshness: did the data arrive on time?

Most tables have a load timestamp. Compare the latest one with when you expected the load:

```sql
SELECT
  MAX(loaded_at) AS last_load,
  DATEDIFF('minute', MAX(loaded_at), CURRENT_TIMESTAMP()) AS minutes_late
FROM finance.loans_daily_balance;
```

Alert when `minutes_late` passes the table's agreed arrival time. Freshness is usually the first check to add, because a late table breaks every report built on it.

## 2. Volume: did we get roughly the usual number of rows?

A feed that delivers half its normal rows often loads without errors. Compare today's count with recent history:

```sql
WITH daily AS (
  SELECT DATE(loaded_at) AS d, COUNT(*) AS n
  FROM finance.transactions
  WHERE loaded_at >= DATEADD('day', -15, CURRENT_DATE())
  GROUP BY 1
)
SELECT
  MAX(IFF(d = CURRENT_DATE(), n, NULL)) AS today,
  AVG(IFF(d < CURRENT_DATE(), n, NULL)) AS avg_prev_14d
FROM daily;
```

A fixed threshold (for example ±30%) is a good start; history-based anomaly checks reduce noise later.

## 3. Completeness: are mandatory fields filled?

```sql
SELECT
  COUNT(*) AS total_rows,
  COUNT_IF(address IS NULL OR TRIM(address) = '') AS missing_address,
  missing_address / NULLIF(total_rows, 0) AS missing_rate
FROM kyc.customers;
```

Set the allowed rate per column. Regulatory fields often allow zero.

## 4. Uniqueness: are keys really unique?

```sql
SELECT account_id, COUNT(*) AS copies
FROM banking.customer_accounts
GROUP BY account_id
HAVING COUNT(*) > 1
LIMIT 100;
```

Duplicates usually come from a retried load or a join that fanned out. Returning sample keys makes the alert actionable.

## 5. Validity: are values in the allowed set or range?

```sql
SELECT COUNT(*) AS invalid_rows
FROM finance.loans
WHERE currency NOT IN ('USD', 'EUR', 'GBP', 'INR', 'SGD')
   OR interest_rate NOT BETWEEN 0 AND 0.5;
```

## 6. Referential integrity: do foreign keys resolve?

```sql
SELECT COUNT(*) AS orphan_rows
FROM finance.loans l
LEFT JOIN banking.customer_accounts a ON a.account_id = l.account_id
WHERE a.account_id IS NULL;
```

## Snowflake's built-in options

Snowflake also offers data metric functions that can be attached to tables and scheduled, including system functions for null counts, duplicates and freshness (availability depends on your edition). They are a good fit for simple per-table metrics. What they don't give you is the context around a failure: which job caused it, which reports are affected, and which policy clause the check exists for.

## From queries to continuous monitoring

Writing the SQL is the easy part. Running it well means:

- **Scheduling** each check close to when data lands.
- **Thresholds** that fit each table, and history-based checks that wait for enough history instead of guessing.
- **Noise control**: cooldowns, maintenance windows and flapping detection.
- **Cause and impact**: linking a failure to the pipeline run that produced it and the reports that read the table.
- **Audit**: which rule enforces which policy clause, and who approved it.

## Doing it with AlertMend

[AlertMend Data Observability](/data-observability) runs these checks on Snowflake through a read-only agent inside your network; the agent refuses anything but read queries, and a generated grant script sets up the read-only role. You can build checks in a no-SQL wizard (87 ready-made types) or have AlertMend propose them from your data quality policy, approve each one, and get alerts in Slack or Teams that name the failed Airflow or Oracle ODI job and the affected Power BI reports.

See the [Snowflake integration](/integrations/snowflake) for setup steps.
