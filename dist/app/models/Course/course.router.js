"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRouters = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const course_validation_1 = require("./course.validation");
const course_controller_1 = require("./course.controller");
const router = express_1.default.Router();
router.post('/create-course', (0, Auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(course_validation_1.courseValidations.courseValidationSchema), course_controller_1.courseControllers.createCourse);
router.patch('/update-course/:_id', (0, Auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(course_validation_1.courseValidations.updatecourseValidationSchema), course_controller_1.courseControllers.updateCourse);
router.get('/get-all-course', (0, Auth_1.default)('superAdmin', 'admin', 'student', 'instructor', 'guardian'), course_controller_1.courseControllers.getAllCourse);
router.get('/get-single-course/:_id', (0, Auth_1.default)('superAdmin', 'admin', 'student', 'instructor', 'guardian'), course_controller_1.courseControllers.getSingleCourse);
router.delete('/delete-course/:_id', (0, Auth_1.default)('superAdmin', 'admin'), course_controller_1.courseControllers.deleteCourse);
router.patch('/update-course-published/:_id', (0, Auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(course_validation_1.courseValidations.courseStatusValidationSchema), course_controller_1.courseControllers.updateCoursePublishedStatus);
exports.courseRouters = router;
