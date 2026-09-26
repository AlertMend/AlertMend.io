---
title: "Data Freshness Monitoring: Catch Late Data"
excerpt: "How to define freshness expectations per table, detect late loads before reports run, and trace late data back to the pipeline job that caused it."
date: "2026-09-26"
category: "Data Observability"
author: "AlertMend Team"
keywords: "data freshness monitoring, late data, data SLA, freshness check, Airflow late DAG, data observability"
---

Stale data is the most common data quality problem and the easiest to miss. Nothing errors. The dashboard loads, the numbers look plausible, and they are from yesterday.

Freshness monitoring answers one question for every important table: did the data we expected arrive on time?

## Define freshness per table

Freshness is only meaningful against an expectation. For each critical table, agree:

- **Expected arrival time**, such as "loaded by 06:30 on business days".
- **Update pattern**: daily batch, hourly micro-batch or continuous stream.
- **Tolerance** before it counts as late.
- **Owner** who is alerted.

Tie these expectations to reporting deadlines. If a regulatory report runs at 08:00, the tables it reads need to be fresh well before then.

## How to measure it

The most reliable signal is a load timestamp written by the pipeline:

```sql
SELECT DATEDIFF('minute', MAX(loaded_at), CURRENT_TIMESTAMP()) AS minutes_since_load
FROM finance.loans_daily_balance;
```

If a table has no load timestamp, use the latest business date in the data (for example `MAX(balance_date)`), or the warehouse's table metadata for last-modified time. Business dates are often the better choice: a table can be "modified" by a job that wrote nothing new.

## Freshness is not volume

A job can finish on time and load too little. Pair every freshness check with a volume check that compares today's rows with recent history. Together they catch the two most common failures: nothing arrived, or not enough arrived.

## Find the cause: link freshness to the pipeline

A freshness alert that only says "table is 3 hours late" starts an investigation. A useful alert also says why:

- the **Airflow** task that loads the table is stuck in retry, or
- the **Oracle ODI** job failed with a specific error, or
- an upstream source didn't deliver.

Linking checks to the jobs that load their tables turns a late-data alert into a cause you can act on.

## Show the impact

Next, list who is affected: the reports and dashboards that read the late table. The goal is to warn report owners before business users open a stale report.

## Reduce noise

Freshness checks can be noisy around weekends, holidays and planned maintenance. Use:

- business-day calendars,
- maintenance windows that pause checks,
- cooldowns so one late table doesn't page repeatedly,
- flapping detection for tables that hover around the threshold.

## Freshness monitoring with AlertMend

[AlertMend Data Observability](/data-observability) runs freshness, volume and other checks on Snowflake and Oracle through a read-only agent in your network. When a table is late, the alert in Slack or Microsoft Teams names the failed or stuck [Airflow](/integrations/airflow) or Oracle ODI job and the [Power BI](/integrations/power-bi) reports that read the table. Cooldowns, maintenance windows and flapping detection keep alerts quiet until they matter, with incidents and escalation when they do.
