import { Model, Types } from "mongoose";

export type ICourse = {
    name: string;
    image: string;
    description?: string;
    status: 'active' | 'delete';
    startDate?: Date;
    endDate?: Date;
    couch:Types.ObjectId;
}

export type CourseModal = {
    isExistCourseById(id: string): any;
} & Model<ICourse, Record<string, unknown>>;
