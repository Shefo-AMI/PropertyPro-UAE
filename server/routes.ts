import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { askAssistant, analyzeMaintenanceRequest } from "./openai";
import { 
  insertCompanySchema,
  insertPropertySchema,
  insertUnitSchema,
  insertTenantSchema,
  insertTenancySchema,
  insertMaintenanceRequestSchema,
  insertInvoiceSchema,
  insertCalendarEventSchema,
  insertAssistantLogSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Company routes
  app.post('/api/companies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companyData = insertCompanySchema.parse({ ...req.body, ownerId: userId });
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(400).json({ message: "Failed to create company" });
    }
  });

  app.get('/api/companies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companies = await storage.getCompaniesByOwnerId(userId);
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get('/api/companies/:id', isAuthenticated, async (req: any, res) => {
    try {
      const company = await storage.getCompanyById(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Property routes
  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(400).json({ message: "Failed to create property" });
    }
  });

  app.get('/api/properties/company/:companyId', isAuthenticated, async (req, res) => {
    try {
      const properties = await storage.getPropertiesByCompanyId(req.params.companyId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', isAuthenticated, async (req, res) => {
    try {
      const property = await storage.getPropertyById(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.put('/api/properties/:id', isAuthenticated, async (req, res) => {
    try {
      const propertyData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(req.params.id, propertyData);
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(400).json({ message: "Failed to update property" });
    }
  });

  app.delete('/api/properties/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProperty(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Unit routes
  app.post('/api/units', isAuthenticated, async (req, res) => {
    try {
      const unitData = insertUnitSchema.parse(req.body);
      const unit = await storage.createUnit(unitData);
      res.json(unit);
    } catch (error) {
      console.error("Error creating unit:", error);
      res.status(400).json({ message: "Failed to create unit" });
    }
  });

  app.get('/api/units/property/:propertyId', isAuthenticated, async (req, res) => {
    try {
      const units = await storage.getUnitsByPropertyId(req.params.propertyId);
      res.json(units);
    } catch (error) {
      console.error("Error fetching units:", error);
      res.status(500).json({ message: "Failed to fetch units" });
    }
  });

  app.get('/api/units/:id', isAuthenticated, async (req, res) => {
    try {
      const unit = await storage.getUnitById(req.params.id);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      res.json(unit);
    } catch (error) {
      console.error("Error fetching unit:", error);
      res.status(500).json({ message: "Failed to fetch unit" });
    }
  });

  app.put('/api/units/:id', isAuthenticated, async (req, res) => {
    try {
      const unitData = insertUnitSchema.partial().parse(req.body);
      const unit = await storage.updateUnit(req.params.id, unitData);
      res.json(unit);
    } catch (error) {
      console.error("Error updating unit:", error);
      res.status(400).json({ message: "Failed to update unit" });
    }
  });

  app.delete('/api/units/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteUnit(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting unit:", error);
      res.status(500).json({ message: "Failed to delete unit" });
    }
  });

  // Tenant routes
  app.post('/api/tenants', isAuthenticated, async (req, res) => {
    try {
      const tenantData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(tenantData);
      res.json(tenant);
    } catch (error) {
      console.error("Error creating tenant:", error);
      res.status(400).json({ message: "Failed to create tenant" });
    }
  });

  app.get('/api/tenants/company/:companyId', isAuthenticated, async (req, res) => {
    try {
      const tenants = await storage.getTenantsByCompanyId(req.params.companyId);
      res.json(tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });

  app.get('/api/tenants/:id', isAuthenticated, async (req, res) => {
    try {
      const tenant = await storage.getTenantById(req.params.id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      res.status(500).json({ message: "Failed to fetch tenant" });
    }
  });

  app.put('/api/tenants/:id', isAuthenticated, async (req, res) => {
    try {
      const tenantData = insertTenantSchema.partial().parse(req.body);
      const tenant = await storage.updateTenant(req.params.id, tenantData);
      res.json(tenant);
    } catch (error) {
      console.error("Error updating tenant:", error);
      res.status(400).json({ message: "Failed to update tenant" });
    }
  });

  app.delete('/api/tenants/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTenant(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tenant:", error);
      res.status(500).json({ message: "Failed to delete tenant" });
    }
  });

  // Tenancy routes
  app.post('/api/tenancies', isAuthenticated, async (req, res) => {
    try {
      const tenancyData = insertTenancySchema.parse(req.body);
      const tenancy = await storage.createTenancy(tenancyData);
      res.json(tenancy);
    } catch (error) {
      console.error("Error creating tenancy:", error);
      res.status(400).json({ message: "Failed to create tenancy" });
    }
  });

  app.get('/api/tenancies/unit/:unitId', isAuthenticated, async (req, res) => {
    try {
      const tenancies = await storage.getTenanciesByUnitId(req.params.unitId);
      res.json(tenancies);
    } catch (error) {
      console.error("Error fetching tenancies:", error);
      res.status(500).json({ message: "Failed to fetch tenancies" });
    }
  });

  app.get('/api/tenancies/unit/:unitId/active', isAuthenticated, async (req, res) => {
    try {
      const tenancy = await storage.getActiveTenancyByUnitId(req.params.unitId);
      res.json(tenancy);
    } catch (error) {
      console.error("Error fetching active tenancy:", error);
      res.status(500).json({ message: "Failed to fetch active tenancy" });
    }
  });

  // Maintenance request routes
  app.post('/api/maintenance-requests', isAuthenticated, async (req, res) => {
    try {
      const requestData = insertMaintenanceRequestSchema.parse(req.body);
      
      // Use AI to analyze the request
      const analysis = await analyzeMaintenanceRequest(requestData.description);
      
      const enrichedData = {
        ...requestData,
        category: requestData.category || analysis.category,
        priority: (requestData.priority || analysis.priority) as "low" | "medium" | "high" | "urgent",
        estimatedCost: requestData.estimatedCost || analysis.estimatedCost.toString(),
      };

      const maintenanceRequest = await storage.createMaintenanceRequest(enrichedData);
      res.json(maintenanceRequest);
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      res.status(400).json({ message: "Failed to create maintenance request" });
    }
  });

  app.get('/api/maintenance-requests/unit/:unitId', isAuthenticated, async (req, res) => {
    try {
      const requests = await storage.getMaintenanceRequestsByUnitId(req.params.unitId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      res.status(500).json({ message: "Failed to fetch maintenance requests" });
    }
  });

  app.get('/api/maintenance-requests/:id', isAuthenticated, async (req, res) => {
    try {
      const request = await storage.getMaintenanceRequestById(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Maintenance request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching maintenance request:", error);
      res.status(500).json({ message: "Failed to fetch maintenance request" });
    }
  });

  app.put('/api/maintenance-requests/:id', isAuthenticated, async (req, res) => {
    try {
      const requestData = insertMaintenanceRequestSchema.partial().parse(req.body);
      const request = await storage.updateMaintenanceRequest(req.params.id, requestData);
      res.json(request);
    } catch (error) {
      console.error("Error updating maintenance request:", error);
      res.status(400).json({ message: "Failed to update maintenance request" });
    }
  });

  // Calendar event routes
  app.post('/api/calendar-events', isAuthenticated, async (req, res) => {
    try {
      const eventData = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent(eventData);
      res.json(event);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      res.status(400).json({ message: "Failed to create calendar event" });
    }
  });

  app.get('/api/calendar-events/company/:companyId', isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getCalendarEventsByCompanyId(req.params.companyId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  // AI Assistant routes
  app.post('/api/assistant', isAuthenticated, async (req: any, res) => {
    try {
      const { question } = z.object({ question: z.string() }).parse(req.body);
      const userId = req.user.claims.sub;
      
      const response = await askAssistant(question);
      
      // Log the interaction
      await storage.createAssistantLog({
        userId,
        query: question,
        response,
        sessionId: req.sessionID,
      });

      res.json({ response });
    } catch (error) {
      console.error("Error processing assistant request:", error);
      res.status(400).json({ message: "Failed to process question" });
    }
  });

  app.get('/api/assistant/logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getAssistantLogsByUserId(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching assistant logs:", error);
      res.status(500).json({ message: "Failed to fetch conversation history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
