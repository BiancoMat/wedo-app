import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFavorSchema, insertGroupSchema, insertNotificationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user/email/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/user/:id/credits", async (req, res) => {
    try {
      const { credits } = req.body;
      const user = await storage.updateUserCredits(req.params.id, credits);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Favor routes
  app.get("/api/favors", async (req, res) => {
    try {
      const favors = await storage.getFavors();
      res.json(favors);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/favors/user/:userId", async (req, res) => {
    try {
      const favors = await storage.getFavorsByUser(req.params.userId);
      res.json(favors);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/favors", async (req, res) => {
    try {
      const parsed = insertFavorSchema.parse(req.body);
      const favor = await storage.createFavor({ ...parsed, userId: req.body.userId });
      res.status(201).json(favor);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.patch("/api/favors/:id/accept", async (req, res) => {
    try {
      const { userId } = req.body;
      const favor = await storage.updateFavorStatus(req.params.id, "accepted", userId);
      if (!favor) {
        return res.status(404).json({ message: "Favor not found" });
      }
      res.json(favor);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Group routes
  app.get("/api/groups", async (req, res) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/groups/user/:userId", async (req, res) => {
    try {
      const groups = await storage.getGroupsByUser(req.params.userId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const parsed = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup({ ...parsed, founderId: req.body.founderId });
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.get("/api/groups/:id/members", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.id);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/groups/:id/join", async (req, res) => {
    try {
      const { userId } = req.body;
      const member = await storage.addGroupMember(req.params.id, userId);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Notification routes
  app.get("/api/notifications/user/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const parsed = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification({ ...parsed, userId: req.body.userId });
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.patch("/api/notifications/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const notification = await storage.updateNotificationStatus(req.params.id, status);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
