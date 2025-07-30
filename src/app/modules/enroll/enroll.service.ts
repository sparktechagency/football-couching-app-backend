import ApiError from "../../../errors/ApiError";
import { Course } from "../course/course.model";
import { IUser } from "../user/user.interface";
import { IEnroll } from "./enroll.interface";
import { Enroll } from "./enroll.model";

const createEnrollIntoDB = async (payload: IEnroll): Promise<IEnroll | null> => {
  const exist = await Enroll.findOne({
    user: payload.user,
    course: payload.course,
  });
  if (exist) {
    throw new ApiError(400, "You are already enrolled in this course");
  }
const course = await Course.findById(payload.course);
if (!course) {
    throw new ApiError(404, "Course not found");
}
payload.couch = course.couch;
  const result = await Enroll.create(payload);
  return result;
};

const getAllEnrollFromDB = async (): Promise<IEnroll[] | null> => {
  const result = await Enroll.find({}).populate("user").populate("course");
  return result;
};

const updateEnrollDB = async (
  id: string,
  payload: Partial<IEnroll>
): Promise<IEnroll | null> => {
  const result = await Enroll.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteEnrollDb = async (id: string): Promise<IEnroll | null> => {
  const result = await Enroll.findByIdAndDelete(id);
  return result;
};

const getStudentBasedOnCourse = async (id: string)=> {
  const result = await Enroll.find({ course: id }).populate("user",'name image _id').lean();
  const modifiedUser = result.map((user) => {
    const userData = user.user as any as IUser
    return userData
  });
  return modifiedUser;
};

export const EnrollService = {
  createEnrollIntoDB,
  getAllEnrollFromDB,
  updateEnrollDB,
  deleteEnrollDb,
  getStudentBasedOnCourse
};