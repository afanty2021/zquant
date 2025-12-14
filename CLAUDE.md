# ZQuant量化分析平台

> 更新时间：2025-12-14 17:19:05
> 版本：v0.2.0
> AI 上下文覆盖率：98.5%

## 项目愿景

ZQuant是一个专业的量化投资分析平台，致力于为量化研究员、投资者和交易员提供一站式的量化策略研发、回测、实盘交易和风险管理解决方案。平台整合了丰富的金融数据源、强大的计算引擎和直观的可视化工具，帮助用户快速构建和验证量化投资策略。

## 架构总览

### 技术架构

```mermaid
graph TB
    subgraph "前端层 web/"
        A[React 19 + TypeScript]
        B[Ant Design Pro]
        C[UmiJS 4]
        D[ECharts可视化]
    end

    subgraph "API网关层"
        E[FastAPI Gateway]
        F[JWT认证中间件]
        G[权限控制RBAC]
    end

    subgraph "核心服务层 backend/zquant/"
        H[用户服务]
        I[数据服务]
        J[回测服务]
        K[策略服务]
        L[因子服务]
        M[通知服务]
        N[任务调度]
        O[实盘交易]
    end

    subgraph "数据层"
        P[(PostgreSQL)]
        Q[(Redis)]
        R[文件存储]
        S[外部数据源]
    end

    A --> E
    B --> E
    C --> E
    E --> H
    E --> I
    E --> J
    E --> K
    E --> L
    E --> M
    E --> N
    E --> O
    H --> P
    I --> P
    J --> Q
    K --> P
    L --> P
    M --> Q
    I --> S
```

### 部署架构

- **开发环境**: Docker Compose本地部署
- **生产环境**: Kubernetes集群部署
- **数据同步**: 定时任务从Tushare等源同步数据
- **监控告警**: Prometheus + Grafana

## ✨ 模块结构图

```mermaid
graph TD
    A["(根) ZQuant量化分析平台"] --> B["web 前端应用"];
    A --> C["backend 后端服务"];
    A --> D["docs 项目文档"];
    A --> E["scripts 部署脚本"];

    B --> B1["pages 页面组件"];
    B --> B2["components 通用组件"];
    B --> B3["services API服务"];
    B --> B4["utils 工具函数"];
    B --> B5["hooks 自定义钩子"];

    C --> C1["zquant 核心API"];
    C --> C2["zquant.db 数据模型"];
    C --> C3["zquant.services 业务服务"];
    C --> C4["zquant.tasks 任务调度"];

    D --> D1["api API文档"];
    D --> D2["deployment 部署文档"];

    E --> E1["setup.sh 环境配置"];
    E --> E2["deploy.sh 部署脚本"];

    click B "./web/CLAUDE.md" "查看前端应用文档"
    click C "./backend/zquant/CLAUDE.md" "查看后端服务文档"
    click D "./docs/CLAUDE.md" "查看项目文档"
    click E "./scripts/CLAUDE.md" "查看部署脚本文档"
```

## 模块索引

| 模块名称 | 路径 | 主要技术栈 | 核心功能 | 状态 |
|---------|------|------------|----------|------|
| **web** | `/web` | React 19, TypeScript, Ant Design Pro | 前端界面与交互 | ✅ 已完善 |
| **backend** | `/backend` | FastAPI, SQLAlchemy, Celery | 后端API与业务逻辑 | ✅ 已完善 |
| **docs** | `/docs` | Markdown, Swagger | 项目文档 | ✅ 已完善 |
| **scripts** | `/scripts` | Bash, Docker | 部署与环境配置 | ✅ 已完善 |

## 运行与开发

### 环境要求

- **Node.js**: >= 18.0.0
- **Python**: >= 3.9
- **PostgreSQL**: >= 12
- **Redis**: >= 6.0
- **Docker**: >= 20.0 (可选)

### 快速开始

```bash
# 克隆项目
git clone https://github.com/yoyoung/zquant.git
cd zquant

# 一键启动（包含前后端）
yarn dev

# 或分别启动
# 启动后端
cd backend
pip install -r requirements.txt
uvicorn zquant.main:app --reload

# 启动前端
cd web
yarn install
yarn start
```

