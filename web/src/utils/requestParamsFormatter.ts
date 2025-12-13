/**
 * 仅用于“接口数据获取结果”弹窗的展示层格式化：
 * - 将 request_params.start_date / request_params.end_date 的 YYYYMMDD 格式转换为 YYYY-MM-DD
 * - 不影响实际接口调用参数（调用方仍按自身逻辑组装请求体）
 */

function formatYyyymmdd(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const s = value.trim();
  if (!/^\d{8}$/.test(s)) return value;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function formatTsCodes(value: unknown): unknown {
  // 仅用于展示：如果是数组，统一展示成逗号分隔字符串
  if (Array.isArray(value)) {
    const parts = value
      .map((v) => String(v ?? '').trim())
      .filter((v) => v.length > 0);
    return parts.join(',');
  }
  return value;
}

export function formatRequestParamsForDisplay<T extends Record<string, any> | undefined | null>(
  params: T,
): T {
  if (!params || typeof params !== 'object') return params;

  // 只做浅拷贝 + 目标字段处理（需求只要求 start/end）
  const next: Record<string, any> = { ...(params as Record<string, any>) };
  next.ts_codes = formatTsCodes(next.ts_codes);
  next.start_date = formatYyyymmdd(next.start_date);
  next.end_date = formatYyyymmdd(next.end_date);
  return next as T;
}


