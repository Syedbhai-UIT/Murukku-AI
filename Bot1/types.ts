
export interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
  type?: 'text' | 'image' | 'notes' | 'game_suggestion';
  meta?: any;
  groundingMetadata?: {
    web?: { uri: string; title: string }[];
  };
}

export interface UserContext {
  name?: string;
  year?: string;
  semester?: string;
  department?: string;
  learningStyle?: 'visual' | 'theory' | 'practical' | 'exam_cram';
  careerGoal?: 'placement' | 'higher_studies' | 'govt_job' | 'entrepreneur' | 'just_pass';
}

export interface SubjectNote {
  title: string;
  bullets: string[];
  links: { label: string; url: string }[];
}

export interface SemesterInfo {
  year: number;
  title: string;
  focus: string;
  subjects: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}
