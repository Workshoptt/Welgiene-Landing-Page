import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertWellnessDimensionSchema,
  insertUserWellnessScoreSchema,
  insertUserSubDimensionScoreSchema,
  insertWellnessActivitySchema,
  insertProductCategorySchema,
  insertProductSchema,
  insertResearchArticleSchema,
  insertUserWellnessGoalSchema,
  insertBlockchainWalletSchema,
  insertUserDataSettingSchema,
  insertUserNotificationSettingSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // All API routes should be prefixed with '/api'
  
  // User routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.verifyUserCredentials(username, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user' });
    }
  });

  // Wellness Dimensions routes
  app.get('/api/dimensions', async (req, res) => {
    try {
      const dimensions = await storage.getAllWellnessDimensions();
      res.json(dimensions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get wellness dimensions' });
    }
  });

  app.get('/api/dimensions/:id', async (req, res) => {
    try {
      const dimensionId = req.params.id;
      const dimension = await storage.getWellnessDimensionWithSubDimensions(dimensionId);
      if (!dimension) {
        return res.status(404).json({ message: 'Dimension not found' });
      }
      res.json(dimension);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get wellness dimension' });
    }
  });

  // User Wellness Scores routes
  app.get('/api/users/:userId/scores', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const scores = await storage.getUserWellnessScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user wellness scores' });
    }
  });

  app.post('/api/users/:userId/scores', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const scoreData = insertUserWellnessScoreSchema.parse({
        ...req.body,
        userId
      });
      const score = await storage.updateUserWellnessScore(scoreData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to update user wellness score' });
    }
  });

  // User Sub-dimension Scores routes
  app.get('/api/users/:userId/subdimension-scores', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const scores = await storage.getUserSubDimensionScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user sub-dimension scores' });
    }
  });

  app.post('/api/users/:userId/subdimension-scores', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const scoreData = insertUserSubDimensionScoreSchema.parse({
        ...req.body,
        userId
      });
      const score = await storage.updateUserSubDimensionScore(scoreData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to update user sub-dimension score' });
    }
  });

  // Wellness Activities routes
  app.get('/api/users/:userId/activities', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dimensionId = req.query.dimensionId ? req.query.dimensionId.toString() : undefined;
      const activities = await storage.getUserWellnessActivities(userId, dimensionId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user wellness activities' });
    }
  });

  app.post('/api/users/:userId/activities', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activityData = insertWellnessActivitySchema.parse({
        ...req.body,
        userId
      });
      const activity = await storage.createWellnessActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to create wellness activity' });
    }
  });

  // Product Categories routes
  app.get('/api/product-categories', async (req, res) => {
    try {
      const categories = await storage.getAllProductCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get product categories' });
    }
  });

  // Products routes
  app.get('/api/products', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? req.query.categoryId.toString() : undefined;
      const products = await storage.getAllProducts(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get products' });
    }
  });

  app.get('/api/products/featured', async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get featured products' });
    }
  });

  app.get('/api/products/by-dimension/:dimensionId', async (req, res) => {
    try {
      const dimensionId = req.params.dimensionId;
      const products = await storage.getProductsByDimension(dimensionId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get products by dimension' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get product' });
    }
  });

  // Research Articles routes
  app.get('/api/research', async (req, res) => {
    try {
      const dimensionId = req.query.dimensionId ? req.query.dimensionId.toString() : undefined;
      const articles = await storage.getAllResearchArticles(dimensionId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get research articles' });
    }
  });

  app.get('/api/research/featured', async (req, res) => {
    try {
      const articles = await storage.getFeaturedResearchArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get featured research articles' });
    }
  });

  app.get('/api/research/:id', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await storage.getResearchArticle(articleId);
      if (!article) {
        return res.status(404).json({ message: 'Research article not found' });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get research article' });
    }
  });

  // User Wellness Goals routes
  app.get('/api/users/:userId/goals', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dimensionId = req.query.dimensionId ? req.query.dimensionId.toString() : undefined;
      const completed = req.query.completed === 'true';
      const goals = await storage.getUserWellnessGoals(userId, dimensionId, completed);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user wellness goals' });
    }
  });

  app.post('/api/users/:userId/goals', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goalData = insertUserWellnessGoalSchema.parse({
        ...req.body,
        userId
      });
      const goal = await storage.createUserWellnessGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user wellness goal' });
    }
  });

  app.put('/api/users/:userId/goals/:goalId/complete', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goalId = parseInt(req.params.goalId);
      const updatedGoal = await storage.completeUserWellnessGoal(userId, goalId);
      if (!updatedGoal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ message: 'Failed to complete user wellness goal' });
    }
  });

  // Blockchain Wallet routes
  app.post('/api/users/:userId/blockchain-wallet', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const walletData = insertBlockchainWalletSchema.parse({
        ...req.body,
        userId
      });
      const wallet = await storage.connectBlockchainWallet(walletData);
      res.status(201).json(wallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to connect blockchain wallet' });
    }
  });

  app.get('/api/users/:userId/blockchain-wallet', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const wallet = await storage.getBlockchainWallet(userId);
      if (!wallet) {
        return res.status(404).json({ message: 'Blockchain wallet not found' });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get blockchain wallet' });
    }
  });

  // User Settings routes
  app.get('/api/users/:userId/data-settings', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getUserDataSettings(userId);
      if (!settings) {
        return res.status(404).json({ message: 'User data settings not found' });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user data settings' });
    }
  });

  app.put('/api/users/:userId/data-settings', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settingsData = insertUserDataSettingSchema.parse({
        ...req.body,
        userId
      });
      const settings = await storage.updateUserDataSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to update user data settings' });
    }
  });

  app.get('/api/users/:userId/notification-settings', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getUserNotificationSettings(userId);
      if (!settings) {
        return res.status(404).json({ message: 'User notification settings not found' });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user notification settings' });
    }
  });

  app.put('/api/users/:userId/notification-settings', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settingsData = insertUserNotificationSettingSchema.parse({
        ...req.body,
        userId
      });
      const settings = await storage.updateUserNotificationSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to update user notification settings' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
