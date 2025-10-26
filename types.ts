
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 data URL for display
}

export interface ImageFile {
  file: File;
  previewUrl: string;
}
