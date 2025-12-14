[根目录](../../CLAUDE.md) > [web](../) > **web - 前端应用**

# ZQuant 前端应用

> 模块路径: `/web`
> 主要技术: React 19, TypeScript, Ant Design Pro, UmiJS

## 模块职责

ZQuant前端应用提供用户友好的Web界面，实现：
- 量化策略管理与配置
- 回测任务创建与结果查看
- 股票数据查询与图表展示
- 用户账户与权限管理
- 系统大盘与监控

## 入口与启动

### 主入口文件
- **`src/app.tsx`** - 应用根组件，配置全局布局和路由
- **`src/access.ts`** - 权限控制入口
- **`.umirc.ts`** - UmiJS配置文件（通过config目录管理）

### 启动方式
```bash
# 安装依赖
yarn install

# 开发模式启动
yarn dev

# 构建生产版本
yarn build

# 预览构建结果
yarn preview
```

### 环境配置
- **`.env`** - 环境变量配置
- **`config/`** - 应用配置目录

## 项目结构

```
src/
├── access.ts            - 权限控制
├── app.tsx             - 应用根组件
├── components/         - 通用组件
│   ├── DataTable/      - 数据表格组件
│   ├── DataTablePage/  - 表格页面组件
│   ├── Footer/         - 页脚组件
│   ├── GlobalTabs/     - 全局标签页
│   ├── HeaderDropdown/ - 头部下拉菜单
│   ├── MenuSearch/     - 菜单搜索
│   └── RightContent/   - 右侧内容区
├── pages/              - 页面组件
│   ├── Backtest/       - 回测页面
│   ├── Data/           - 数据页面
│   ├── Factor/         - 因子页面
│   ├── User/           - 用户页面
│   └── ...
├── services/           - API服务
├── utils/              - 工具函数
└── locales/            - 国际化文件
```

## 页面模块

### 1. 回测模块 (`pages/Backtest/`)
- **功能**: 创建回测任务、查看回测结果
- **组件**: 策略配置、参数设置、结果图表
- **相关API**: `/api/v1/backtest/*`

### 2. 数据模块 (`pages/Data/`)
- **功能**: 股票数据查询、图表展示
- **组件**: 数据表格、K线图、筛选器
- **相关API**: `/api/v1/data/*`

### 3. 因子模块 (`pages/Factor/`)
- **功能**: 因子计算、因子分析
- **组件**: 因子列表、计算结果、相关性分析
- **相关API**: `/api/v1/factor/*`

### 4. 用户模块 (`pages/User/`)
- **功能**: 用户管理、权限设置
- **组件**: 用户列表、角色管理、权限分配
- **相关API**: `/api/v1/users/*`, `/api/v1/roles/*`

## 通用组件

### 1. DataTable (`components/DataTable/`)
高性能数据表格组件，支持：
- 分页加载
- 排序和筛选
- 列配置
- 操作按钮

### 2. GlobalTabs (`components/GlobalTabs/`)
全局标签页管理，支持：
- 标签页缓存
- 关闭和刷新
- 快速导航

### 3. HeaderDropdown (`components/HeaderDropdown/`)
用户菜单下拉，包含：
- 用户信息
- 设置选项
- 退出登录

## API服务层

### 服务结构
```
services/
├── api.ts              - API配置
├── backtest.ts         - 回测服务
├── data.ts             - 数据服务
├── factor.ts           - 因子服务
├── user.ts             - 用户服务
└── ...
```

### API请求封装
- 使用UmiJS的request方法
- 统一错误处理
- 请求/响应拦截
- Token自动附加

## 配置管理

### 配置文件目录
```
config/
├── config.ts           - 主配置文件
├── routes.ts           - 路由配置
├── defaultSettings.ts  - 默认设置
├── proxy.ts            - 代理配置
├── api.ts              - API配置
└── oneapi.json         - OneAPI配置
```

### 关键配置项
- **API代理**: 开发环境API代理配置
- **路由配置**: 页面路由和菜单
- **主题配置**: Ant Design主题定制
- **国际化**: 多语言支持

## 状态管理

### 数据流
- 页面组件通过API服务获取数据
- 使用React Hooks管理组件状态
- 全局状态通过Context管理

### 关键状态
- 用户信息和权限
- 当前选中的股票/策略
- 全局设置和配置

## 样式与主题

### 样式方案
- **CSS Modules**: 局部作用域样式
- **antd-style**: CSS-in-JS方案
- **主题变量**: Ant Design主题定制

### 主题定制
```typescript
// config/defaultSettings.ts
export default {
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'ZQuant量化分析平台',
  logo: '/logo.svg',
};
```

## 工具函数

### 常用工具
- **日期格式化**: dayjs
- **数据处理**: 工具函数库
- **图表工具**: echarts封装

## 性能优化

### 优化策略
- **路由懒加载**: 按需加载页面组件
- **组件懒加载**: 大型组件延迟加载
- **虚拟滚动**: 大数据量表格优化
- **缓存策略**: API响应缓存

## 测试

### 测试配置
- **Jest**: 单元测试框架
- **Testing Library**: React组件测试
- **Mock数据**: 接口模拟

### 运行测试
```bash
# 运行所有测试
yarn test

# 生成覆盖率报告
yarn test:coverage

# 监听模式
yarn test --watch
```

## 构建与部署

### 构建流程
1. TypeScript编译
2. 代码压缩和优化
3. 资源打包
4. 生成dist目录

### 环境配置
- **开发环境**: `yarn start:dev`
- **测试环境**: `yarn start:test`
- **生产环境**: `yarn build`

## 开发规范

### 代码规范
- **TypeScript**: 严格类型检查
- **ESLint**: 代码质量检查
- **Biome**: 代码格式化和检查
- **Prettier**: 代码格式化

### 组件规范
- 使用函数式组件和Hooks
- 组件名使用PascalCase
- Props接口必须定义
- 必须有默认导出

### 命名规范
- **文件名**: kebab-case
- **组件名**: PascalCase
- **变量名**: camelCase
- **常量名**: UPPER_SNAKE_CASE

## 常见问题 (FAQ)

### Q: 如何添加新页面？
A: 1. 在`pages/`下创建页面组件 2. 在`config/routes.ts`中添加路由 3. 更新菜单配置

### Q: 如何自定义主题？
A: 在`config/defaultSettings.ts`中修改主题配置，或在组件中使用`useTheme`钩子

### Q: 如何处理API错误？
A: 统一在`services/`中处理错误，使用`notification`显示错误信息

### Q: 如何实现权限控制？
A: 在`src/access.ts`中定义权限函数，在路由配置中使用`access`属性

## 相关文件清单

### 核心文件
- `package.json` - 项目依赖和脚本
- `tsconfig.json` - TypeScript配置
- `.umirc.ts` - UmiJS配置
- `src/app.tsx` - 应用入口

### 配置文件
- `config/routes.ts` - 路由配置
- `config/config.ts` - 主配置
- `config/defaultSettings.ts` - 默认设置

### 组件文件
- `src/components/` - 通用组件
- `src/pages/` - 页面组件
- `src/services/` - API服务

## 变更记录 (Changelog)

### 2025-12-14 17:01:13
- 📝 **初始化前端模块文档**
- 🔗 **添加导航面包屑**
- 🧩 **整理组件结构和说明**
- 📋 **更新开发规范和FAQ**