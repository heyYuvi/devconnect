import { z } from "zod";

const profileCardSchema = z.object({
    username: z.
    string().
    trim().
    min(4, "Username must at least be 4 characters").
    max(14, "Username should not exceeds 14 characters").
    regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores").
    optional(),
    bio: z.
    string().
    trim().
    max(300, "Bio should not exceeds 300 characters").
    optional()
});

export default profileCardSchema;