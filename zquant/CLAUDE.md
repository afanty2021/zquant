[根目录](../../CLAUDE.md) > **zquant - 后端核心模块**

# ZQuant 后端核心模块

> 模块路径: `/zquant`
> 主要技术: Python 3.11+, FastAPI, SQLAlchemy 2.0, MySQL, Redis

## 模块职责

ZQuant后端核心模块提供完整的量化分析平台后端服务，包括：
- RESTful API接口服务
- 量化回测引擎
- 数据采集与管理
- 用户认证与权限控制
- 定时任务调度
- 因子计算与管理

## 入口与启动

### 主入口文件
- **`main.py`** - FastAPI应用入口，配置中间件、路由和事件处理器

### 启动方式
```bash
# 开发模式启动
python -m zquant.main

# 使用uvicorn启动
uvicorn zquant.main:app --reload --host 0.0.0.0 --port 8000
```

### 应用配置
- **`config.py`** - 系统配置管理，使用Pydantic Settings
- **`.env`** - 环境变量配置文件
- **`pyproject.toml`** - 项目依赖和工具配置

## 对外接口

### API路由结构
```
/api/v1/
├── auth/          - 认证相关接口
├── users/         - 用户管理接口
├── roles/         - 角色管理接口
├── permissions/   - 权限管理接口
├── data/          - 数据服务接口
├── backtest/      - 回测相关接口
├── factor/        - 因子管理接口
├── scheduler/     - 调度任务接口
├── dashboard/     - 系统大盘接口
├── favorites/     - 我的自选接口
├── positions/     - 我的持仓接口
├── notifications/ - 通知中心接口
└── config/        - 配置管理接口
```

### 关键接口示例

#### 1. 认证接口 (`api/v1/auth.py`)
```python
# 用户登录
POST /api/v1/auth/login
# 刷新Token
POST /api/v1/auth/refresh
# 用户登出
POST /api/v1/auth/logout
```

#### 2. 回测接口 (`api/v1/backtest.py`)
```python
# 创建回测任务
POST /api/v1/backtest/run
# 查询回测结果
GET /api/v1/backtest/results/{task_id}
# 获取策略列表
GET /api/v1/backtest/strategies
```

#### 3. 数据接口 (`api/v1/data.py`)
```python
# 获取股票列表
GET /api/v1/data/stocks
# 获取K线数据
GET /api/v1/data/kline
# 获取财务数据
GET /api/v1/data/financial
```

## 核心业务服务

### Services 目录结构
```
services/
├── auth.py              - 认证服务
├── backtest.py          - 回测服务
├── data.py              - 数据服务
├── strategy.py          - 策略服务
├── factor.py            - 因子服务
├── scheduler.py         - 调度服务
├── notification.py      - 通知服务
├── user.py              - 用户服务
├── sync_strategies/     - 数据同步策略
│   ├── base.py         - 基础策略类
│   ├── factory.py      - 策略工厂
│   └── *.py            - 具体同步策略
└── ...
```

### 关键服务说明

#### 1. 认证服务 (`services/auth.py`)
- JWT Token生成和验证
- 密码加密和验证
- 权限检查和授权

#### 2. 回测服务 (`services/backtest.py`)
- 回测任务管理
- 策略执行引擎
- 绩效指标计算

#### 3. 数据服务 (`services/data.py`)
- Tushare数据获取
- 数据清洗和存储
- 数据查询接口

## 数据模型

### Models 目录结构
```
models/
├── user.py              - 用户相关模型
├── backtest.py          - 回测相关模型
├── data.py              - 数据相关模型
├── factor.py            - 因子相关模型
├── scheduler.py         - 调度任务模型
└── notification.py      - 通知模型
```

### 关键模型

#### 1. 用户模型 (`models/user.py`)
```python
class User - 用户基础信息
class Role - 角色定义
class Permission - 权限定义
class APIKey - API密钥管理
```

#### 2. 回测模型 (`models/backtest.py`)
```python
class BacktestTask - 回测任务
class Strategy - 策略定义
class BacktestResult - 回测结果
class Performance - 绩效指标
```

#### 3. 数据模型 (`models/data.py`)
```python
class Stock - 股票基础信息
class PriceData - 价格数据
class Fundamental - 财务数据
class TradingCalendar - 交易日历
```

## 回测引擎

### Backtest 目录结构
```
backtest/
├── engine.py            - 回测引擎核心
├── context.py           - 回测上下文
├── strategy.py          - 策略基类
├── order.py             - 订单管理
├── cost.py              - 成本计算
└── performance.py       - 绩效分析
```

### 回测流程
1. **初始化引擎** - 设置初始资金、手续费等参数
2. **数据准备** - 加载历史数据
3. **策略执行** - 逐日执行策略逻辑
4. **订单处理** - 处理买卖订单
5. **绩效计算** - 计算各项绩效指标

## 数据管理

