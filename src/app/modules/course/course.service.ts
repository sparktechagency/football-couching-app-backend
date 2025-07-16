import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../builder/QueryBuilder";
import { ICourse } from "./course.interface";
import { Course } from "./course.model";

const createCourseIntoDb = async (payload: ICourse) => {
  const result = await Course.create(payload);
  return result;
};
const getAllCourseFromDb = async (query:Record<string,any>) => {

    const CourseQuery= new QueryBuilder(Course.find({status:"active"}),query).paginate().sort()

    const [courses,paginationResult]= await Promise.all([
        CourseQuery.modelQuery.lean(),
        CourseQuery.getPaginationInfo()
    ])

    return {
        meta:paginationResult,
        data:courses
    }

};

const updateCourseIntoDb = async (id: string, payload: Partial<ICourse>) => {
const exist = await Course.findById(id);
if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Course doesn't exist!");
}
if(payload.image && exist.image){
    unlinkFile(exist.image)
}
  const result = await Course.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteCourseFromDb = async (id: string) => {
  const exist = await Course.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Course doesn't exist!");
  }
  if(exist.image){
    unlinkFile(exist.image)
  }
  const result = await Course.findOneAndUpdate(
    { _id: id },
    { status: "delete" },
    { new: true }
  );
  return result;
};

export const CourseService = {
  createCourseIntoDb,
  getAllCourseFromDb,
  updateCourseIntoDb,
  deleteCourseFromDb,
};