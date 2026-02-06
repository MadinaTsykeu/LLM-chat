import { useBreakpoints } from '@vueuse/core';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1200,
  xxl: 1440,
} as const;

export function useAppBreakpoints() {
  const bp = useBreakpoints(BREAKPOINTS);

  const sm = bp.greaterOrEqual('sm');
  const md = bp.greaterOrEqual('md');
  const lg = bp.greaterOrEqual('lg');
  const xl = bp.greaterOrEqual('xl');
  const xxl = bp.greaterOrEqual('xxl');

  return { sm, md, lg, xl, xxl };
}
