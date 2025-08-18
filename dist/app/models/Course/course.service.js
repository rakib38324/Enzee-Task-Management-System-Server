"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseServices = exports.updateCoursePublishedStatusFromDB = exports.getSingleCourseFromDB = exports.getAllCoursesFromDB = exports.deleteCourseFromDB = exports.updateCourseFromDB = exports.courseCreateIntoDB = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const categories_model_1 = require("../Categories/categories.model");
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const course_model_1 = require("./course.model");
const mongoose_1 = __importDefault(require("mongoose"));
const courseCreateIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // 1. Check if the category exists
    const categoryExists = yield categories_model_1.Categorie.findById(payload.category);
    if (!categoryExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Category not found!');
    }
    // 2. Check if all instructors exist
    const uniqueInstructorIds = [
        ...new Set(payload.instructor.map((id) => id.toString())),
    ];
    const foundInstructors = yield userRegistration_model_1.User.find({
        _id: { $in: uniqueInstructorIds },
    });
    if ((foundInstructors === null || foundInstructors === void 0 ? void 0 : foundInstructors.length) <= 0) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'One or more instructors do not exist!');
    }
    // 3. Add default values if not provided
    const courseData = Object.assign(Object.assign({}, payload), { rating: (_a = payload.rating) !== null && _a !== void 0 ? _a : 0, feedback: (_b = payload.feedback) !== null && _b !== void 0 ? _b : [], students: (_c = payload.students) !== null && _c !== void 0 ? _c : [], language: (_d = payload.language) !== null && _d !== void 0 ? _d : 'English', image: (_e = payload.image) !== null && _e !== void 0 ? _e : '' });
    // 4. Create the course
    const result = yield course_model_1.Course.create(courseData);
    return result;
});
exports.courseCreateIntoDB = courseCreateIntoDB;
const updateCourseFromDB = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findById({ _id });
    if (!course) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Course not found');
    }
    // Check if the category exists
    if (payload.category) {
        const categoryExists = yield categories_model_1.Categorie.findById(payload === null || payload === void 0 ? void 0 : payload.category);
        if (!categoryExists) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Category not found!');
        }
    }
    // Handle instructor updates
    if (payload.instructor && Array.isArray(payload.instructor)) {
        const existingInstructorIds = course.instructor.map((id) => id.toString());
        // 1. Check which existing instructors still exist in DB
        const aliveExistingInstructors = yield userRegistration_model_1.User.find({
            _id: { $in: existingInstructorIds },
        }).distinct('_id');
        const aliveExistingIds = aliveExistingInstructors.map((id) => id.toString());
        // 2. Prepare and filter new instructor IDs
        const newInstructorIds = payload.instructor.map((id) => id.toString());
        const uniqueNewInstructorIds = [...new Set(newInstructorIds)].filter((id) => !aliveExistingIds.includes(id));
        if (uniqueNewInstructorIds.length <= 0) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'No new instructors provided. Please add new instructors.');
        }
        // 3. Check if the new ones exist in the DB
        const foundNewInstructors = yield userRegistration_model_1.User.find({
            _id: { $in: uniqueNewInstructorIds },
        }).distinct('_id');
        const aliveNewInstructorIds = foundNewInstructors.map((id) => id.toString());
        if (aliveNewInstructorIds.length <= 0) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'One or more new instructors do not exist.');
        }
        // 4. Merge final instructor list
        const mergedInstructorIds = [...aliveExistingIds, ...aliveNewInstructorIds];
        payload.instructor = mergedInstructorIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
    }
    return yield course_model_1.Course.findByIdAndUpdate(_id, payload, { new: true });
});
exports.updateCourseFromDB = updateCourseFromDB;
const deleteCourseFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findById({ _id });
    if (!course) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Course not found');
    }
    if (course.students && course.students.length > 0) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Course cannot be deleted as it has enrolled students.');
    }
    const result = yield course_model_1.Course.findByIdAndDelete(_id);
    if (!result) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Course not found or already deleted.');
    }
    return result;
});
exports.deleteCourseFromDB = deleteCourseFromDB;
const getAllCoursesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.Course.find()
        .populate('category')
        .populate({
        path: 'instructor',
        select: '-password -__v',
    })
        .populate({
        path: 'feedback.user',
        select: '-password -__v',
    });
});
exports.getAllCoursesFromDB = getAllCoursesFromDB;
const getSingleCourseFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findById(_id)
        .populate('category')
        .populate({
        path: 'instructor',
        select: '-password -__v',
    })
        .populate({
        path: 'feedback.user',
        select: '-password -__v',
    });
    if (!course) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Course not found.');
    }
    return course;
});
exports.getSingleCourseFromDB = getSingleCourseFromDB;
const updateCoursePublishedStatusFromDB = (_id, published) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findByIdAndUpdate(_id, { published: published }, { new: true });
    if (!course) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Course not found to update publish status.');
    }
    return course;
});
exports.updateCoursePublishedStatusFromDB = updateCoursePublishedStatusFromDB;
exports.courseServices = {
    courseCreateIntoDB: exports.courseCreateIntoDB,
    updateCourseFromDB: exports.updateCourseFromDB,
    deleteCourseFromDB: exports.deleteCourseFromDB,
    getAllCoursesFromDB: exports.getAllCoursesFromDB,
    getSingleCourseFromDB: exports.getSingleCourseFromDB,
    updateCoursePublishedStatusFromDB: exports.updateCoursePublishedStatusFromDB,
};
