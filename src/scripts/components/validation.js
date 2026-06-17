const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
  const errorDisplayElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorDisplayElement) return;

  inputElement.classList.add(validationConfig.inputErrorClass);
  errorDisplayElement.textContent = errorMessage;
  errorDisplayElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorDisplayElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorDisplayElement) return;

  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorDisplayElement.classList.remove(validationConfig.errorClass);
  errorDisplayElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement, validationConfig) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage || "");
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const disableSubmitButton = (buttonElement, validationConfig) => {
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
  buttonElement.disabled = true;
};

const enableSubmitButton = (buttonElement, validationConfig) => {
  buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  buttonElement.disabled = false;
};

const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, validationConfig);
  } else {
    enableSubmitButton(buttonElement, validationConfig);
  }
};

const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);

  toggleButtonState(inputList, submitButton, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, submitButton, validationConfig);
    });
  });
};

export const enableValidation = (validationConfig) => {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig);
  });
};

export const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
  });

  disableSubmitButton(submitButton, validationConfig);
};
