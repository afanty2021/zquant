# ZQuant API 文档

> 更新时间：2025-12-14 17:08:56
> 版本：v0.2.0

## 概述

ZQuant量化分析平台 RESTful API 文档，提供完整的量化分析服务接口。

**Base URL**: `http://localhost:8000/api/v1`

## 认证方式

### 1. JWT Token 认证
```bash
# 在请求头中添加
Authorization: Bearer <your_jwt_token>
```

### 2. API Key 认证
```bash
# 在请求头中添加
X-API-Key: <your_access_key>
X-API-Secret: <your_secret_key>
```

## API 分类

### 1. 认证模块 (Auth)

#### 用户登录
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**响应示例**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_info": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### 刷新Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "string"
}
```

#### 用户登出
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

#### 获取当前用户信息
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### 2. 用户管理 (Users)

#### 获取用户列表
```http
GET /api/v1/users?page=1&size=20&search=keyword
Authorization: Bearer <token>
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `size`: 每页数量 (默认: 20)
- `search`: 搜索关键词 (用户名或邮箱)

#### 创建用户
```http
POST /api/v1/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role_id": 1,
  "is_active": true
}
```

#### 更新用户
```http
PUT /api/v1/users/{user_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "string",
  "role_id": 1,
  "is_active": true
}
```

#### 删除用户
```http
DELETE /api/v1/users/{user_id}
Authorization: Bearer <token>
```

#### 获取用户API密钥
```http
GET /api/v1/users/me/apikeys
Authorization: Bearer <token>
```

#### 创建API密钥
```http
POST /api/v1/users/me/apikeys
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string"  // 可选，密钥名称
}
```

**响应示例**:
```json
{
  "id": 1,
  "access_key": "ak_xxxxxxxxxxxxxxxx",
  "secret_key": "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "message": "请妥善保管secret_key，系统不会再次显示"
}
```

#### 删除API密钥
```http
DELETE /api/v1/users/me/apikeys/{key_id}
Authorization: Bearer <token>
```

### 3. 角色权限管理 (Roles & Permissions)

#### 获取角色列表
```http
GET /api/v1/roles
Authorization: Bearer <token>
```

#### 创建角色
```http
POST /api/v1/roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "permissions": [1, 2, 3]  // 权限ID列表
}
```

#### 获取权限列表
```http
GET /api/v1/permissions
Authorization: Bearer <token>
```

### 4. 数据服务 (Data)

#### 获取股票列表
```http
GET /api/v1/data/stocks?page=1&size=20&market=SZ&industry=银行
Authorization: Bearer <token>
```

**查询参数**:
- `page`: 页码
- `size`: 每页数量
- `market`: 市场类型 (SZ/SH)
- `industry`: 所属行业
- `search`: 搜索关键词

**响应示例**:
```json
{
  "total": 4000,
  "page": 1,
  "size": 20,
  "data": [
    {
      "ts_code": "000001.SZ",
      "symbol": "000001",
      "name": "平安银行",
      "market": "SZ",
      "industry": "银行",
      "list_date": "1991-04-03"
    }
  ]
}
```

#### 获取K线数据
```http
GET /api/v1/data/kline?ts_code=000001.SZ&start_date=20240101&end_date=20240131
Authorization: Bearer <token>
```

**查询参数**:
- `ts_code`: 股票代码 (必需)
- `start_date`: 开始日期 (YYYYMMDD)
- `end_date`: 结束日期 (YYYYMMDD)
- `freq`: K线周期 (D日线/W周线/M月线，默认D)

#### 获取财务数据
```http
GET /api/v1/data/financial?ts_code=000001.SZ&report_date=20231231
Authorization: Bearer <token>
```

#### 获取交易日历
```http
GET /api/v1/data/tradecal?exchange=SSE&start_date=20240101&end_date=20240131
Authorization: Bearer <token>
```

### 5. 因子管理 (Factor)

