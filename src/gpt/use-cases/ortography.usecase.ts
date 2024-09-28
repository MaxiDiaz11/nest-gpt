import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const ortographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Te serán proveidos textos en español con posibles errores ortograficos y gramaticales.
        Las palabras deben estar definidas en el diccionario de la Real Academia Española. 
        Debes de responder en formato JSON. 
         Tu tarea es corregirlos y retornar la información corregida, 
         tambien debes dar un porcentaje de acierto por el usuario.
         Sí no hay errores, debes de retornar un mensaje indicando que no hay errores y felicitaciones.
         
         Ejemplo de respuesta:
         {
            userScore: number,
            errors: string[], // ['error -> solucion']
            message: string, // Usa emojis y texto para felicitar al usuario
            }
         `,
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: 100,
    temperature: 0.3,
  });

  console.log(completion);
  console.log(completion.choices[0].message);

  return JSON.parse(completion.choices[0].message.content);
};
