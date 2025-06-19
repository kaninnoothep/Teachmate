export function checkProfileCompletion(user) {
  return !!(user?.image && user?.phone && user?.country?.name);
}
