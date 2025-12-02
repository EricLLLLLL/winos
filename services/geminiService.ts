import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const executeTerminalCommand = async (command: string, history: string[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are a simulated Linux terminal in an OS called Winnux.
      The user acts as the root user.
      Current directory: /home/winnux
      
      History of previous commands:
      ${history.join('\n')}

      The user entered: "${command}"

      Rules:
      1. Return ONLY the text output of the command. Do not add markdown code blocks.
      2. If the command asks to list files (ls), invent a realistic file structure for a developer's machine (documents, downloads, projects folder, maybe a python script or two).
      3. If the command is 'cat [file]', invent the content of the file.
      4. If the command is unknown, simulate the standard bash error: "command not found".
      5. Keep responses concise like a real terminal.
      6. Do not explain what you are doing. Just output the result.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response for terminal feel
      }
    });

    return response.text || '';
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Shell process terminated unexpectedly.";
  }
};

export const generateAssistantResponse = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: "You are Winnux Copilot, a helpful OS assistant embedded in the browser."
      }
    });
    return response.text || "I'm having trouble connecting to the network.";
  } catch (error) {
    return "Network error.";
  }
};