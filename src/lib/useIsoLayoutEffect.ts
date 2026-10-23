import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect in the browser, useEffect during prerendering (which avoids React's server warning). */
export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
