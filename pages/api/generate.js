import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

 try {
    const res = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: "It was the best of times",
        max_tokens: 100,
        temperature: 0,
        stream: true,
    }, { responseType: 'stream' });
    
    res.data.on('data', data => {
        const lines = data.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
                return; // Stream finished
            }
            try {
                const parsed = JSON.parse(message);
                console.log(parsed.choices[0].text);
            } catch(error) {
                console.error('Could not JSON parse stream message', message, error);
            }
        }
    });
} catch (error) {
    if (error.response?.status) {
        console.error(error.response.status, error.message);
        error.response.data.on('data', data => {
            const message = data.toString();
            try {
                const parsed = JSON.parse(message);
                console.error('An error occurred during OpenAI request: ', parsed);
            } catch(error) {
                console.error('An error occurred during OpenAI request: ', message);
            }
        });
    } else {
        console.error('An error occurred during OpenAI request', error);
    }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
