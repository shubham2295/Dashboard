import { Project, ProjectStatus } from '../models/project';

//Project state management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListner(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active,
    );
    this.projects.push(newProject);
    this.updateListners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const prj = this.projects.find((project) => project.id === projectId);
    if (prj && prj.status !== newStatus) {
      prj.status = newStatus;
      this.updateListners();
    }
  }

  updateListners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// Creates singletron object
export const projectState = ProjectState.getInstance();
