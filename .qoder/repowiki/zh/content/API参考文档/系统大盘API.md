# 系统大盘API

<cite>
**本文档引用的文件**   
- [dashboard.py](file://zquant/api/v1/dashboard.py)
- [dashboard.ts](file://web/src/services/zquant/dashboard.ts)
- [dashboard.py](file://zquant/services/dashboard.py)
- [dashboard.py](file://zquant/schemas/dashboard.py)
- [api_reference.md](file://docs/api/api_reference.md)
- [index.tsx](file://web/src/pages/dashboard/index.tsx)
</cite>

## 目录
1. [简介](#简介)
2. [核心指标说明](#核心指标说明)
3. [接口聚合逻辑](#接口聚合逻辑)
4. [JSON响应示例](#json响应示例)

## 简介

系统大盘API为平台管理员提供了一个全局视图，用于监控系统的整体健康状况。通过`GET /dashboard/overview`端点，管理员可以获取平台的关键运营指标，包括数据统计、任务状态和用户活动情况。该接口聚合了多个子系统的数据，为运维监控和系统分析提供了统一的数据入口。

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L428-L451)

## 核心指标说明

系统大盘API返回三大类核心指标：`data_stats`（数据统计）、`task_stats`（任务统计）和`user_stats`（用户统计）。这些指标为管理员提供了平台运行状况的全面视图。

### 数据统计 (data_stats)

`data_stats`指标反映了平台的数据资产状况，主要包含以下字段：

- **total_stocks**: 平台中总的股票数量，表示数据覆盖的证券范围
- **daily_kline_records**: 日线K线数据的总记录数，反映数据量规模
- **factor_count**: 已定义的因子总数，表示量化分析能力的丰富程度

### 任务统计 (task_stats)

`task_stats`指标展示了平台任务调度系统的运行状态，包含以下字段：

- **running_backtests**: 当前正在运行的回测任务数量，反映系统计算负载
- **pending_tasks**: 处于待处理状态的任务数量，包括等待执行的回测和数据同步任务
- **today_completed**: 当日已完成的任务总数，反映系统处理效率

### 用户统计 (user_stats)

`user_stats`指标提供了平台用户活动情况的概览，包含以下字段：

- **total_users**: 平台注册用户的总数
- **active_users**: 活跃用户数量，通常指在过去24小时内有登录或操作行为的用户

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L435-L450)

## 接口聚合逻辑

`GET /dashboard/overview`端点通过聚合多个底层服务的数据来构建完整的系统视图。该接口的实现逻辑如下：

1. **数据来源整合**：接口从数据服务、任务调度服务和用户服务等多个子系统收集数据
2. **实时状态查询**：对于任务统计，查询任务调度系统的执行记录表，统计不同状态的任务数量
3. **数据量计算**：对于数据统计，从数据库中查询股票列表、K线数据表和因子定义表，计算相应的记录数
4. **用户活跃度分析**：通过查询用户登录日志和操作记录，确定活跃用户数量
5. **结果聚合**：将各个子系统的查询结果整合到一个统一的响应对象中

这种聚合方式使得管理员可以通过单个API调用获取系统的全局状态，而无需分别调用多个接口。

**Section sources**
- [dashboard.py](file://zquant/api/v1/dashboard.py)
- [dashboard.py](file://zquant/services/dashboard.py)

## JSON响应示例

以下是`GET /dashboard/overview`端点的完整JSON响应示例，展示了实际返回的数据结构：

```json
{
  "data_stats": {
    "total_stocks": 5000,
    "daily_kline_records": 1000000,
    "factor_count": 150
  },
  "task_stats": {
    "running_backtests": 2,
    "pending_tasks": 5,
    "today_completed": 23
  },
  "user_stats": {
    "total_users": 100,
    "active_users": 45
  }
}
```

此响应示例展示了平台的典型状态：
- 数据层面：包含5000只股票，约100万条日线数据记录，以及150个已定义的量化因子
- 任务层面：有2个回测任务正在运行，5个任务等待处理，当日已完成23个任务
- 用户层面：共有100个注册用户，其中45个为活跃用户

开发者可以基于此响应结构构建监控面板，通过可视化图表展示各项指标的变化趋势，或进行系统性能分析。

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L434-L451)
- [index.tsx](file://web/src/pages/dashboard/index.tsx)