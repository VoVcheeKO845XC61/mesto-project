let currentOpenModal = null;

const handleEscapeKeyPress = (event) => {
  if (event.key === "Escape" && currentOpenModal) {
    closeModal(currentOpenModal);
  }
};

export const openModal = (modalElement) => {
  if (!modalElement) return;
  
  modalElement.classList.add("popup_is-opened");
  currentOpenModal = modalElement;
  document.addEventListener("keyup", handleEscapeKeyPress);
};

export const closeModal = (modalElement) => {
  if (!modalElement) return;
  
  modalElement.classList.remove("popup_is-opened");
  if (currentOpenModal === modalElement) {
    currentOpenModal = null;
  }
  document.removeEventListener("keyup", handleEscapeKeyPress);
};

export const attachModalCloseListeners = (modalElement) => {
  if (!modalElement) return;

  // Close button handler
  const closeButton = modalElement.querySelector(".popup__close");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeModal(modalElement);
    });
  }

  // Overlay click handler
  modalElement.addEventListener("mousedown", (event) => {
    if (event.target === modalElement) {
      closeModal(modalElement);
    }
  });
};
