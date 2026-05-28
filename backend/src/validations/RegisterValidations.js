import { z } from "zod";

const registerSchema = z.object({
    name: z.
    string().
    trim().
    min(4, "Name must at least be 4 characters"),
    email: z.
    string().
    trim().
    email("Invalid Email Address"),
    password: z.
    string().
    trim().
    min(8, "Password must at least be 8 characters")
});

export default registerSchema;