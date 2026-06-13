const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function publicAssetPath(path: string): string {
  if (!path || path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return `${basePath}${normalizedPath}`;
}
