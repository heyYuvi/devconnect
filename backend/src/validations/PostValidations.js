import { z } from "zod";

const postCheck = z.object({
    content: z.
    string().
    trim().
    min(1, "Content should at least be 1 charcters").
    max(3000, "Content should not exceeds 3000 chracters").
    optional()
});

export default postCheck;
