// Copyright 2025 ZQuant Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: kevin
// Contact:
//     - Email: kevin@vip.qq.com
//     - Wechat: zquant2025
//     - Issues: https://github.com/yoyoung/zquant/issues
//     - Documentation: https://github.com/yoyoung/zquant/blob/main/README.md
//     - Repository: https://github.com/yoyoung/zquant

/**
 * TS代码格式验证工具
 * 
 * TS代码格式规范：6位数字 + .SZ 或 .SH
 * 示例：000001.SZ, 600000.SH
 */

// TS代码格式正则表达式：6位数字 + .SZ 或 .SH
const TS_CODE_PATTERN = /^\d{6}\.(SZ|SH)$/;

/**
 * 验证单个TS代码格式
 * 
 * @param code TS代码字符串
 * @returns 是否为有效格式
 */
export function validateTsCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }
  return TS_CODE_PATTERN.test(code.trim());
}

/**
 * 验证多个TS代码格式
 * 
 * @param codes TS代码字符串或字符串数组
 * @returns 验证结果，包含是否全部有效和无效代码列表
 */
export function validateTsCodes(
  codes: string | string[] | undefined
): { valid: boolean; invalidCodes: string[] } {
  if (!codes) {
    return { valid: false, invalidCodes: [] };
  }

  // 统一转换为数组
  let codeArray: string[] = [];
  if (typeof codes === 'string') {
    // 处理逗号分隔的字符串
    const trimmed = codes.trim();
    // 去掉首尾的逗号
    const cleaned = trimmed.replace(/^,+|,+$/g, '').trim();
    codeArray = cleaned.split(',').map(code => code.trim()).filter(code => code.length > 0);
  } else if (Array.isArray(codes)) {
    codeArray = codes.map(code => typeof code === 'string' ? code.trim() : String(code)).filter(code => code.length > 0);
  } else {
    return { valid: false, invalidCodes: [] };
  }

  // 验证每个代码
  const invalidCodes: string[] = [];
  for (const code of codeArray) {
    if (!validateTsCode(code)) {
      invalidCodes.push(code);
    }
  }

  return {
    valid: invalidCodes.length === 0,
    invalidCodes,
  };
}

/**
 * 获取TS代码格式错误提示信息
 * 
 * @param invalidCodes 无效的代码列表
 * @returns 错误提示信息
 */
export function getTsCodeValidationError(invalidCodes: string[]): string {
  if (invalidCodes.length === 0) {
    return '';
  }
  if (invalidCodes.length === 1) {
    return `TS代码格式无效：${invalidCodes[0]}。正确格式应为：6位数字 + .SZ 或 .SH，例如：000001.SZ, 600000.SH`;
  }
  return `以下TS代码格式无效：${invalidCodes.join(', ')}。正确格式应为：6位数字 + .SZ 或 .SH，例如：000001.SZ, 600000.SH`;
}

