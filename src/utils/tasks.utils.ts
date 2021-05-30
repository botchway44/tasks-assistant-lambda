import { NewTask } from "../dto";


export const CreateNewTask = (name: string, description: string, dueDate: string, time: string): NewTask => new NewTask(name, description, dueDate, time);
