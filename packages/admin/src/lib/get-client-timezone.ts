export function getClientTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "europe/paris";
}
