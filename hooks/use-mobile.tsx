import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    const onResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window != "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      window.addEventListener("resize", onResize);
    }

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return windowDimensions;
}
