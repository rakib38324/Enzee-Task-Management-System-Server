"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidations = void 0;
const zod_1 = require("zod");
const createTaskValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required.' }).min(1, 'Title must not be empty.'),
        description: zod_1.z.string({ required_error: 'Description is required.' }).min(1, 'Description must not be empty.'),
        dueDate: zod_1.z.string({ required_error: 'Due date is required.' }),
    }),
});
const updateTaskValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required.' }).optional(),
        description: zod_1.z
            .string({ required_error: 'Description is required.' })
            .optional(),
        dueDate: zod_1.z.date({ required_error: 'Due date is required.' }).optional(),
    }),
});
exports.TaskValidations = {
    createTaskValidationSchema,
    updateTaskValidationSchema,
};
