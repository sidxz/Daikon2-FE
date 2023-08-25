export function GenerateTemplate(obj) {
  const template = {};
  for (const key in obj) {
    template[key] = "";
  }
  return [template];
}
