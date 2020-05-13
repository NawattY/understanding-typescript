class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;

  constructor() {
    this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
    this.hostElement = <HTMLDivElement>document.getElementById('app');
  }
}