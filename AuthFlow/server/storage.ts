import { type User, type InsertUser, type Favor, type InsertFavor, type Group, type InsertGroup, type GroupMember, type Notification, type InsertNotification } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: string, credits: number): Promise<User | undefined>;

  // Favor methods
  createFavor(favor: InsertFavor & { userId: string }): Promise<Favor>;
  getFavors(): Promise<Favor[]>;
  getFavorsByUser(userId: string): Promise<Favor[]>;
  updateFavorStatus(favorId: string, status: string, acceptedBy?: string): Promise<Favor | undefined>;
  getFavor(id: string): Promise<Favor | undefined>;

  // Group methods
  createGroup(group: InsertGroup & { founderId: string }): Promise<Group>;
  getGroups(): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  getGroupsByUser(userId: string): Promise<Group[]>;
  
  // Group member methods
  addGroupMember(groupId: string, userId: string, role?: string): Promise<GroupMember>;
  getGroupMembers(groupId: string): Promise<GroupMember[]>;
  removeGroupMember(groupId: string, userId: string): Promise<boolean>;

  // Notification methods
  createNotification(notification: InsertNotification & { userId: string }): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  updateNotificationStatus(notificationId: string, status: string): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private favors: Map<string, Favor>;
  private groups: Map<string, Group>;
  private groupMembers: Map<string, GroupMember>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.favors = new Map();
    this.groups = new Map();
    this.groupMembers = new Map();
    this.notifications = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      credits: 1,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: string, credits: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, credits };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async createFavor(favorData: InsertFavor & { userId: string }): Promise<Favor> {
    const id = randomUUID();
    const favor: Favor = {
      ...favorData,
      id,
      status: "active",
      acceptedBy: null,
      createdAt: new Date()
    };
    this.favors.set(id, favor);
    return favor;
  }

  async getFavors(): Promise<Favor[]> {
    return Array.from(this.favors.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getFavorsByUser(userId: string): Promise<Favor[]> {
    return Array.from(this.favors.values())
      .filter(favor => favor.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateFavorStatus(favorId: string, status: string, acceptedBy?: string): Promise<Favor | undefined> {
    const favor = this.favors.get(favorId);
    if (favor) {
      const updatedFavor = { ...favor, status, acceptedBy: acceptedBy || favor.acceptedBy };
      this.favors.set(favorId, updatedFavor);
      return updatedFavor;
    }
    return undefined;
  }

  async getFavor(id: string): Promise<Favor | undefined> {
    return this.favors.get(id);
  }

  async createGroup(groupData: InsertGroup & { founderId: string }): Promise<Group> {
    const id = randomUUID();
    const group: Group = {
      ...groupData,
      id,
      createdAt: new Date()
    };
    this.groups.set(id, group);
    
    // Add founder as member
    await this.addGroupMember(id, groupData.founderId, "founder");
    
    return group;
  }

  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values()).filter(group => group.type === "public");
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getGroupsByUser(userId: string): Promise<Group[]> {
    const userGroups = Array.from(this.groupMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.groupId);
    
    return Array.from(this.groups.values()).filter(group => userGroups.includes(group.id));
  }

  async addGroupMember(groupId: string, userId: string, role: string = "member"): Promise<GroupMember> {
    const id = randomUUID();
    const member: GroupMember = {
      id,
      groupId,
      userId,
      role,
      joinedAt: new Date()
    };
    this.groupMembers.set(id, member);
    return member;
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return Array.from(this.groupMembers.values()).filter(member => member.groupId === groupId);
  }

  async removeGroupMember(groupId: string, userId: string): Promise<boolean> {
    const member = Array.from(this.groupMembers.entries())
      .find(([_, member]) => member.groupId === groupId && member.userId === userId);
    
    if (member) {
      this.groupMembers.delete(member[0]);
      return true;
    }
    return false;
  }

  async createNotification(notificationData: InsertNotification & { userId: string }): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...notificationData,
      id,
      status: "unread",
      createdAt: new Date(),
      relatedId: notificationData.relatedId || null
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateNotificationStatus(notificationId: string, status: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      const updatedNotification = { ...notification, status };
      this.notifications.set(notificationId, updatedNotification);
      return updatedNotification;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
