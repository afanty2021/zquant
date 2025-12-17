# 自定义Hook

<cite>
**本文档引用的文件**
- [useGlobalTabs.ts](file://web/src/hooks/useGlobalTabs.ts)
- [usePageCache.ts](file://web/src/hooks/usePageCache.ts)
- [useDataQuery.ts](file://web/src/hooks/useDataQuery.ts)
- [useDataSync.ts](file://web/src/hooks/useDataSync.ts)
- [PageCacheContext.tsx](file://web/src/contexts/PageCacheContext.tsx)
- [GlobalTabsProvider/index.tsx](file://web/src/components/GlobalTabsProvider/index.tsx)
</cite>

## 目录
1. [多标签页状态管理](#多标签页状态管理)
2. [页面状态缓存机制](#页面状态缓存机制)
3. [数据查询与同步Hook](#数据查询与同步Hook)
4. [自定义Hook开发规范](#自定义Hook开发规范)

## 多标签页状态管理

`useGlobalTabs` Hook是zquant前端实现多标签页功能的核心，负责管理标签页的添加、移除、切换等操作，并维护标签页状态与路由的同步。

该Hook通过`useState`维护两个核心状态：`tabs`数组存储所有标签页信息，`activeKey`记录当前激活的标签页。其核心方法`addTab`、`removeTab`和`changeTab`均使用`useCallback`进行优化，确保函数引用的稳定性。

`addTab`方法首先检查要添加的标签页是否已存在。如果存在，则更新其标题（以支持国际化语言切换），并激活该标签页；如果不存在，则将其添加到标签页数组中。当标签页数量超过预设的`MAX_TABS`（10个）限制时，会根据当前激活标签页的位置智能移除最旧的标签页：如果激活标签页不是第一个，则移除第一个；如果是第一个，则移除第二个，从而保护用户当前正在查看的内容。

`removeTab`方法在关闭标签页时，会判断被关闭的是否为当前激活的标签页。如果是，则需要重新选择下一个激活的标签页。选择策略是优先选择右侧的标签页，如果没有右侧标签页，则选择最右侧的标签页。在更新标签页状态后，会通过`history.push`跳转到新激活标签页对应的路由路径，实现UI与路由的同步。

`changeTab`方法则直接处理标签页的切换，更新`activeKey`状态，并通过`history.push`导航到对应路径。

此外，`getTabTitleByPath`方法通过遍历路由配置`routes`，根据路径查找对应的国际化菜单标题，为标签页提供准确的显示名称。

**Section sources**
- [useGlobalTabs.ts](file://web/src/hooks/useGlobalTabs.ts#L23-L158)
- [GlobalTabsProvider/index.tsx](file://web/src/components/GlobalTabsProvider/index.tsx#L97-L161)

## 页面状态缓存机制

`usePageCache` Hook封装了`PageCacheContext`，提供了一套便捷的页面状态缓存操作API。其核心思想是基于当前路由路径（`pathname`）作为缓存的唯一键（key），自动管理不同页面的独立状态。

该Hook内部使用`useLocation`获取当前路由信息，并通过`useRef`创建一个`currentPathRef`来存储当前路径。`useEffect`用于在路由变化时及时更新这个ref，确保后续的缓存操作都基于最新的路径。

`usePageCache`提供了基础的缓存操作方法（`save`、`get`、`clear`、`has`、`update`）和一系列便捷方法。便捷方法如`saveFormValues`、`getFormValues`、`saveDataSource`、`getDataSource`、`saveModalState`、`getModalState`等，允许开发者以更语义化的方式操作缓存中的特定数据，如表单值、表格数据源和弹窗显示状态。

`update`方法是`save`的增强版，它会先获取当前页面的现有缓存，然后与新传入的部分缓存进行合并，避免了覆盖其他缓存数据的风险。这种设计使得状态管理更加灵活和安全。

**Section sources**
- [usePageCache.ts](file://web/src/hooks/usePageCache.ts#L23-L161)
- [PageCacheContext.tsx](file://web/src/contexts/PageCacheContext.tsx#L23-L157)

## 数据查询与同步Hook

zquant前端通过`useDataQuery`和`useDataSync`两个Hook实现了数据相关逻辑的职责分离。

`useDataQuery` Hook专注于处理表格数据的查询。它接收一个`queryFn`（查询函数）、`getItems`（从响应中提取数据项的函数）和`getKey`（生成数据项唯一key的函数）。该Hook内部管理`dataSource`（表格数据）、`rawData`（原始数据）和`loading`状态。`handleQuery`方法是其核心，它会取消之前的请求（通过`AbortController`），执行新的查询，并将结果格式化为包含`key`属性的表格数据。它还支持通过`options.enableCache`启用缓存功能，查询结果可以自动保存到`usePageCache`中，下次进入页面时可恢复。

`useDataSync` Hook则用于处理从API获取数据的同步操作，常用于需要弹窗展示结果的场景。它管理`result`（API返回结果）、`modalVisible`（弹窗可见性）和`loading`状态。`handleFetchFromApi`方法执行API调用，支持参数校验（如`validateTsCodes`），并将结果、请求参数和弹窗状态保存到页面缓存中。`closeModal`方法在关闭弹窗时，会同步更新缓存中的弹窗状态，确保用户下次进入页面时能恢复之前的弹窗状态。

这种分离设计使得`useDataQuery`更侧重于列表数据的展示和交互，而`useDataSync`更侧重于一次性数据获取和状态管理，职责清晰，复用性强。

**Section sources**
- [useDataQuery.ts](file://web/src/hooks/useDataQuery.ts#L23-L241)
- [useDataSync.ts](file://web/src/hooks/useDataSync.ts#L23-L207)

## 自定义Hook开发规范

zquant前端的自定义Hook遵循一系列最佳实践，确保代码的健壮性和可维护性。

在**依赖数组管理**方面，所有使用`useCallback`和`useEffect`的Hook都仔细分析了其依赖项。例如，`useGlobalTabs`中的`addTab`和`removeTab`方法依赖`activeKey`，以确保在`activeKey`变化时回调函数能正确引用最新的值。`usePageCache`中的`save`、`get`等方法则依赖`saveCache`、`getCache`等上下文方法，确保这些方法更新时回调函数也能更新。

在**副作用处理**上，Hook充分利用了`useEffect`。`usePageCache`使用`useEffect`来监听路由变化并更新`currentPathRef`。`useDataQuery`使用`useEffect`在组件初始化时尝试从缓存恢复数据。对于异步操作，如API调用，都使用了`AbortController`来处理请求取消，避免了内存泄漏和状态错乱。

在**类型定义**方面，代码具有高度的TypeScript友好性。`useGlobalTabs`定义了`TabItem`接口来描述标签页数据结构。`usePageCache`定义了`PageCache`接口，明确支持`dataSource`、`formValues`、`rawData`、`modalStates`等多种缓存类型。`useDataQuery`和`useDataSync`都使用了泛型（`TItem`, `TParams`, `TResponse`），使得Hook可以处理不同类型的数据，极大地增强了其通用性。

这些规范共同保证了自定义Hook的高质量，使其成为构建复杂前端应用的可靠基石。

**Section sources**
- [useGlobalTabs.ts](file://web/src/hooks/useGlobalTabs.ts)
- [usePageCache.ts](file://web/src/hooks/usePageCache.ts)
- [useDataQuery.ts](file://web/src/hooks/useDataQuery.ts)
- [useDataSync.ts](file://web/src/hooks/useDataSync.ts)