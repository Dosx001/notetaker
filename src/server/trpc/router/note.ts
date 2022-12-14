import { Prisma } from "@prisma/client";
import { t } from "server/trpc/utils";
import { z } from "zod";

const defaultNoteSelect = Prisma.validator<Prisma.NoteSelect>()({
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
});

export const noteRouter = t.router({
  all: t.procedure.input(z.number().int().optional()).query(() => {
    return prisma?.note.findMany({
      select: defaultNoteSelect,
      orderBy: { createdAt: "asc" },
    });
  }),
  add: t.procedure
    .input(
      z.object({
        id: z.number().int().optional(),
        title: z.string().min(1).max(20),
        content: z.string().min(1).max(512),
      })
    )
    .mutation(async ({ input }) => {
      const note = await prisma?.note.create({
        data: input,
        select: defaultNoteSelect,
      });
      return note;
    }),
  del: t.procedure.input(z.number().int()).mutation(async ({ input }) => {
    const id = input;
    await prisma?.note.delete({ where: { id } });
    return { id };
  }),
  edit: t.procedure
    .input(
      z.object({
        id: z.number().int().optional(),
        data: z.object({
          title: z.string().min(1).max(20),
          content: z.string().min(1).max(512),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, data } = input;
      const note = await prisma?.note.update({
        where: { id },
        data,
        select: defaultNoteSelect,
      });
      return note;
    }),
});
