export type Application = {
  id: number;
  company: string;
  position: string;
  status: string;
  applyDate: string;
  interviewDate?: string;
  deadlineDate?: string;
  memo?: string;
  file?: File | null;
};

export type ApplicationFormData = {
  company: string;
  jobTitle: string;
  position: string;
  industry: string;
  deadline: string;
  url?: string;
}

export type RegistrationTab = 'URL' | 'PDF' | 'IMAGE' | 'MANUAL';