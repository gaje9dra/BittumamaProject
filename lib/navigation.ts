export function isNavigationItemActive(pathname: string, href: string) {
  const normalize = (value: string) => {
    if (value.length > 1 && value.endsWith("/")) return value.slice(0, -1);
    return value;
  };

  const current = normalize(pathname.split("?")[0].split("#")[0]);
  const target = normalize(href.split("?")[0].split("#")[0]);

  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}
