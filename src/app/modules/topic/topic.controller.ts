import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TopicService } from "./topic.service";
import { getSingleFilePath } from "../../../shared/getFilePath";
import sendResponse from "../../../shared/sendResponse";

const createTopic = catchAsync(async (req: Request, res: Response) => {
  const { ...topicData } = req.body;
  const image = getSingleFilePath(req.files, "image");
  const topicDataWithImage = { ...topicData, image };
  const result = await TopicService.createTopicIntoDB(topicDataWithImage);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Topic created successfully",
    data: result,
  });
})
const getTopics = catchAsync(async (req: Request, res: Response) => {
  const result = await TopicService.getTopicsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Topics fetched successfully",
    data: result,
  });
})
const updateTopic = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...topicData } = req.body;
  const image = getSingleFilePath(req.files, "image");
  const topicDataWithImage = { ...topicData, image };
  const result = await TopicService.updateTopicIntoDB(id, topicDataWithImage);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Topic updated successfully",
    data: result,
  });
})
const deleteTopic = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TopicService.deleteTopicFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Topic deleted successfully",
    data: result
    });
})


export const TopicController = {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic
}