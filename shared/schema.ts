import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies table
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  type: varchar("type", { length: 100 }),
  description: text("description"),
  totalUnits: integer("total_units").default(0),
  imageUrl: varchar("image_url"),
  companyId: uuid("company_id").references(() => companies.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property status enum
export const unitStatusEnum = pgEnum('unit_status', ['vacant', 'occupied', 'maintenance']);

// Units table
export const units = pgTable("units", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  unitNumber: varchar("unit_number", { length: 50 }).notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  squareFeet: integer("square_feet"),
  rent: decimal("rent", { precision: 10, scale: 2 }),
  deposit: decimal("deposit", { precision: 10, scale: 2 }),
  status: unitStatusEnum("status").default('vacant'),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tenants table
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  emergencyContact: text("emergency_contact"),
  companyId: uuid("company_id").references(() => companies.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tenancy table (lease information)
export const tenancies = pgTable("tenancies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: uuid("unit_id").references(() => units.id).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  leaseStart: timestamp("lease_start").notNull(),
  leaseEnd: timestamp("lease_end"),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Maintenance request status enum
export const maintenanceStatusEnum = pgEnum('maintenance_status', ['open', 'in_progress', 'completed', 'cancelled']);
export const maintenancePriorityEnum = pgEnum('maintenance_priority', ['low', 'medium', 'high', 'urgent']);

// Maintenance requests table
export const maintenanceRequests = pgTable("maintenance_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  priority: maintenancePriorityEnum("priority").default('medium'),
  status: maintenanceStatusEnum("status").default('open'),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  unitId: uuid("unit_id").references(() => units.id).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  assignedTo: varchar("assigned_to", { length: 255 }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  isPaid: boolean("is_paid").default(false),
  description: text("description"),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  unitId: uuid("unit_id").references(() => units.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar events table
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  eventType: varchar("event_type", { length: 100 }),
  companyId: uuid("company_id").references(() => companies.id).notNull(),
  unitId: uuid("unit_id").references(() => units.id),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  maintenanceRequestId: uuid("maintenance_request_id").references(() => maintenanceRequests.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads table
export const uploads = pgTable("uploads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  url: varchar("url", { length: 500 }),
  entityType: varchar("entity_type", { length: 100 }),
  entityId: uuid("entity_id"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Assistant logs table
export const assistantLogs = pgTable("assistant_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  companies: many(companies),
  uploads: many(uploads),
  assistantLogs: many(assistantLogs),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerId],
    references: [users.id],
  }),
  properties: many(properties),
  tenants: many(tenants),
  calendarEvents: many(calendarEvents),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  company: one(companies, {
    fields: [properties.companyId],
    references: [companies.id],
  }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  property: one(properties, {
    fields: [units.propertyId],
    references: [properties.id],
  }),
  tenancies: many(tenancies),
  maintenanceRequests: many(maintenanceRequests),
  invoices: many(invoices),
  calendarEvents: many(calendarEvents),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  company: one(companies, {
    fields: [tenants.companyId],
    references: [companies.id],
  }),
  tenancies: many(tenancies),
  maintenanceRequests: many(maintenanceRequests),
  invoices: many(invoices),
  calendarEvents: many(calendarEvents),
}));

export const tenanciesRelations = relations(tenancies, ({ one }) => ({
  unit: one(units, {
    fields: [tenancies.unitId],
    references: [units.id],
  }),
  tenant: one(tenants, {
    fields: [tenancies.tenantId],
    references: [tenants.id],
  }),
}));

export const maintenanceRequestsRelations = relations(maintenanceRequests, ({ one, many }) => ({
  unit: one(units, {
    fields: [maintenanceRequests.unitId],
    references: [units.id],
  }),
  tenant: one(tenants, {
    fields: [maintenanceRequests.tenantId],
    references: [tenants.id],
  }),
  calendarEvents: many(calendarEvents),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  tenant: one(tenants, {
    fields: [invoices.tenantId],
    references: [tenants.id],
  }),
  unit: one(units, {
    fields: [invoices.unitId],
    references: [units.id],
  }),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  company: one(companies, {
    fields: [calendarEvents.companyId],
    references: [companies.id],
  }),
  unit: one(units, {
    fields: [calendarEvents.unitId],
    references: [units.id],
  }),
  tenant: one(tenants, {
    fields: [calendarEvents.tenantId],
    references: [tenants.id],
  }),
  maintenanceRequest: one(maintenanceRequests, {
    fields: [calendarEvents.maintenanceRequestId],
    references: [maintenanceRequests.id],
  }),
}));

export const uploadsRelations = relations(uploads, ({ one }) => ({
  uploadedByUser: one(users, {
    fields: [uploads.uploadedBy],
    references: [users.id],
  }),
}));

export const assistantLogsRelations = relations(assistantLogs, ({ one }) => ({
  user: one(users, {
    fields: [assistantLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUnitSchema = createInsertSchema(units).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenancySchema = createInsertSchema(tenancies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMaintenanceRequestSchema = createInsertSchema(maintenanceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  createdAt: true,
});

export const insertAssistantLogSchema = createInsertSchema(assistantLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenancy = typeof tenancies.$inferSelect;
export type InsertTenancy = z.infer<typeof insertTenancySchema>;
export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;
export type InsertMaintenanceRequest = z.infer<typeof insertMaintenanceRequestSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type AssistantLog = typeof assistantLogs.$inferSelect;
export type InsertAssistantLog = z.infer<typeof insertAssistantLogSchema>;
