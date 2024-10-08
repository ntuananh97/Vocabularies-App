import { notification } from "antd";

export const trimStringValue = (value?: string) => {
  return value?.trim() || '';
}


export const generateUniqueId = (): string => {
  // Get the current timestamp in milliseconds
  const timestamp = Date.now().toString(36); // Converts timestamp to base 36 string
  
  // Generate a random number and convert it to base 36 string
  const randomNum = Math.random().toString(36).substring(2, 10); // Removes '0.' at the start and limits to 8 characters

  // Combine timestamp and random number for uniqueness
  return `${timestamp}-${randomNum}`;
};

export function readText(text: string, langCode: string = 'en-US') {
  // Check if the browser supports speech synthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties (optional)
    utterance.lang = langCode; // Set language to English (US)
    utterance.rate = 1;       // Set the speed of speech (1 is normal)
    utterance.pitch = 1;      // Set pitch of voice (1 is normal)
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  } else {
    notification.error({ message: 'Sorry, your browser does not support speech synthesis.' });
  }
}