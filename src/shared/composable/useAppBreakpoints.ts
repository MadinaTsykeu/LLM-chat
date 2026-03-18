import { useBreakpoints } from '@vueuse/core';

export const BREAKPOINTS = {
  sm: 640,
  md: 769,
  lg: 1024,
  xl: 1200,
  xxl: 1440,
} as const;

export function useAppBreakpoints() {
  const bp = useBreakpoints(BREAKPOINTS);

  return {
    sm: bp.greaterOrEqual('sm'),
    md: bp.greaterOrEqual('md'),
    lg: bp.greaterOrEqual('lg'),
    xl: bp.greaterOrEqual('xl'),
    xxl: bp.greaterOrEqual('xxl'),
  };
}