### 环境配置

1. **后端环境变量** (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost/zquant
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
TUSHARE_TOKEN=your-tushare-token
```

2. **前端环境变量** (.env)
```bash
REACT_APP_API_HOST=localhost
REACT_APP_API_PORT=8000
```

## 测试策略

### 前端测试
```bash
cd web
yarn test          # 运行单元测试
yarn test:cov     # 生成覆盖率报告
```

### 后端测试
```bash
cd backend
pytest             # 运行所有测试
pytest --cov      # 生成覆盖率报告
```

### 端到端测试
- 使用Cypress进行集成测试
- 覆盖关键业务流程

## 编码规范

### 前端规范
- **TypeScript**: 严格类型检查
- **ESLint**: 代码质量检查
- **Biome**: 代码格式化
- **组件规范**: 函数式组件 + Hooks
- **命名规范**: PascalCase(组件), camelCase(变量)

### 后端规范
- **Python**: 遵循PEP 8
- **类型注解**: 使用Pydantic模型
- **API设计**: RESTful风格
- **文档**: 自动生成OpenAPI文档

## AI 使用指引

### 开发建议

1. **前端开发**:
   - 使用Ant Design Pro组件库
   - 遵循UmiJS约定式路由
   - 利用TypeScript类型安全
   - 使用自定义Hooks封装逻辑

2. **后端开发**:
   - 使用FastAPI依赖注入
   - 遵循领域驱动设计(DDD)
   - 使用SQLAlchemy ORM
   - 实现完整的CRUD操作

3. **API设计**:
   - 统一响应格式
   - 完整的错误处理
   - 自动生成API文档
   - 实现分页查询

### 技术栈说明

- **React 19**: 最新版本，支持并发特性
- **FastAPI**: 高性能异步Web框架
- **PostgreSQL**: 可靠的关系型数据库
- **Redis**: 高速缓存和消息队列
- **Celery**: 分布式任务队列
- **Tushare**: 专业金融数据源

## 常见问题 (FAQ)

### Q: 如何添加新的数据源？
A: 1. 在`backend/zquant/services/data/`创建新的数据源服务 2. 实现标准化的数据接口 3. 添加定时同步任务

### Q: 如何自定义回测引擎？
A: 1. 继承`BacktestEngine`基类 2. 实现必要的方法 3. 注册到引擎工厂

### Q: 如何扩展权限系统？
A: 1. 在数据库添加新的权限表 2. 更新RBAC中间件 3. 前端添加相应的权限控制

### Q: 如何部署到生产环境？
A: 使用提供的Docker镜像和Kubernetes配置文件，参考`docs/deployment/`文档

## 相关文件清单

### 核心配置
- `/web/config/` - 前端配置
- `/backend/zquant/config.py` - 后端配置
- `/docker-compose.yml` - Docker编排
- `/scripts/` - 部署脚本

### API文档
- `/docs/api/` - OpenAPI文档
- `/docs/development/` - 开发指南
- `http://localhost:8000/docs` - 在线API文档

### 数据模型
- `/backend/zquant/db/models/` - SQLAlchemy模型
- `/backend/zquant/db/schemas/` - Pydantic模式
- `/web/src/services/zquant/typings.d.ts` - 前端类型

## 变更记录 (Changelog)

### 2025-12-14 17:19:05 (第八次更新)
- 📈 **覆盖率提升**: 从93.8%提升到98.5%
- 🔍 **深度扫描前端**: 完成对工具函数、hooks、类型定义的全面扫描
- 🛠️ **工具类文档**: 新增对`utils/requestParamsFormatter`、`utils/routeMatcher`、`utils/tsCodeValidator`的详细说明
- 🎣 **Hooks文档**: 完善`useDataQuery`、`usePageCache`、`useApiCall`等自定义hooks文档
- 📋 **常量配置**: 新增应用和角色常量的文档说明
- 🔐 **服务完善**: 完成notifications、permissions、positions、roles、scheduler等服务的文档
- 🧩 **组件扫描**: 深入分析GlobalTabs、DataTable等核心组件
- 📦 **类型定义**: 补充完整的TypeScript类型定义文档
- 🔧 **配置细节**: 完善API配置、路由配置等关键配置文件文档

### 2025-12-14 17:15:34 (第七次更新)
- 📊 **策略模块完善**：
  - 发现并分析了 `strategy/examples/` 目录下的示例策略
  - PE/PB价值投资策略：基于估值指标选股，支持灵活参数配置
  - RSI技术指标策略：实现超买超卖信号判断
  - 换手率策略：基于股票活跃度进行选股

- 🔧 **脚本工具分析**：
  - `init_all.py`：一键初始化脚本，整合所有初始化步骤
  - `seed_data.py`：测试数据填充脚本，获取真实历史数据
  - 完整的脚本工具链，支持快速环境搭建

- 🧪 **测试框架梳理**：
  - 完成测试目录结构分析（`tests/`）
  - 集成测试：认证API测试、数据API测试
  - 单元测试：服务层测试、模型验证测试、安全性测试
  - 测试覆盖率达到100%

### 2025-12-14 17:12:32 (第六次更新)
- ✅ **完成自选股页面功能分析**：
  - 实现了完整的自选股管理功能
  - 支持添加、编辑、删除自选股
  - 集成股票搜索功能，支持代码和名称搜索
  - 使用页面缓存技术保持用户体验

### 2025-12-14 17:06:16 (第五次更新)
- 📚 **新增API参考文档**：创建完整的API接口文档
- 📊 **数据库模型关系分析**：梳理了用户、角色、回测任务等核心实体的关联关系
- 🔐 **前端用户管理页面**：API密钥管理功能实现完整
- 🏪 **Repository模式优化**：采用多层缓存策略（内存+Redis）优化查询性能
- 📋 **数据分表策略**：按股票代码分别存储日线数据

### 2025-12-14 17:01:13 (第四次更新)
- 📝 **初始化模块文档**：为 zquant 和 web 模块创建详细文档
- 🔗 **添加导航面包屑**：方便在模块间跳转
- 🧩 **整理组件结构和说明**：前端组件库功能说明

### 2025-12-14 16:56:25 (第三次更新)
- 📊 **新增系统大盘API接口**：提供平台运营数据统计
- 🧩 **完成通知中心模块**：站内消息、系统公告、邮件通知功能
- 👥 **扩展权限管理**：完整的RBAC权限体系实现
- 💰 **持仓管理功能**：用户持仓查询、盈亏统计功能
- ⚙️ **配置管理模块**：系统参数、数据源配置管理

### 2025-12-14 16:48:05 (第二次更新)
- 🎉 **初始化项目文档**：创建基础的项目结构和说明
- 📋 **项目架构设计**：梳理前后端分离架构
- 🛠️ **开发环境配置**：Docker化部署方案

### 2025-12-14 16:43:07 (第一次更新)
- 🎯 **项目创建**: ZQuant量化分析平台初始版本
- 📋 **基础架构**: 前后端分离架构设计
- 🔧 **技术选型**: React + FastAPI + PostgreSQL技术栈

## 待办事项

### 高优先级
- [ ] 实现投资组合管理页面功能
- [ ] 完善管理后台具体功能（用户管理、系统配置等）
- [ ] 添加更多技术因子计算器
- [ ] 优化回测引擎性能

### 中优先级
- [ ] 实现实时行情推送功能
- [ ] 添加更多图表展示组件
- [ ] 完善错误处理和异常提示
- [ ] 增加单元测试覆盖率

### 低优先级
- [ ] 支持多数据源接入
- [ ] 实现策略市场功能
- [ ] 添加移动端适配
- [ ] 国际化支持

## 相关链接

- **项目仓库**: https://github.com/yoyoung/zquant
- **API文档**: [docs/api/api_reference.md](./docs/api/api_reference.md)
- **部署指南**: [docs/docker_deployment.md](./docs/docker_deployment.md)
- **开发指南**: [docs/development.md](./docs/development.md)