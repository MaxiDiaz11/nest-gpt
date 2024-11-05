import { Injectable, NotFoundException } from '@nestjs/common';
import {
  audioToTextUseCase,
  generateImageVariationUseCase,
  imageGenarationUseCase,
  ortographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrtographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GptService {
  private openIA = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });

  async ortographyCheck(ortographyDto: OrtographyDto) {
    return await ortographyCheckUseCase(this.openIA, {
      prompt: ortographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openIA, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openIA, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openIA, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openIA, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openIA, { audioFile, prompt });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenarationUseCase(this.openIA, imageGenerationDto);
  }

  async getImageGenerated(imageId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/images',
      `${imageId}`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound) {
      throw new NotFoundException(`Image ${imageId} not found`);
    }

    return filePath;
  }

  async imageVariation({ baseImage }: ImageVariationDto) {
    return await generateImageVariationUseCase(this.openIA, { baseImage });
  }
}
