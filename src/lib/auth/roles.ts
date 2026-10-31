export const ROLES = ["super_admin", "school_management", "principal", "admission_officer", "content_editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  school_management: "School Management",
  principal: "Principal",
  admission_officer: "Admission Officer",
  content_editor: "Content Editor",
  viewer: "Viewer",
};

/** Capability matrix — enforced server-side on every action. */
export const CAN = {
  viewEnquiries: ["super_admin", "school_management", "principal", "admission_officer", "viewer"],
  manageEnquiries: ["super_admin", "school_management", "principal", "admission_officer"],
  manageContent: ["super_admin", "school_management", "principal", "content_editor"],
  publishDocuments: ["super_admin", "school_management", "principal"],
  manageSettings: ["super_admin", "school_management", "principal"],
  manageUsers: ["super_admin"],
  exportData: ["super_admin", "school_management"],
  viewAudit: ["super_admin", "school_management", "principal"],
} as const satisfies Record<string, readonly Role[]>;

export type Capability = keyof typeof CAN;
export const can = (role: Role | null | undefined, cap: Capability) =>
  !!role && (CAN[cap] as readonly Role[]).includes(role);
export const isRole = (v: unknown): v is Role => typeof v === "string" && (ROLES as readonly string[]).includes(v);
