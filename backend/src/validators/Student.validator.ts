
import { z } from "zod";

export const createStudentSchema = z.object({

    admissionNo: z.string().min(1),

    name: z.string().min(2),

    class: z.string().min(1),

    dob: z.string(),

    phone: z.string().min(10).max(10)

});