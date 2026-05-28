import { z } from "zod";

const loginSchema = z.object({
    email: z.
    string().
    email("Invalid Email Address").
    trim(),
    password: z.
    string().
    min(8, "Length of password must be at least 8 characters")
});

export default loginSchema;