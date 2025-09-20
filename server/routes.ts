import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, updateUserStatsSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: userData.username,
        password: hashedPassword
      });

      // Set session
      req.session.userId = user.id;

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: 'Invalid user data' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Reset daily missions on login
      await storage.resetDailyMissions(user.id);

      // Set session
      req.session.userId = user.id;

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user data' });
    }
  });

  // Mission routes
  app.get('/api/missions', requireAuth, async (req, res) => {
    try {
      const missions = await storage.getUserMissions(req.session.userId!);
      res.json({ missions });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get missions' });
    }
  });

  app.post('/api/missions/:id/complete', requireAuth, async (req, res) => {
    try {
      const mission = await storage.completeMission(req.params.id, req.session.userId!);
      if (!mission) {
        return res.status(404).json({ message: 'Mission not found or already completed' });
      }

      // Update user XP
      const user = await storage.getUser(req.session.userId!);
      if (user) {
        const newXP = user.xp + mission.xpReward;
        const newTotalXP = user.totalXP + mission.xpReward;
        
        // Calculate level (every 1000 XP = 1 level)
        const newLevel = Math.floor(newTotalXP / 1000) + 1;
        const xpForCurrentLevel = newTotalXP % 1000;
        
        await storage.updateUserXP(req.session.userId!, xpForCurrentLevel, newTotalXP, newLevel);
      }

      res.json({ mission });
    } catch (error) {
      res.status(500).json({ message: 'Failed to complete mission' });
    }
  });

  // Character routes
  app.put('/api/character/stats', requireAuth, async (req, res) => {
    try {
      const statsData = updateUserStatsSchema.parse(req.body);
      const user = await storage.updateUserStats(req.session.userId!, statsData);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: 'Invalid stats data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
