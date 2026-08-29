import { Router } from "express";
import { z } from "zod";
import { validate, validated } from "../middleware/validate.js";
import { runAsync } from "../../utils/async.js";
import {
  findDuplicateComponents,
  applyDedupPlan,
  listUndoHistory,
  performUndo,
  performRedo,
  type DuplicateGroup,
} from "../services/batchOpsService.js";

const DedupQuerySchema = z.object({
  nearThreshold: z.coerce.number().min(0).max(1).optional(),
});

const DuplicateGroupSchema: z.ZodType<DuplicateGroup> = z.object({
  keepId: z.string(),
  candidateIds: z.array(z.string()),
  score: z.number(),
  kind: z.enum(["exact", "near"]),
  note: z.string(),
});

const ApplyDedupSchema = z.object({
  groups: z.array(DuplicateGroupSchema).min(1),
});

/**
 * Batch operations for a project's components: duplicate detection/merge and
 * a server-side undo/redo history. Mounted at /api/projects/:id/batch.
 */
export const batchRouter = Router({ mergeParams: true });

batchRouter.get(
  "/duplicates",
  validate(DedupQuerySchema, "query"),
  runAsync(async (req, res) => {
    const { nearThreshold } = validated<z.infer<typeof DedupQuerySchema>>(req, "query");
    res.json(findDuplicateComponents(req.params.id, { nearThreshold }));
  }),
);

batchRouter.post(
  "/duplicates/apply",
  validate(ApplyDedupSchema),
  runAsync(async (req, res) => {
    const { groups } = validated<z.infer<typeof ApplyDedupSchema>>(req);
    res.json(applyDedupPlan(req.params.id, groups));
  }),
);

batchRouter.get(
  "/history",
  runAsync(async (req, res) => {
    res.json(listUndoHistory(req.params.id));
  }),
);

batchRouter.post(
  "/undo",
  runAsync(async (req, res) => {
    const result = performUndo(req.params.id);
    if (!result) {
      res.status(409).json({ error: "nothing_to_undo" });
      return;
    }
    res.json(result);
  }),
);

batchRouter.post(
  "/redo",
  runAsync(async (req, res) => {
    const result = performRedo(req.params.id);
    if (!result) {
      res.status(409).json({ error: "nothing_to_redo" });
      return;
    }
    res.json(result);
  }),
);

export default batchRouter;
