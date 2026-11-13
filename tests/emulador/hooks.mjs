const PREFIJO = "https://www.gstatic.com/firebasejs/10.13.0/firebase-";
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(PREFIJO)) {
    const modulo = specifier.slice(PREFIJO.length).replace(/\.js$/, "");
    return nextResolve(`firebase/${modulo}`, { ...context, parentURL: import.meta.url });
  }
  return nextResolve(specifier.replace(/\?v=\d+$/, ""), context);
}
