import { Request, Response } from "express";
import { ITutorial } from "./tutorial.interface";
import { Tutorial } from "./tutorial.model";
import fs from "fs";
import path from "path";
import QueryBuilder from "../../builder/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import { USER_ROLES } from "../../../enums/user";
import config from "../../../config";
const uploadVideoInDb = async (payload:ITutorial):Promise<ITutorial|null> => {
    const result = await Tutorial.create(payload);
    return result;
}


const getStremingVideoFromDb = async (url: string, req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), "uploads", "video", url);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Video file not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length": fileSize,
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

  if (start >= fileSize || end >= fileSize) {
    return res.status(416).send("Requested range not satisfiable\n" + start + " >= " + fileSize);
  }

  const contentLength = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
    "Cache-Control": "public, max-age=3600", // add caching to speed up repeat loads
  });

  const stream = fs.createReadStream(filePath, { start, end });

  stream.on("open", () => stream.pipe(res));
  stream.on("error", err => {
    console.error("Stream error:", err);
    res.status(500).end("Stream error");
  });
};

const getAllTutorialsFromDb = async (query:Record<string,any>,user:JwtPayload)=>{
    const TutorialQuery = new QueryBuilder(Tutorial.find(),query).paginate().filter().sort()
    const [videos,pagination] = await Promise.all([
        (
            [USER_ROLES.SUPER_ADMIN,USER_ROLES.ADMIN].includes(user.role)?TutorialQuery.modelQuery.populate([{
            path:"course",
            select:"name"
        },{
            path:"topic",
            select:"title"
        }]).lean(): TutorialQuery.modelQuery.select("-topic").lean()
        ),
        TutorialQuery.getPaginationInfo()
    ])
    return {
        videos:videos.map((video:any)=>({...video,thumbnail:"football.png",video:[USER_ROLES.SUPER_ADMIN,USER_ROLES.ADMIN].includes(user.role)?video.video:`/tutorial/video/${video.video}`})),
        pagination
    }
}

const getSingleTutorialFromDb = async (id:string,query:Record<string,any>)=>{
    const result = await Tutorial.findById(id);
    if(!result){
        throw new Error("Tutorial not found")
    }

    const TutorialQuery = new QueryBuilder(Tutorial.find({course:result.course,_id:{$ne:id}}),query).filter().sort()
    const [videos,pagination] = await Promise.all([
        TutorialQuery.modelQuery.lean(),
        TutorialQuery.getPaginationInfo()
    ])

    return {
        data:{
            current:result,
            suggestions:videos
        },
        pagination
    }
}

const updateTutorialInDb = async (id:string,payload:Partial<ITutorial>)=>{
    const isExist = await Tutorial.findById(id);
    if(!isExist){
        throw new Error("Tutorial not found")
    }
    console.log(id,payload);
    
    if(payload.video && isExist.video){
        const filePath = path.join(process.cwd(), "uploads","video", isExist.video);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    
    const result = await Tutorial.findByIdAndUpdate(id,payload,{new:true});
    return result;
}
const deleteTutorialFromDb = async (id:string)=>{
    const isExist = await Tutorial.findById(id);
    if(!isExist){
        throw new Error("Tutorial not found")
    }
    if(isExist.video){
        const filePath = path.join(process.cwd(), "uploads","video", isExist.video);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    const result = await Tutorial.findByIdAndDelete(id);
    return result;
}
export const TutorialService = {
    uploadVideoInDb,
    getStremingVideoFromDb,
    getAllTutorialsFromDb,
    getSingleTutorialFromDb,
    updateTutorialInDb,
    deleteTutorialFromDb
}