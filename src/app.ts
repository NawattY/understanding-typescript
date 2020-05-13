function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    }
  }

  return adjDescriptor
}

interface validatable {
  name: string
  value: string | number
  required?: boolean
  numeric?: boolean
  min?: number
  max?: number
}

interface validationError {
  name: string
  errors: string[]
}

type validation = {
  isValid: boolean
  errors: validationError[]
}

function validate(validatableInputs: validatable[]): validation {
  let isValid = true
  let errors = []

  for (const index in validatableInputs) {
    const validatableInput = validatableInputs[index]
    const inputErrors = []

    if (validatableInput.required && validatableInput.value.toString().trim().length === 0) {
      isValid = false
      inputErrors.push(`The ${validatableInput.name} is required.`)
    }
  
    if (validatableInput.numeric && typeof validatableInput.value !== 'number') {
      isValid = false
      inputErrors.push(`The ${validatableInput.name} must be numeric.`)
    }
  
    if (validatableInput.min != null) {
      if (typeof validatableInput.value === 'number' && validatableInput.value < validatableInput.min) {
        isValid = false
        inputErrors.push(`The ${validatableInput.name} must greater or equal than ${validatableInput.min}.`)
      } else if (typeof validatableInput.value === 'string' && validatableInput.value.trim().length < validatableInput.min) {
        isValid = false
        inputErrors.push(`The ${validatableInput.name} length must greater or equal than ${validatableInput.min}.`)
      }
    }
  
    if (validatableInput.max != null) {
      if (typeof validatableInput.value === 'number' && validatableInput.value > validatableInput.max) {
        isValid = false
        inputErrors.push(`The ${validatableInput.name} must less or equal than ${validatableInput.max}.`)
      } else if (typeof validatableInput.value === 'string' && validatableInput.value.trim().length > validatableInput.max) {
        isValid = false
        inputErrors.push(`The ${validatableInput.name} length must less or equal than ${validatableInput.max}.`)
      }
    }

    if (inputErrors.length > 0) {
      errors.push({
        name: validatableInput.name,
        errors: inputErrors
      })
    }
  }

  return {
    isValid: isValid,
    errors: errors
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLFormElement
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  constructor() {
    this.templateElement = document.getElementById('project-input') as HTMLTemplateElement
    this.hostElement = < HTMLDivElement > document.getElementById('app')

    const importNode = document.importNode(this.templateElement.content, true)
    this.element = importNode.firstElementChild as HTMLFormElement

    this.element.id = 'user-input'
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement

    this.configure()
    this.attach()
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value
    const description = this.descriptionInputElement.value
    const people = parseInt(this.peopleInputElement.value)

    const titleValidable: validatable = { name: 'title', value: title, required: true, min: 10 }
    const descriptionValidable: validatable = { name: 'description', value: description, required: true, min: 10 }
    const peopleValidable: validatable = { name: 'people', value: people, required: true, numeric: true, min: 1, max: 5 }

    const validator = validate([titleValidable, descriptionValidable, peopleValidable])

    if (!validator.isValid) {
      alert('invalid')
      console.log(validator.errors)
      return
    }

    return [title, description, people]
  }

  private clearInputs() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput
      console.log(title, description, people)
      this.clearInputs()
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

const projectInput = new ProjectInput()