### Data 目录结构
```
data/
├── storage.py           - 数据存储服务
├── storage_base.py      - 存储基类
├── processor.py         - 数据处理器
├── view_manager.py      - 数据视图管理
├── etl/                 - ETL流程
│   ├── scheduler.py     - ETL调度器
│   └── tushare.py       - Tushare数据源
└── fundamental_fields.py - 财务字段定义
```

### 数据分表策略
- 按股票代码分表存储日线数据
- 按年份分表存储分钟数据
- 自动创建和管理数据视图

## 任务调度

### Scheduler 目录结构
```
scheduler/
├── manager.py           - 调度管理器
├── executor.py          - 任务执行器
├── base.py              - 调度基类
├── job/                 - 调度任务
│   ├── base.py         - 任务基类
│   ├── sync_*.py       - 数据同步任务
│   └── example_*.py    - 示例任务
└── executors/           - 执行器实现
    ├── common_executor.py
    ├── script_executor.py
    └── workflow_executor.py
```

### 调度任务类型
- **数据同步任务** - 股票列表、日线、财务数据
- **因子计算任务** - 各种技术因子计算
- **维护任务** - 数据库优化、统计更新

## 中间件系统

### Middleware 目录
```
middleware/
├── audit.py             - 审计日志
├── logging.py           - 请求日志
├── rate_limit.py        - 限流控制
└── security.py          - 安全防护
```

### 中间件功能
- **审计日志** - 记录所有API访问
- **请求日志** - 性能监控和错误追踪
- **限流控制** - 防止API滥用
- **安全防护** - XSS防护、安全响应头

## 工具类库

### Utils 目录
```
utils/
├── cache.py             - 缓存工具
├── date_helper.py       - 日期处理
├── query_builder.py     - 查询构建器
├── encryption.py        - 加密工具
├── validators.py        - 验证器
└── redis_client.py      - Redis客户端
```

## 数据访问层

### Repositories 目录
```
repositories/
├── stock_repository.py      - 股票数据访问
├── price_data_repository.py - 价格数据访问
├── factor_repository.py     - 因子数据访问
└── trading_date_repository.py - 交易日数据访问
```

## 测试与质量

### 测试结构
```
tests/
├── conftest.py          - 测试配置
├── test_*.py           - 集成测试
└── unittest/           - 单元测试
    ├── test_auth_service.py
    ├── test_backtest_service.py
    └── ...
```

### 代码质量工具
- **Ruff** - 代码检查和格式化
- **Black** - 代码格式化
- **pytest** - 测试框架
- **pre-commit** - Git钩子

## 关键依赖与配置

### 核心依赖
```python
fastapi>=0.104.0        # Web框架
sqlalchemy>=2.0.0       # ORM
pymysql>=1.0.0          # MySQL驱动
redis>=5.0.0            # Redis客户端
celery>=5.3.0           # 异步任务队列
pandas>=2.0.0           # 数据处理
tushare>=1.2.0          # 数据源
```

### 配置说明
- **数据库配置**: MySQL连接池配置
- **Redis配置**: 缓存和任务队列
- **Tushare配置**: 需要有效的API Token
- **日志配置**: 支持文件和控制台输出

## 部署相关

### Docker 部署
- **Dockerfile**: 应用容器化
- **docker-compose.yml**: 完整的服务编排
- **docker/**: Docker相关配置

### 脚本工具
```
scripts/
├── init_db.py          - 数据库初始化
├── init_strategies.py   - 策略初始化
├── init_factor.py       - 因子初始化
└── zquant_dbtool.py    - 数据库工具
```

## 常见问题 (FAQ)

### Q: 如何添加新的数据源？
A: 在`data/etl/`目录下创建新的ETL类，继承基类并实现数据获取和清洗逻辑。

### Q: 如何自定义回测策略？
A: 继承`backtest/strategy.py`中的`BaseStrategy`类，实现`handle_data`方法。

### Q: 如何添加新的技术因子？
A: 在`factor/calculators/`目录下创建新的因子计算器，继承`BaseCalculator`类。

### Q: 如何扩展权限系统？
A: 在`models/permission.py`中定义新权限，在`core/permissions.py`中实现权限检查逻辑。

## 相关文件清单

### 核心文件
- `main.py` - 应用入口
- `config.py` - 配置管理
- `database.py` - 数据库连接
- `requirements.txt` - 依赖列表
- `alembic.ini` - 数据库迁移配置

### API文件
- `api/decorators.py` - API装饰器
- `api/deps.py` - 依赖注入
- `api/v1/*.py` - API路由实现

### 业务文件
- `services/*.py` - 业务逻辑服务
- `models/*.py` - 数据模型
- `schemas/*.py` - API数据模型

## 变更记录 (Changelog)

### 2025-12-14 17:01:13
- 📝 **初始化模块文档**
- 🔗 **添加导航面包屑**
- 📊 **整理模块结构和职责说明**
- 🛠️ **更新开发指南和常见问题**