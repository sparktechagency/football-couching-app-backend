import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CourseService } from "./course.service";
import sendResponse from "../../../shared/sendResponse";
import { getSingleFilePath } from "../../../shared/getFilePath";

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
  const result = await CourseService.getAllCourseFromDb(req.query)
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


export const CourseController = {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse
}