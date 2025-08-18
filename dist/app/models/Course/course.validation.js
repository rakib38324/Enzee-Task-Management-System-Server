"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidations = void 0;
const zod_1 = require("zod");
const courseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Course title is required.' }),
        description: zod_1.z.string({ required_error: 'Description is required.' }),
        category: zod_1.z.string({ required_error: 'Category ID is required.' }), // assuming it's a MongoDB ObjectId string
        price: zod_1.z.number({ required_error: 'Price is required.' }),
        level: zod_1.z.string({ required_error: 'Level is required.' }),
        instructor: zod_1.z
            .array(zod_1.z.string({ required_error: 'Instructor ID must be a string.' }))
            .nonempty({ message: 'At least one instructor is required.' }),
        duration: zod_1.z.string({ required_error: 'Duration is required.' }),
        image: zod_1.z.string().optional(),
        rating: zod_1.z.number().optional(),
        feedback: zod_1.z
            .array(zod_1.z.object({
            user: zod_1.z.string({ required_error: 'User ID is required.' }),
            message: zod_1.z.string({ required_error: 'Feedback message is required.' }),
        }))
            .optional(),
        published: zod_1.z.boolean({ required_error: 'Published status is required.' }).optional(),
    }),
});
const updatecourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Course title is required.' }).optional(),
        description: zod_1.z.string({ required_error: 'Description is required.' }).optional(),
        category: zod_1.z.string({ required_error: 'Category ID is required.' }).optional(),
        price: zod_1.z.number({ required_error: 'Price is required.' }).optional(),
        level: zod_1.z.string({ required_error: 'Level is required.' }).optional(),
        instructor: zod_1.z
            .array(zod_1.z.string({ required_error: 'Instructor ID must be a string.' }))
            .nonempty({ message: 'At least one instructor is required.' }).optional(),
        duration: zod_1.z.string({ required_error: 'Duration is required.' }).optional(),
        image: zod_1.z.string().optional(),
        rating: zod_1.z.number().optional(),
        feedback: zod_1.z
            .array(zod_1.z.object({
            user: zod_1.z.string({ required_error: 'User ID is required.' }).optional(),
            message: zod_1.z.string({ required_error: 'Feedback message is required.' }).optional(),
        }))
            .optional(),
        published: zod_1.z.boolean({ required_error: 'Published status is required.' }).optional(),
    }),
});
const courseStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        published: zod_1.z.boolean({ required_error: 'Course published value is required.' }),
    }),
});
exports.courseValidations = {
    courseValidationSchema,
    updatecourseValidationSchema,
    courseStatusValidationSchema
};
