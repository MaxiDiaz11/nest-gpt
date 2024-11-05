import OpenAI from 'openai';
import * as fs from 'fs';
interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openAI: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  const response = await openAI.audio.transcriptions.create({
    file: fs.createReadStream(audioFile.path),
    model: 'whisper-1',
    language: 'es', //mismo idioma que el audio
    prompt: prompt, //mismo idioma que el audio
    response_format: 'verbose_json',
  });

  return response;
};
