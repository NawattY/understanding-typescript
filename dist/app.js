"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autoBind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
function validate(validatableInputs) {
    let isValid = true;
    let errors = [];
    for (const index in validatableInputs) {
        const validatableInput = validatableInputs[index];
        const inputErrors = [];
        if (validatableInput.required && validatableInput.value.toString().trim().length === 0) {
            isValid = false;
            inputErrors.push(`The ${validatableInput.name} is required.`);
        }
        if (validatableInput.numeric && typeof validatableInput.value !== 'number') {
            isValid = false;
            inputErrors.push(`The ${validatableInput.name} must be numeric.`);
        }
        if (validatableInput.min != null) {
            if (typeof validatableInput.value === 'number' && validatableInput.value < validatableInput.min) {
                isValid = false;
                inputErrors.push(`The ${validatableInput.name} must greater or equal than ${validatableInput.min}.`);
            }
            else if (typeof validatableInput.value === 'string' && validatableInput.value.trim().length < validatableInput.min) {
                isValid = false;
                inputErrors.push(`The ${validatableInput.name} length must greater or equal than ${validatableInput.min}.`);
            }
        }
        if (validatableInput.max != null) {
            if (typeof validatableInput.value === 'number' && validatableInput.value > validatableInput.max) {
                isValid = false;
                inputErrors.push(`The ${validatableInput.name} must less or equal than ${validatableInput.max}.`);
            }
            else if (typeof validatableInput.value === 'string' && validatableInput.value.trim().length > validatableInput.max) {
                isValid = false;
                inputErrors.push(`The ${validatableInput.name} length must less or equal than ${validatableInput.max}.`);
            }
        }
        if (inputErrors.length > 0) {
            errors.push({
                name: validatableInput.name,
                errors: inputErrors
            });
        }
    }
    return {
        isValid: isValid,
        errors: errors
    };
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
        this.attach();
    }
    gatherUserInput() {
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = parseInt(this.peopleInputElement.value);
        const titleValidable = { name: 'title', value: title, required: true, min: 10 };
        const descriptionValidable = { name: 'description', value: description, required: true, min: 10 };
        const peopleValidable = { name: 'people', value: people, required: true, numeric: true, min: 1, max: 5 };
        const validator = validate([titleValidable, descriptionValidable, peopleValidable]);
        if (!validator.isValid) {
            alert('invalid');
            console.log(validator.errors);
            return;
        }
        return [title, description, people];
    }
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autoBind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
//# sourceMappingURL=app.js.map