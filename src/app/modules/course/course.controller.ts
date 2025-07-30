import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CourseService } from "./course.service";
import sendResponse from "../../../shared/sendResponse";
import { getSingleFilePath } from "../../../shared/getFilePath";
import { Course } from "./course.model";

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { ...courseData } = req.body;
  const image = getSingleFilePath(req.files,"image")
  courseData.image = image
  const result = await CourseService.createCourseIntoDb(courseData)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course created successfully",
    data: result,
  })
})
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getAllCourseFromDb(req.query,req.user)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Courses fetched successfully",
    data: result.data,
    pagination: result.meta
  })
})

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const image = getSingleFilePath(req.files,"image")
  const { ...courseData } = req.body;
  courseData.image = image
  const result = await CourseService.updateCourseIntoDb(id, courseData)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course updated successfully",
    data: result,
  })
})

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.deleteCourseFromDb(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course deleted successfully",
    data: result,
  })
})

const getSingleCourseOverview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.courseOverViewFromDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course fetched successfully",
    data: result,
  })
})

const getStudentsCourses = catchAsync(async (req: Request, res: Response) => {
  
  const result = await CourseService.getStudentsCourses(req.user)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Courses fetched successfully",
    data: result,
  })
})


const getCourseHistoryForStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getCourseHistoryForStudent(req.user, id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course fetched successfully",
    data: result,
  })
})

const getStudentCourseList = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.coursesOfStudentFromTheDB(req.user,req.query)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Courses fetched successfully",
    data: result.data,
    pagination: result.meta
  })
})

const manageClassForCouch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.manageClassForCouchFromDb(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Class managed successfully",
    data: result,
  })
})
export const CourseController = {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getSingleCourseOverview,
  getStudentsCourses,
  getCourseHistoryForStudent,
  getStudentCourseList,
  manageClassForCouch
}