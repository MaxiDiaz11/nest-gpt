import { Injectable } from '@nestjs/common';
import { ortographyCheckUseCase } from './use-cases';
import { OrtographyDto } from './dtos';
import OpenAI from 'openai';

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
}