#### 获取因子列表
```http
GET /api/v1/factor/definitions?page=1&size=20&enabled=true
Authorization: Bearer <token>
```

#### 创建因子定义
```http
POST /api/v1/factor/definitions
Authorization: Bearer <token>
Content-Type: application/json

{
  "factor_name": "string",
  "cn_name": "string",
  "en_name": "string",
  "column_name": "string",
  "description": "string"
}
```

#### 配置因子
```http
POST /api/v1/factor/definitions/{factor_id}/config
Authorization: Bearer <token>
Content-Type: application/json

{
  "enabled": true,
  "mappings": [
    {
      "model_id": 1,
      "codes": ["000001", "000002"]  // 可选，为空表示全市场
    }
  ]
}
```

#### 计算因子
```http
POST /api/v1/factor/calculate
Authorization: Bearer <token>
Content-Type: application/json

{
  "factor_ids": [1, 2, 3],
  "start_date": "20240101",
  "end_date": "20240131",
  "codes": ["000001", "000002"]  // 可选
}
```

#### 获取因子数据
```http
GET /api/v1/factor/data?factor_name=MA_5&ts_code=000001.SZ&start_date=20240101&end_date=20240131
Authorization: Bearer <token>
```

### 6. 回测管理 (Backtest)

#### 创建回测任务
```http
POST /api/v1/backtest/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "strategy_code": "string",  // Python策略代码
  "config": {
    "start_date": "20240101",
    "end_date": "20241231",
    "initial_capital": 1000000,
    "benchmark": "000300.SH"
  }
}
```

#### 查询回测结果
```http
GET /api/v1/backtest/results/{task_id}
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "task_id": "uuid-string",
  "status": "completed",
  "result": {
    "total_return": 0.2345,
    "annual_return": 0.1892,
    "max_drawdown": -0.0823,
    "sharpe_ratio": 1.45,
    "win_rate": 0.62,
    "trades": [
      {
        "date": "20240102",
        "symbol": "000001.SZ",
        "action": "buy",
        "price": 12.50,
        "quantity": 1000,
        "amount": 12500
      }
    ],
    "daily_positions": [
      {
        "date": "20240102",
        "cash": 987500,
        "positions": [
          {
            "symbol": "000001.SZ",
            "quantity": 1000,
            "price": 12.50,
            "market_value": 12500
          }
        ]
      }
    ]
  }
}
```

#### 获取策略列表
```http
GET /api/v1/backtest/strategies?page=1&size=20&category=technical
Authorization: Bearer <token>
```

#### 保存策略
```http
POST /api/v1/backtest/strategies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "category": "technical",
  "code": "string",
  "params_schema": {}
}
```

### 7. 调度管理 (Scheduler)

#### 获取调度任务列表
```http
GET /api/v1/scheduler/tasks
Authorization: Bearer <token>
```

#### 创建调度任务
```http
POST /api/v1/scheduler/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "task_type": "common_task",
  "cron_expression": "0 18 * * *",
  "description": "string",
  "config": {}
}
```

#### 手动执行任务
```http
POST /api/v1/scheduler/tasks/{task_id}/execute
Authorization: Bearer <token>
```

#### 获取任务执行历史
```http
GET /api/v1/scheduler/tasks/{task_id}/executions?page=1&size=20
Authorization: Bearer <token>
```

### 8. 系统大盘 (Dashboard)

#### 获取系统概览
```http
GET /api/v1/dashboard/overview
Authorization: Bearer <token>
```

**响应示例**:
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

### 9. 我的自选 (Favorites)

#### 获取自选股列表
```http
GET /api/v1/favorites
Authorization: Bearer <token>
```

#### 添加自选股
```http
POST /api/v1/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "000001",
  "comment": "string"
}
```

#### 删除自选股
```http
DELETE /api/v1/favorites/{code}
Authorization: Bearer <token>
```

### 10. 我的持仓 (Positions)

#### 获取持仓列表
```http
GET /api/v1/positions
Authorization: Bearer <token>
```

