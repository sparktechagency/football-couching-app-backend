import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import QueryBuilder from "../../builder/QueryBuilder";
import { ISession } from "./session.interface";
import { Session } from "./session.model";

const createSessionIntoDb = async (payload: ISession) => {
  const result = await Session.create(payload);
  return result;
};

const getSessionsFromDB = async (query: Record<string, any>) => {
  const SessionQuery = new QueryBuilder(Session.find({ }), query).paginate().sort()

  const [sessions, paginationResult] = await Promise.all([
    SessionQuery.modelQuery.populate(['couch','course']).lean(),
    SessionQuery.getPaginationInfo()
  ])
  return {
    meta: paginationResult,
    data: sessions
  }
    
};
const updateSessionIntoDb = async (id: string, payload: Partial<ISession>) => {
  const exist = await Session.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Session doesn't exist!");
  }
  const result = await Session.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const upcommingSessions = async (course: string) => {
  const currentDayStart = new Date(new Date().setHours(0, 0, 0, 0));
  const currentDayEnd = new Date(new Date().setHours(23, 59, 59, 999));

  const session = await Session.findOne({
    course,
    $or: [
      {
        startTime: {
          $gte: currentDayStart,
          $lte: currentDayEnd,
        },
      },
      {
        endTime: {
          $gte: currentDayStart,
          $lte: currentDayEnd,
        },
      },
    ]
  });

  return session;

}

const deleteSessionFromDb = async (id: string) => {
  const exist = await Session.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Session doesn't exist!");
  }
  const result = await Session.findOneAndUpdate(
    { _id: id },
    { status: "delete" },
    {
      new: true,
    }
  );
  return result;
};

export const SessionService = {
  createSessionIntoDb,
  getSessionsFromDB,
  updateSessionIntoDb,
  deleteSessionFromDb,
  upcommingSessions
};