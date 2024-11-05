import OpenAI from 'openai';
import { downloadBase64ImageasPng, downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';
import * as path from 'path';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenarationUseCase = async (
  openAI: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  if (!originalImage || !maskImage) {
    const response = await openAI.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url,
      localPath: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageasPng(maskImage, true);

  const response = await openAI.images.edit({
    prompt,
    model: 'dall-e-2',
    n: 1,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    size: '1024x1024',
    response_format: 'url',
  });

  const localImagePath = await downloadImageAsPng(response.data[0].url);
  const fileName = path.basename(localImagePath);

  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    localPath: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
