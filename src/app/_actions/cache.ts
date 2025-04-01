"use server";

import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { diagramCache } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export async function testDatabaseConnection() {
  'use server';
  try {
    console.log('SERVER: Testing database connection...');
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('SERVER: Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('SERVER: Database connection failed:', error);
    return false;
  }
}

export async function getCachedDiagram(username: string, repo: string) {
  'use server';
  try {
    console.log('SERVER: Fetching cached diagram for:', { username, repo });
    const cached = await db
      .select()
      .from(diagramCache)
      .where(
        and(eq(diagramCache.username, username), eq(diagramCache.repo, repo)),
      )
      .limit(1);

    return cached[0]?.diagram ?? null;
  } catch (error) {
    console.error('SERVER: Error fetching cached diagram:', error);
    return null;
  }
}

export async function getCachedExplanation(username: string, repo: string) {
  try {
    const cached = await db
      .select()
      .from(diagramCache)
      .where(
        and(eq(diagramCache.username, username), eq(diagramCache.repo, repo)),
      )
      .limit(1);

    return cached[0]?.explanation ?? null;
  } catch (error) {
    console.error("Error fetching cached explanation:", error);
    return null;
  }
}

export async function cacheDiagramAndExplanation(
  username: string,
  repo: string,
  diagram: string,
  explanation: string,
  usedOwnKey = false,
) {
  'use server';
  console.log('SERVER: Starting cache operation');
  try {
    console.log('SERVER: Attempting to cache diagram:', { 
      username, 
      repo, 
      usedOwnKey,
      diagramLength: diagram.length,
      explanationLength: explanation.length
    });

    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    await db
      .insert(diagramCache)
      .values({
        username,
        repo,
        diagram,
        explanation,
        usedOwnKey,
      })
      .onConflictDoUpdate({
        target: [diagramCache.username, diagramCache.repo],
        set: {
          diagram,
          explanation,
          usedOwnKey,
          updatedAt: new Date(),
        },
      });
    console.log('SERVER: Successfully cached diagram');
    return true;
  } catch (error) {
    console.error('SERVER: Error caching diagram:', error);
    console.error('SERVER: Database URL:', process.env.POSTGRES_URL?.replace(/:[^:@]*@/, ':****@'));
    throw error;
  }
}

export async function getDiagramStats() {
  try {
    const stats = await db
      .select({
        totalDiagrams: sql`COUNT(*)`,
        ownKeyUsers: sql`COUNT(CASE WHEN ${diagramCache.usedOwnKey} = true THEN 1 END)`,
        freeUsers: sql`COUNT(CASE WHEN ${diagramCache.usedOwnKey} = false THEN 1 END)`,
      })
      .from(diagramCache);

    return stats[0];
  } catch (error) {
    console.error("Error getting diagram stats:", error);
    return null;
  }
}

// Test database connection on module load
console.log('SERVER: Testing database connection on module load');
void testDatabaseConnection();
