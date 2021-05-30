import { NewTask } from "../dto";


export const CreateNewTask = (name: string, dueDate: string, time: string): NewTask => new NewTask(name, dueDate, time);
