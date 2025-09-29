import {
  users,
  companies,
  properties,
  units,
  tenants,
  tenancies,
  maintenanceRequests,
  invoices,
  calendarEvents,
  uploads,
  assistantLogs,
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type Property,
  type InsertProperty,
  type Unit,
  type InsertUnit,
  type Tenant,
  type InsertTenant,
  type Tenancy,
  type InsertTenancy,
  type MaintenanceRequest,
  type InsertMaintenanceRequest,
  type Invoice,
  type InsertInvoice,
  type CalendarEvent,
  type InsertCalendarEvent,
  type Upload,
  type InsertUpload,
  type AssistantLog,
  type InsertAssistantLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Company operations
  createCompany(company: InsertCompany): Promise<Company>;
  getCompaniesByOwnerId(ownerId: string): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | undefined>;
  
  // Property operations
  createProperty(property: InsertProperty): Promise<Property>;
  getPropertiesByCompanyId(companyId: string): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  
  // Unit operations
  createUnit(unit: InsertUnit): Promise<Unit>;
  getUnitsByPropertyId(propertyId: string): Promise<Unit[]>;
  getUnitById(id: string): Promise<Unit | undefined>;
  updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit>;
  deleteUnit(id: string): Promise<void>;
  
  // Tenant operations
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getTenantsByCompanyId(companyId: string): Promise<Tenant[]>;
  getTenantById(id: string): Promise<Tenant | undefined>;
  updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant>;
  deleteTenant(id: string): Promise<void>;
  
  // Tenancy operations
  createTenancy(tenancy: InsertTenancy): Promise<Tenancy>;
  getTenanciesByUnitId(unitId: string): Promise<Tenancy[]>;
  getActiveTenancyByUnitId(unitId: string): Promise<Tenancy | undefined>;
  updateTenancy(id: string, tenancy: Partial<InsertTenancy>): Promise<Tenancy>;
  
  // Maintenance request operations
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  getMaintenanceRequestsByUnitId(unitId: string): Promise<MaintenanceRequest[]>;
  getMaintenanceRequestById(id: string): Promise<MaintenanceRequest | undefined>;
  updateMaintenanceRequest(id: string, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest>;
  deleteMaintenanceRequest(id: string): Promise<void>;
  
  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoicesByTenantId(tenantId: string): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | undefined>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  
  // Calendar event operations
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  getCalendarEventsByCompanyId(companyId: string): Promise<CalendarEvent[]>;
  getCalendarEventById(id: string): Promise<CalendarEvent | undefined>;
  updateCalendarEvent(id: string, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent>;
  deleteCalendarEvent(id: string): Promise<void>;
  
  // Upload operations
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUploadsByEntityId(entityType: string, entityId: string): Promise<Upload[]>;
  
  // Assistant log operations
  createAssistantLog(log: InsertAssistantLog): Promise<AssistantLog>;
  getAssistantLogsByUserId(userId: string): Promise<AssistantLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Company operations
  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async getCompaniesByOwnerId(ownerId: string): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.ownerId, ownerId));
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  // Property operations
  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async getPropertiesByCompanyId(companyId: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.companyId, companyId));
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Unit operations
  async createUnit(unit: InsertUnit): Promise<Unit> {
    const [newUnit] = await db.insert(units).values(unit).returning();
    return newUnit;
  }

  async getUnitsByPropertyId(propertyId: string): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.propertyId, propertyId));
  }

  async getUnitById(id: string): Promise<Unit | undefined> {
    const [unit] = await db.select().from(units).where(eq(units.id, id));
    return unit;
  }

  async updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit> {
    const [updatedUnit] = await db
      .update(units)
      .set({ ...unit, updatedAt: new Date() })
      .where(eq(units.id, id))
      .returning();
    return updatedUnit;
  }

  async deleteUnit(id: string): Promise<void> {
    await db.delete(units).where(eq(units.id, id));
  }

  // Tenant operations
  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async getTenantsByCompanyId(companyId: string): Promise<Tenant[]> {
    return await db.select().from(tenants).where(eq(tenants.companyId, companyId));
  }

  async getTenantById(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ ...tenant, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updatedTenant;
  }

  async deleteTenant(id: string): Promise<void> {
    await db.delete(tenants).where(eq(tenants.id, id));
  }

  // Tenancy operations
  async createTenancy(tenancy: InsertTenancy): Promise<Tenancy> {
    const [newTenancy] = await db.insert(tenancies).values(tenancy).returning();
    return newTenancy;
  }

  async getTenanciesByUnitId(unitId: string): Promise<Tenancy[]> {
    return await db.select().from(tenancies).where(eq(tenancies.unitId, unitId));
  }

  async getActiveTenancyByUnitId(unitId: string): Promise<Tenancy | undefined> {
    const [tenancy] = await db
      .select()
      .from(tenancies)
      .where(and(eq(tenancies.unitId, unitId), eq(tenancies.isActive, true)));
    return tenancy;
  }

  async updateTenancy(id: string, tenancy: Partial<InsertTenancy>): Promise<Tenancy> {
    const [updatedTenancy] = await db
      .update(tenancies)
      .set({ ...tenancy, updatedAt: new Date() })
      .where(eq(tenancies.id, id))
      .returning();
    return updatedTenancy;
  }

  // Maintenance request operations
  async createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const [newRequest] = await db.insert(maintenanceRequests).values(request).returning();
    return newRequest;
  }

  async getMaintenanceRequestsByUnitId(unitId: string): Promise<MaintenanceRequest[]> {
    return await db
      .select()
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.unitId, unitId))
      .orderBy(desc(maintenanceRequests.createdAt));
  }

  async getMaintenanceRequestById(id: string): Promise<MaintenanceRequest | undefined> {
    const [request] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id));
    return request;
  }

  async updateMaintenanceRequest(id: string, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest> {
    const [updatedRequest] = await db
      .update(maintenanceRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(maintenanceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async deleteMaintenanceRequest(id: string): Promise<void> {
    await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, id));
  }

  // Invoice operations
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async getInvoicesByTenantId(tenantId: string): Promise<Invoice[]> {
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.tenantId, tenantId))
      .orderBy(desc(invoices.dueDate));
  }

  async getInvoiceById(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  // Calendar event operations
  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [newEvent] = await db.insert(calendarEvents).values(event).returning();
    return newEvent;
  }

  async getCalendarEventsByCompanyId(companyId: string): Promise<CalendarEvent[]> {
    return await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.companyId, companyId))
      .orderBy(asc(calendarEvents.eventDate));
  }

  async getCalendarEventById(id: string): Promise<CalendarEvent | undefined> {
    const [event] = await db.select().from(calendarEvents).where(eq(calendarEvents.id, id));
    return event;
  }

  async updateCalendarEvent(id: string, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent> {
    const [updatedEvent] = await db
      .update(calendarEvents)
      .set(event)
      .where(eq(calendarEvents.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteCalendarEvent(id: string): Promise<void> {
    await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
  }

  // Upload operations
  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [newUpload] = await db.insert(uploads).values(upload).returning();
    return newUpload;
  }

  async getUploadsByEntityId(entityType: string, entityId: string): Promise<Upload[]> {
    return await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.entityType, entityType), eq(uploads.entityId, entityId)));
  }

  // Assistant log operations
  async createAssistantLog(log: InsertAssistantLog): Promise<AssistantLog> {
    const [newLog] = await db.insert(assistantLogs).values(log).returning();
    return newLog;
  }

  async getAssistantLogsByUserId(userId: string): Promise<AssistantLog[]> {
    return await db
      .select()
      .from(assistantLogs)
      .where(eq(assistantLogs.userId, userId))
      .orderBy(desc(assistantLogs.createdAt));
  }
}

export const storage = new DatabaseStorage();
