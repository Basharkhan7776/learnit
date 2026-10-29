import { Elysia, t } from "elysia";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const syncRoutes = new Elysia({ prefix: "/api/sync" })
  .get("/summary", async ({ request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return {
        authenticated: false,
        summary: null,
      };
    }

    const progressRecords = await prisma.userProgress.findMany({
      where: { userId: session.user.id },
    });

    const summary: Record<string, { completedCount: number; bookmarksCount: number; updatedAt: string }> = {};

    for (const record of progressRecords) {
      summary[record.app] = {
        completedCount: Array.isArray(record.completedIds) ? record.completedIds.length : 0,
        bookmarksCount: Array.isArray(record.bookmarks) ? record.bookmarks.length : 0,
        updatedAt: record.updatedAt.toISOString(),
      };
    }

    return {
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        username: (session.user as any).username || null,
      },
      summary,
    };
  })
  .get("/:app", async ({ params, request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_app: {
          userId: session.user.id,
          app: params.app,
        },
      },
    });

    return {
      success: true,
      progress: progress
        ? {
            version: progress.version,
            completedIds: progress.completedIds,
            userCode: progress.userCode,
            bookmarks: progress.bookmarks,
            notes: progress.notes,
            settings: progress.settings,
            activityHistory: progress.activityHistory,
            currentExerciseId: progress.currentExerciseId,
            updatedAt: progress.updatedAt.toISOString(),
          }
        : null,
    };
  })
  .post(
    "/:app",
    async ({ params, body, request, set }) => {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const { snapshot, currentExerciseId } = body as {
        snapshot: {
          completedIds?: string[];
          userCode?: Record<string, string>;
          bookmarks?: string[];
          notes?: Record<string, string>;
          settings?: any;
          activityHistory?: Record<string, number>;
          currentExerciseId?: string;
        };
        currentExerciseId?: string;
      };

      if (!snapshot) {
        set.status = 400;
        return { error: "Snapshot payload required" };
      }

      const completedIds = Array.isArray(snapshot.completedIds) ? snapshot.completedIds : [];
      const userCode = snapshot.userCode && typeof snapshot.userCode === "object" ? snapshot.userCode : {};
      const bookmarks = Array.isArray(snapshot.bookmarks) ? snapshot.bookmarks : [];
      const notes = snapshot.notes && typeof snapshot.notes === "object" ? snapshot.notes : {};
      const settings = snapshot.settings && typeof snapshot.settings === "object" ? snapshot.settings : {};
      const activityHistory =
        snapshot.activityHistory && typeof snapshot.activityHistory === "object" ? snapshot.activityHistory : {};
      const activeExercise = currentExerciseId || snapshot.currentExerciseId || null;

      const progress = await prisma.userProgress.upsert({
        where: {
          userId_app: {
            userId: session.user.id,
            app: params.app,
          },
        },
        update: {
          completedIds,
          userCode,
          bookmarks,
          notes,
          settings,
          activityHistory,
          currentExerciseId: activeExercise,
        },
        create: {
          userId: session.user.id,
          app: params.app,
          completedIds,
          userCode,
          bookmarks,
          notes,
          settings,
          activityHistory,
          currentExerciseId: activeExercise,
        },
      });

      return {
        success: true,
        updatedAt: progress.updatedAt.toISOString(),
      };
    }
  );
