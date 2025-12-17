# 认证API

<cite>
**本文档引用文件**   
- [api_reference.md](file://docs/api/api_reference.md)
- [auth.py](file://zquant/api/v1/auth.py)
- [auth.ts](file://web/src/services/zquant/auth.ts)
- [users.py](file://zquant/api/v1/users.py)
- [auth_service.py](file://zquant/services/auth.py)
- [apikey_service.py](file://zquant/services/apikey.py)
- [security.py](file://zquant/core/security.py)
- [user.py](file://zquant/schemas/user.py)
- [config.py](file://zquant/config.py)
</cite>

## 目录
1. [简介](#简介)
2. [认证方式](#认证方式)
3. [端点说明](#端点说明)
4. [请求示例](#请求示例)
5. [错误处理](#错误处理)
6. [安全要求](#安全要求)
7. [客户端调用示例](#客户端调用示例)

## 简介

ZQuant平台提供安全的认证API，支持JWT Bearer Token和API Key两种认证方式。本API允许用户进行登录、刷新Token、登出以及获取当前用户信息等操作。所有认证相关的端点均位于`/api/v1/auth`路径下。

**基础URL**: `http://localhost:8000/api/v1`

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L1-L25)

## 认证方式

ZQuant平台支持两种认证方式，开发者可根据应用场景选择合适的认证方法。

### 1. JWT Bearer Token 认证

JWT（JSON Web Token）认证是基于Token的无状态认证机制。用户登录成功后，服务器会返回一个访问Token（access_token）和一个刷新Token（refresh_token）。后续请求需在HTTP请求头中携带访问Token。

```bash
# 在请求头中添加
Authorization: Bearer <your_jwt_token>
```

**特点**:
- 无状态：服务器不存储会话信息
- 可扩展：Token中可携带用户信息和权限
- 时效性：Token有明确的过期时间

### 2. API Key 认证

API Key认证适用于程序化访问和自动化脚本。每个用户可以创建一个或多个API密钥对，包含访问密钥（access_key）和秘密密钥（secret_key）。

```bash
# 在请求头中添加
X-API-Key: <your_access_key>
X-API-Secret: <your_secret_key>
```

**特点**:
- 适合机器对机器的通信
- 可为不同应用创建不同的密钥
- 支持密钥的创建、查看和删除管理

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L12-L25)
- [auth.py](file://zquant/api/v1/auth.py#L23-L25)
- [security.py](file://zquant/core/security.py#L23-L25)

## 端点说明

### 用户登录

用户登录端点用于验证用户名和密码，并返回认证Token。

**端点**: `POST /api/v1/auth/login`

**请求体**:
```json
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

**字段说明**:
- `access_token`: 访问Token，用于后续API调用
- `token_type`: Token类型，固定为"bearer"
- `expires_in`: Token有效期（秒）
- `refresh_token`: 刷新Token，用于获取新的访问Token
- `user_info`: 当前用户的基本信息

### 刷新Token

当访问Token即将过期时，可以使用刷新Token获取新的访问Token，而无需重新登录。

**端点**: `POST /api/v1/auth/refresh`

**请求体**:
```json
{
  "refresh_token": "string"
}
```

**响应示例**:
```json
{
  "access_token": "new_access_token_here",
  "token_type": "bearer",
  "refresh_token": "new_refresh_token_here"
}
```

### 用户登出

用户登出端点用于注销当前会话。由于JWT是无状态的，服务器端无法直接使Token失效，因此登出操作主要在客户端完成。

**端点**: `POST /api/v1/auth/logout`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "message": "登出成功"
}
```

**注意**: 实际的登出操作需要客户端删除本地存储的Token。

### 获取当前用户信息

此端点用于获取当前认证用户的信息。

**端点**: `GET /api/v1/users/me`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role_id": 1,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L31-L98)
- [auth.py](file://zquant/api/v1/auth.py#L39-L64)
- [users.py](file://zquant/api/v1/users.py#L79-L98)

## 请求示例

### 用户登录

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 刷新Token

```bash
curl -X POST "http://localhost:8000/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your_refresh_token_here"
  }'
```

### 用户登出

```bash
curl -X POST "http://localhost:8000/api/v1/auth/logout" \
  -H "Authorization: Bearer your_access_token_here"
```

### 获取当前用户信息

```bash
curl -X GET "http://localhost:8000/api/v1/users/me" \
  -H "Authorization: Bearer your_access_token_here"
```

**Section sources**
- [test_me_curl.md](file://zquant/tests/test_me_curl.md#L19-L53)
- [test_me_api.py](file://zquant/tests/test_me_api.py#L45-L87)

## 错误处理

### 标准错误响应格式

当API调用失败时，会返回标准的错误响应格式：

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

**常见错误场景**:
- **401 Unauthorized**: Token无效、已过期或刷新Token错误
- **422 Unprocessable Entity**: 请求体格式错误或缺少必填字段
- **403 Forbidden**: 用户被禁用或权限不足

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L540-L561)
- [auth.py](file://zquant/api/v1/auth.py#L47-L49)

## 安全要求

### Token有效期

ZQuant平台对Token的有效期进行了严格管理，以平衡安全性和用户体验。

**JWT配置**:
- **访问Token有效期**: 1440分钟（24小时）
- **刷新Token有效期**: 7天

这些配置可以在`zquant/config.py`文件中进行调整：

```python
# JWT配置
SECRET_KEY: str = "your-secret-key-change-this-in-production"
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24小时
REFRESH_TOKEN_EXPIRE_DAYS: int = 7
```

### 刷新策略

ZQuant平台实现了安全的Token刷新策略：

1. **刷新Token一次性使用**: 每次使用刷新Token后，旧的刷新Token将失效，服务器会返回一个新的刷新Token。
2. **Token黑名单机制**: 登出或密码更改后，用户的Token会被加入黑名单，防止继续使用。
3. **登录失败限制**: 连续5次登录失败后，账户将被锁定15分钟。

### 安全传输要求

为确保认证信息的安全，建议遵循以下安全最佳实践：

1. **HTTPS传输**: 所有API调用必须通过HTTPS进行，防止Token在传输过程中被窃取。
2. **Token存储安全**: 
   - 前端应用应将Token存储在HttpOnly的Cookie中，而非localStorage
   - 后端应用应安全地存储API密钥
3. **定期轮换**: 建议定期轮换API密钥，特别是在怀疑密钥可能泄露时。
4. **最小权限原则**: 为不同应用创建具有最小必要权限的API密钥。

**Section sources**
- [config.py](file://zquant/config.py#L73-L77)
- [security.py](file://zquant/core/security.py#L85-L104)
- [auth_service.py](file://zquant/services/auth.py#L55-L57)

## 客户端调用示例

### Python客户端调用

```python
import requests

# 1. 登录获取Token
login_url = "http://localhost:8000/api/v1/auth/login"
login_data = {"username": "admin", "password": "admin123"}
login_response = requests.post(login_url, json=login_data)
tokens = login_response.json()

# 2. 使用Token调用API
me_url = "http://localhost:8000/api/v1/users/me"
headers = {"Authorization": f"Bearer {tokens['access_token']}"}
me_response = requests.get(me_url, headers=headers)
print(me_response.json())

# 3. 刷新Token
refresh_url = "http://localhost:8000/api/v1/auth/refresh"
refresh_data = {"refresh_token": tokens["refresh_token"]}
refresh_response = requests.post(refresh_url, json=refresh_data)
new_tokens = refresh_response.json()
```

### JavaScript客户端调用

```javascript
// 使用fetch API
async function callZQuantAPI() {
  // 1. 登录
  const loginResponse = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  
  const tokens = await loginResponse.json();
  
  // 2. 获取用户信息
  const meResponse = await fetch('http://localhost:8000/api/v1/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`
    }
  });
  
  const userData = await meResponse.json();
  console.log(userData);
}

callZQuantAPI();
```

### 使用ZQuant SDK

ZQuant提供了官方SDK，简化API调用过程。

**Python SDK**:
```python
from zquant_client import ZQuantClient

# 初始化客户端
client = ZQuantClient(
    base_url="http://localhost:8000/api/v1",
    api_key="your_access_key",
    api_secret="your_secret_key"
)

# 获取当前用户信息
user_info = client.get_current_user()
print(user_info)
```

**JavaScript SDK**:
```javascript
import { ZQuantClient } from 'zquant-client-js';

// 初始化客户端
const client = new ZQuantClient({
  baseURL: 'http://localhost:8000/api/v1',
  apiKey: 'your_access_key',
  apiSecret: 'your_secret_key'
});

// 获取当前用户信息
const userInfo = await client.getCurrentUser();
console.log(userInfo);
```

**Section sources**
- [api_reference.md](file://docs/api/api_reference.md#L628-L677)
- [auth.ts](file://web/src/services/zquant/auth.ts#L31-L63)
- [test_me_api.py](file://zquant/tests/test_me_api.py#L45-L87)