export interface Todo {
  id: string;
  summary: string;     
  isCompleted: boolean;
  dueDate?: string;    
  dueTime?: string;   
  relatedJob?: string; 
  memo?: string;      
}