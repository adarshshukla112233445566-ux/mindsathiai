import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { activityCatalog, addActivityResult, addReminder, assistantReply, createConnection, findUserById, getSnapshot, login, registerUser, reviewConnection, setActivityFlag, updateReminder } from "./appData";

const activityType = z.enum(["memory", "attention", "pattern", "recall"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  demo: router({
    login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string().min(1) })).mutation(({ input }) => {
      const user = login(input.email, input.password);
      if (!user) throw new Error("The email or password does not match our demo accounts.");
      return user;
    }),
    register: publicProcedure.input(z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["patient", "caregiver"]), age: z.number().optional(), language: z.string() })).mutation(({ input }) => registerUser(input)),
  }),
  app: router({
    snapshot: publicProcedure.input(z.object({ userId: z.string() })).query(({ input }) => getSnapshot(input.userId)),
    saveResult: publicProcedure.input(z.object({ userId: z.string(), type: activityType, score: z.number(), accuracy: z.number(), responseTime: z.number(), difficulty: z.string() })).mutation(({ input }) => { addActivityResult({ patientId: input.userId, type: input.type, score: input.score, accuracy: input.accuracy, responseTime: input.responseTime, difficulty: input.difficulty }); return getSnapshot(input.userId); }),
    createReminder: publicProcedure.input(z.object({ userId: z.string(), createdBy: z.string(), title: z.string().min(2), description: z.string().default(""), scheduledTime: z.string(), repeat: z.string() })).mutation(({ input }) => { const user = findUserById(input.userId); const patientId = user?.role === "patient" ? input.userId : (getSnapshot(input.createdBy) as any).patient?.id ?? "patient-rani"; addReminder({ patientId, createdBy: input.createdBy, title: input.title, description: input.description, scheduledTime: input.scheduledTime, repeat: input.repeat }); return getSnapshot(input.createdBy); }),
    updateReminder: publicProcedure.input(z.object({ userId: z.string(), reminderId: z.string(), status: z.enum(["upcoming", "completed", "missed"]) })).mutation(({ input }) => { updateReminder(input.reminderId, input.status); return getSnapshot(input.userId); }),
    connectCaregiver: publicProcedure.input(z.object({ patientId: z.string(), caregiverId: z.string(), code: z.string() })).mutation(({ input }) => createConnection(input.patientId, input.caregiverId, input.code)),
    reviewConnection: publicProcedure.input(z.object({ patientId: z.string(), connectionId: z.string(), status: z.enum(["approved", "rejected"]) })).mutation(({ input }) => { reviewConnection(input.connectionId, input.status); return getSnapshot(input.patientId); }),
    assistant: publicProcedure.input(z.object({ userId: z.string(), prompt: z.string().min(1) })).mutation(({ input }) => ({ reply: assistantReply(input.userId, input.prompt) })),
    toggleActivity: publicProcedure.input(z.object({ type: activityType, enabled: z.boolean() })).mutation(({ input }) => setActivityFlag(input.type, input.enabled)),
    catalog: publicProcedure.query(() => activityCatalog),
  }),
});

export type AppRouter = typeof appRouter;
