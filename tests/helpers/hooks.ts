import { RenderHookResult } from '@testing-library/react';

export function getCurrentHookValue<Result, Props>({ result }: RenderHookResult<Result, Props>) {
  return result.current as RenderHookResult<Result, Props>['result']['current'];
}
