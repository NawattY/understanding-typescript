class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLFormElement

  constructor() {
    this.templateElement = document.getElementById('project-input') as HTMLTemplateElement
    this.hostElement = <HTMLDivElement>document.getElementById('app')

    const importNode = document.importNode(this.templateElement.content, true)
    this.element = importNode.firstElementChild as HTMLFormElement

    this.attach()
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

const projectInput = new ProjectInput()