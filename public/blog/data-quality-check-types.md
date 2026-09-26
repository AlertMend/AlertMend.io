---
title: "Data Quality Checks: 10 Types with SQL Examples"
excerpt: "The ten data quality check types every data team needs, what each catches, and a SQL example for each, from freshness to referential integrity."
date: "2026-09-26"
category: "Data Observability"
author: "AlertMend Team"
keywords: "data quality checks, data quality dimensions, data validation SQL, data quality rules, data observability"
---

Data quality checks fall into a small number of types. Knowing them helps you cover a dataset systematically instead of adding rules one incident at a time. Examples below use generic SQL; adapt functions to your warehouse.

## 1. Freshness

**Catches:** late or missing loads.

```sql
SELECT MAX(loaded_at) AS last_load FROM orders;
```

Alert when the last load is older than the table's expected arrival time.

## 2. Volume

**Catches:** partial loads, duplicated loads, dropped feeds.

```sql
SELECT COUNT(*) FROM orders WHERE order_date = CURRENT_DATE;
```

Compare with the recent daily average and alert on large deviations.

## 3. Completeness

**Catches:** missing mandatory values.

```sql
SELECT COUNT(*) FROM customers WHERE email IS NULL OR email = '';
```

## 4. Uniqueness

**Catches:** duplicate keys from retries or fan-out joins.

```sql
SELECT order_id FROM orders GROUP BY order_id HAVING COUNT(*) > 1;
```

## 5. Validity (allowed values)

**Catches:** unexpected codes and categories.

```sql
SELECT COUNT(*) FROM orders WHERE status NOT IN ('new', 'paid', 'shipped', 'cancelled');
```

## 6. Range

**Catches:** impossible numbers.

```sql
SELECT COUNT(*) FROM orders WHERE amount < 0 OR amount > 1000000;
```

## 7. Format

**Catches:** malformed identifiers, emails and dates.

```sql
SELECT COUNT(*) FROM customers WHERE NOT REGEXP_LIKE(email, '^[^@]+@[^@]+\.[^@]+$');
```

## 8. Referential integrity

**Catches:** rows pointing at records that don't exist.

```sql
SELECT COUNT(*) FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;
```

## 9. Consistency and reconciliation

**Catches:** totals that don't match between source and target, or across related tables.

```sql
SELECT (SELECT SUM(amount) FROM staging_orders) - (SELECT SUM(amount) FROM orders) AS difference;
```

## 10. Anomaly and trend

**Catches:** unusual changes that fixed thresholds miss, such as a slow drift in null rate or a sudden change in a distribution. These checks learn from each dataset's history, so they need enough history before they can judge; a good implementation waits rather than guessing.

## Schema changes

Alongside these, watch for schema drift: dropped, renamed or retyped columns break downstream queries even when every row is valid.

## Prioritise

You don't need every check on every table. Start with:

1. freshness and volume on every table that feeds a critical report,
2. completeness and uniqueness on keys and mandatory fields,
3. validity, range and referential integrity where your data quality policy requires them,
4. anomaly checks once tables have history.

## Running checks with AlertMend

[AlertMend Data Observability](/data-observability) includes 87 ready-made checks covering these types, built in a guided wizard with no SQL needed, plus anomaly and trend checks that learn from each dataset's history. Checks can be proposed from your data quality policy, each citing the clause it enforces, and failures reach Slack or Teams with the failed job and affected Power BI reports. For warehouse-specific SQL, see [Snowflake data quality checks](/blog/snowflake-data-quality-checks) and [Oracle data quality monitoring](/blog/oracle-data-quality-monitoring).
