import unlinkFile from "../../../shared/unlinkFile";
import { ITopic } from "./topic.interface";
import { Topic } from "./topic.model";

const createTopicIntoDB = async (payload:ITopic):Promise<ITopic|null> => {
    const result = await Topic.create(payload);
    return result;
}

const getTopicsFromDB = async ():Promise<ITopic[]> => {
    const result = await Topic.find();
    return result;
}

const updateTopicIntoDB = async (id:string,payload:Partial<ITopic>):Promise<ITopic|null> => {
    const isExist = await Topic.findById(id);
    if(!isExist){
        throw new Error("Topic not found")
    }
    if(payload.image && isExist.image){
        unlinkFile(isExist.image);
    }
    const result = await Topic.findByIdAndUpdate(id,payload,{new:true});
    return result;
}
const deleteTopicFromDB = async (id:string):Promise<ITopic|null> => {
    const isExist = await Topic.findById(id);
    if(!isExist){
        throw new Error("Topic not found")
    }
    if(isExist.image){
        unlinkFile(isExist.image);
    }
    const result = await Topic.findByIdAndDelete(id);
    return result;
}



export const TopicService = {
    createTopicIntoDB,
    getTopicsFromDB,
    updateTopicIntoDB,
    deleteTopicFromDB,
}

