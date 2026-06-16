const displayInputError = (formElement, inputElement, errorMessage, validationConfig) => {
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

const validateInputField = (formElement, inputElement, validationConfig) => {
  // Handle pattern mismatch with custom error message
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage || "");
  } else {
    inputElement.setCustomValidity("");
  }

  // Display or hide error based on validity
  if (!inputElement.validity.valid) {
    displayInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

const hasAnyInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const updateSubmitButtonState = (inputList, submitButton, validationConfig) => {
  if (hasAnyInvalidInput(inputList)) {
    submitButton.classList.add(validationConfig.inactiveButtonClass);
    submitButton.disabled = true;
  } else {
    submitButton.classList.remove(validationConfig.inactiveButtonClass);
    submitButton.disabled = false;
  }
};

const attachValidationListeners = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);

  // Initial button state
  updateSubmitButtonState(inputList, submitButton, validationConfig);

  // Attach input event listeners
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      validateInputField(formElement, inputElement, validationConfig);
      updateSubmitButtonState(inputList, submitButton, validationConfig);
    });
  });
};

export const enableValidation = (validationConfig) => {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    attachValidationListeners(formElement, validationConfig);
  });
};

export const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);

  // Clear all error messages
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
  });

  // Reset button state
  updateSubmitButtonState(inputList, submitButton, validationConfig);
};
