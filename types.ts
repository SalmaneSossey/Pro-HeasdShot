export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

export enum PresetPrompt {
  LINKEDIN = "Make this a professional corporate headshot for LinkedIn, wearing a dark suit, soft studio lighting, neutral grey background, photorealistic, high resolution",
  CASUAL_BUSINESS = "Make this a casual business portrait, smart casual attire, modern bright office background, friendly smile, high quality",
  TECH_STARTUP = "Make this a modern tech startup profile picture, wearing a high quality t-shirt or hoodie, blurred modern open office background, professional lighting",
  RETRO = "Apply a cool vintage retro filter to this photo, keeping the subject clear but adding a nostalgic aesthetic",
  REMOVE_BG = "Remove the background and replace it with a solid professional white color suitable for a passport or ID photo"
}