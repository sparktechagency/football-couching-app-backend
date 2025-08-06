import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import path from 'path';
import fs from 'fs';
import { TutorialService } from './tutorial.service';
import sendResponse from '../../../shared/sendResponse';
const uploadVideo = catchAsync(async (req: Request, res: Response) => {
  const {
    chunkIndex,
    totalChunks,
    fileId,
    fileName,
    title,
    description,
    course,
    topic
  } = req.body;

  for(let i in req.body){
    if(!req.body[i]){
      delete req.body[i]
    }
  };

  console.log(req.body);
  
  

  const videoUrl = `${Date.now()}${title}${fileName}`
    .toLowerCase()
    .split(' ')
    .join('-');

  if (
    !chunkIndex ||
    !totalChunks ||
    !fileId ||
    !fileName ||
    !req.file ||
    !title 
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }



  // Create temp chunk folder if not exists
  const chunkDir = path.join(process.cwd(), 'uploads', 'temp', fileId);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  // Save this chunk
  const chunkPath = path.join(chunkDir, `${chunkIndex}`);
  fs.renameSync(req.file.path, chunkPath);

  const files = fs.readdirSync(chunkDir);
  if (files.length === Number(totalChunks)) {
    console.log('📦 All chunks received. Merging now...');

    // Ensure final video folder exists
    const videoDir = path.join(process.cwd(), 'uploads', 'video');
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    const outputPath = path.join(videoDir, videoUrl);
    const writeStream = fs.createWriteStream(outputPath);

    for (let i = 0; i < Number(totalChunks); i++) {
      const chunkFile = path.join(chunkDir, `${i}`);
      const data = fs.readFileSync(chunkFile);
      writeStream.write(data);
    }

    writeStream.end();
    // let videoUrl = ""
    writeStream.on('finish', () => {
      // Remove temporary chunk files
      fs.rmSync(chunkDir, { recursive: true, force: true });
      console.log('🎉 File merge complete!');
    });

    const result = await TutorialService.uploadVideoInDb({...req.body, video: videoUrl});

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Video uploaded successfully',
      data: result,
    });
    return;
  }

  // Otherwise just respond after saving chunk
  return res.status(200).json({
    success: true,
    message: `Chunk ${chunkIndex} received`,
  });
});

const getVideo = catchAsync(async (req: Request, res: Response) => {
  const { url } = req.params;
  TutorialService.getStremingVideoFromDb(url, req, res);
});

const updateTurorial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    chunkIndex,
    totalChunks,
    fileId,
    fileName,
    title,
    description,
    course,
  } = req.body;

  console.log(req.body,req.file);
  

  if (chunkIndex && totalChunks && fileId && fileName && req.file) {
    const videoUrl = `${Date.now()}${title}${fileName}`
      .toLowerCase()
      .split(' ')
      .join('-');

    // Create temp chunk folder if not exists
    const chunkDir = path.join(process.cwd(), 'uploads', 'temp', fileId);
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    // Save this chunk
    const chunkPath = path.join(chunkDir, `${chunkIndex}`);
    fs.renameSync(req.file.path, chunkPath);
    console.log(`✅ Chunk ${chunkIndex} saved`);

    // Check if all chunks received
    const files = fs.readdirSync(chunkDir);
    if (files.length === Number(totalChunks)) {
      console.log('📦 All chunks received. Merging now...');

      // Ensure final video folder exists
      const videoDir = path.join(process.cwd(), 'uploads', 'video');
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      const outputPath = path.join(videoDir, videoUrl);
      const writeStream = fs.createWriteStream(outputPath);

      for (let i = 0; i < Number(totalChunks); i++) {
        const chunkFile = path.join(chunkDir, `${i}`);
        const data = fs.readFileSync(chunkFile);
        writeStream.write(data);
      }

      writeStream.end();
      // let videoUrl = ""
      writeStream.on('finish', () => {
        // Remove temporary chunk files
        fs.rmSync(chunkDir, { recursive: true, force: true });
        console.log('🎉 File merge complete!');
      });

      const result = await TutorialService.updateTutorialInDb(id, {
        course,
        title,
        description,
        video: videoUrl,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Video uploaded successfully',
        data: result,
      });

      return;
    }

    // Otherwise just respond after saving chunk
    return res.status(200).json({
      success: true,
      message: `Chunk ${chunkIndex} received`,
    });
  } else {
    const result = await TutorialService.updateTutorialInDb(id, {
      course,
      title,
      description,
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Video uploaded successfully',
      data: result,
    });
    return;
  }
});

const deleteTutorial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TutorialService.deleteTutorialFromDb(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tutorial deleted successfully',
    data: result,
  });
});
const getAllTutorials = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TutorialService.getAllTutorialsFromDb(query,req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tutorials fetched successfully',
    data: result.videos,
    pagination: result.pagination,
  });
});
const getTutorial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = req.query;
  const result = await TutorialService.getSingleTutorialFromDb(id, query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tutorial fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});
export const TutorialController = {
  uploadVideo,
  getVideo,
  updateTurorial,
  deleteTutorial,
  getAllTutorials,
  getTutorial,
};