#### 更新持仓
```http
PUT /api/v1/positions/{code}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 1000,
  "avg_cost": 12.50,
  "comment": "string"
}
```

### 11. 通知中心 (Notifications)

#### 获取通知列表
```http
GET /api/v1/notifications?page=1&size=20&is_read=false
Authorization: Bearer <token>
```

#### 标记通知已读
```http
PUT /api/v1/notifications/{id}/read
Authorization: Bearer <token>
```

#### 标记所有通知已读
```http
PUT /api/v1/notifications/read-all
Authorization: Bearer <token>
```

### 12. 系统配置 (Config)

#### 获取配置项
```http
GET /api/v1/config/{key}
Authorization: Bearer <token>
```

#### 更新配置项
```http
PUT /api/v1/config/{key}
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": "string",
  "comment": "string"
}
```

## 错误处理

### 标准错误响应格式
```json
{
  "detail": "错误描述信息",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 常见错误码

| HTTP状态码 | 错误类型 | 描述 |
|-----------|---------|------|
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或Token无效 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 422 | Validation Error | 数据验证失败 |
| 500 | Internal Server Error | 服务器内部错误 |

## 数据模型

### 用户模型
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### 股票模型
```typescript
interface Stock {
  ts_code: string;      // TS代码
  symbol: string;       // 股票代码
  name: string;         // 股票名称
  market: string;       // 市场类型
  industry: string;     // 所属行业
  list_date: string;    // 上市日期
}
```

### K线数据模型
```typescript
interface KLineData {
  ts_code: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
  amount: number;
}
```

### 回测结果模型
```typescript
interface BacktestResult {
  total_return: number;      // 累计收益率
  annual_return: number;     // 年化收益率
  max_drawdown: number;      // 最大回撤
  sharpe_ratio: number;      // 夏普比率
  win_rate: number;          // 胜率
  profit_loss_ratio: number; // 盈亏比
}
```

## 接口限制

### 请求频率限制
- 普通用户：100次/分钟
- VIP用户：1000次/分钟
- 管理员：无限制

### 数据查询限制
- K线数据单次查询最多365天
- 批量股票查询最多100只
- 回测数据导出最多10000条记录

## SDK示例

### Python SDK
```python
from zquant_client import ZQuantClient

# 初始化客户端
client = ZQuantClient(
    base_url="http://localhost:8000/api/v1",
    api_key="your_access_key",
    api_secret="your_secret_key"
)

# 获取股票列表
stocks = client.get_stocks(market="SZ", page=1, size=20)

# 创建回测
result = client.run_backtest(
    strategy_code="your_strategy_code",
    config={
        "start_date": "20240101",
        "end_date": "20241231",
        "initial_capital": 1000000
    }
)
```

### JavaScript SDK
```javascript
import { ZQuantClient } from 'zquant-client-js';

// 初始化客户端
const client = new ZQuantClient({
  baseURL: 'http://localhost:8000/api/v1',
  apiKey: 'your_access_key',
  apiSecret: 'your_secret_key'
});

// 获取股票列表
const stocks = await client.getStocks({ market: 'SZ', page: 1, size: 20 });

// 创建回测
const result = await client.runBacktest({
  strategyCode: 'your_strategy_code',
  config: {
    startDate: '20240101',
    endDate: '20241231',
    initialCapital: 1000000
  }
});
```

## 更新日志

### v0.2.0 (2025-12-14)
- ✨ 新增用户API密钥管理接口
- ✨ 新增因子配置和计算接口
- ✨ 新增调度任务管理功能
- 🐛 修复回测结果查询分页问题
- 📝 完善错误响应信息

### v0.1.0 (2024-01-01)
- 🎉 初始版本发布
- ✨ 实现基础认证功能
- ✨ 实现数据查询接口
- ✨ 实现回测功能

---

*如有问题，请联系：kevin@vip.qq.com 或提交 Issue*