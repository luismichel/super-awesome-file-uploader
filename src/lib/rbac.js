const rolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read"],
};

export function hasPermission(role, action) {
  return rolePermissions[role]?.includes(action);
}
