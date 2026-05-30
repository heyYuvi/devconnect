import { z } from "zod";

const commentSchema = z.object({
    text: z.
    string().
    min(1, "Comment cannot be empty").
    max(200, "Text should not exceed 200 characters").
    trim()
});

export default commentSchema;