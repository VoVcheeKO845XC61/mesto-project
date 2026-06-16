import {
  fetchCurrentUserProfile,
  fetchAllCards,
  updateUserProfile,
  updateUserProfileAvatar,
  createNewCard,
  removeCard,
  toggleCardLikeStatus,
} from "./components/api.js";
import { createCardElement } from "./components/card.js";
import { openModal, closeModal, attachModalCloseListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// Validation configuration
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

// DOM elements - Profile section
const cardListContainer = document.querySelector(".places__list");
const profileNameDisplay = document.querySelector(".profile__title");
const profileDescriptionDisplay = document.querySelector(".profile__description");
const profileAvatarElement = document.querySelector(".profile__image");

// DOM elements - Edit profile modal
const editProfileModal = document.querySelector(".popup_type_edit");
const editProfileForm = editProfileModal.querySelector(".popup__form");
const profileNameInput = editProfileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = editProfileForm.querySelector(".popup__input_type_description");
const editProfileButton = document.querySelector(".profile__edit-button");

// DOM elements - Add new card modal
const addCardModal = document.querySelector(".popup_type_new-card");
const addCardForm = addCardModal.querySelector(".popup__form");
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardForm.querySelector(".popup__input_type_url");
const addCardButton = document.querySelector(".profile__add-button");

// DOM elements - Image preview modal
const imagePreviewModal = document.querySelector(".popup_type_image");
const previewImage = imagePreviewModal.querySelector(".popup__image");
const imageCaption = imagePreviewModal.querySelector(".popup__caption");

// DOM elements - Avatar update modal
const editAvatarModal = document.querySelector(".popup_type_edit-avatar");
const editAvatarForm = editAvatarModal.querySelector(".popup__form");
const avatarUrlInput = editAvatarForm.querySelector(".popup__input_type_avatar");

// DOM elements - Card info modal
const cardInfoModal = document.querySelector(".popup_type_info");

let currentUserId = null;

// Utility function to format dates
const formatDateToRussian = (date) => {
  return date.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });
};

// Handler for image preview
const handleImagePreview = ({ name, link }) => {
  previewImage.src = link;
  previewImage.alt = name;
  imageCaption.textContent = name;
  openModal(imagePreviewModal);
};

// Handler for card info button
const handleCardInfoClick = (cardId) => {
  fetchAllCards()
    .then((cards) => {
      const cardData = cards.find((card) => card._id === cardId);
      if (!cardData) return;

      const cardInfoTitle = cardInfoModal.querySelector(".popup__title");
      const cardInfoText = cardInfoModal.querySelector(".popup__text");
      const infoList = cardInfoModal.querySelector(".popup__info");
      const likesList = cardInfoModal.querySelector(".popup__list");

      cardInfoTitle.textContent = "Информация о карточке";
      cardInfoText.textContent = "Лайкнули:";
      infoList.innerHTML = "";
      likesList.innerHTML = "";

      const infoTemplate = document.querySelector("#popup-info-definition-template");
      const userTemplate = document.querySelector("#popup-info-user-preview-template");

      // Helper to create info rows
      const createInfoRow = (label, value) => {
        const row = infoTemplate.content.cloneNode(true);
        row.querySelector(".popup__info-term").textContent = label;
        row.querySelector(".popup__info-description").textContent = value;
        return row;
      };

      // Populate card info
      infoList.appendChild(createInfoRow("Описание:", cardData.name));
      infoList.appendChild(createInfoRow("Дата создания:", formatDateToRussian(new Date(cardData.createdAt))));
      infoList.appendChild(createInfoRow("Владелец:", cardData.owner.name));
      infoList.appendChild(createInfoRow("Количество лайков:", cardData.likes.length));

      // Populate likes list
      if (cardData.likes.length === 0) {
        const emptyItem = userTemplate.content.cloneNode(true);
        emptyItem.querySelector(".popup__list-item").textContent = "Пока никто не лайкнул";
        likesList.appendChild(emptyItem);
      } else {
        cardData.likes.forEach((user) => {
          const userItem = userTemplate.content.cloneNode(true);
          userItem.querySelector(".popup__list-item").textContent = user.name;
          likesList.appendChild(userItem);
        });
      }

      openModal(cardInfoModal);
    })
    .catch((err) => console.error("Failed to fetch card info:", err));
};

// Handler for like button
const handleLikeButtonClick = (cardId, likeButton, likeCountDisplay, isCurrentlyLiked) => {
  toggleCardLikeStatus(cardId, isCurrentlyLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCountDisplay.textContent = updatedCard.likes.length;
    })
    .catch((err) => console.error("Failed to toggle like:", err));
};

// Handler for delete button
const handleDeleteButtonClick = (cardId, cardElement) => {
  removeCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => console.error("Failed to delete card:", err));
};

// Handler for profile form submission
const handleProfileFormSubmit = (event) => {
  event.preventDefault();
  const submitButton = editProfileForm.querySelector(".popup__button");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  updateUserProfile({ name: profileNameInput.value, about: profileDescriptionInput.value })
    .then((userData) => {
      profileNameDisplay.textContent = userData.name;
      profileDescriptionDisplay.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Failed to update profile:", err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
};

// Handler for avatar form submission
const handleAvatarFormSubmit = (event) => {
  event.preventDefault();
  const submitButton = editAvatarForm.querySelector(".popup__button");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  updateUserProfileAvatar(avatarUrlInput.value)
    .then((userData) => {
      profileAvatarElement.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(editAvatarModal);
      editAvatarForm.reset();
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
};

// Handler for add card form submission
const handleAddCardFormSubmit = (event) => {
  event.preventDefault();
  const submitButton = addCardForm.querySelector(".popup__button");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Создание...";

  createNewCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      const newCardElement = createCardElement(
        cardData,
        {
          onImageClick: handleImagePreview,
          onCardInfoClick: handleCardInfoClick,
          onLikeButtonClick: handleLikeButtonClick,
          onDeleteButtonClick: handleDeleteButtonClick,
        },
        currentUserId
      );
      cardListContainer.prepend(newCardElement);
      closeModal(addCardModal);
      addCardForm.reset();
    })
    .catch((err) => {
      console.error("Failed to create card:", err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
};

// Attach form submission handlers
editProfileForm.addEventListener("submit", handleProfileFormSubmit);
editAvatarForm.addEventListener("submit", handleAvatarFormSubmit);
addCardForm.addEventListener("submit", handleAddCardFormSubmit);

// Attach modal open handlers
editProfileButton.addEventListener("click", () => {
  profileNameInput.value = profileNameDisplay.textContent;
  profileDescriptionInput.value = profileDescriptionDisplay.textContent;
  clearValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
});

profileAvatarElement.addEventListener("click", () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationConfig);
  openModal(editAvatarModal);
});

addCardButton.addEventListener("click", () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardModal);
});

// Attach close listeners to all modals
document.querySelectorAll(".popup").forEach((modal) => {
  attachModalCloseListeners(modal);
});

// Initialize application
Promise.all([fetchCurrentUserProfile(), fetchAllCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileNameDisplay.textContent = userData.name;
    profileDescriptionDisplay.textContent = userData.about;
    profileAvatarElement.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((card) => {
      const cardElement = createCardElement(
        card,
        {
          onImageClick: handleImagePreview,
          onCardInfoClick: handleCardInfoClick,
          onLikeButtonClick: handleLikeButtonClick,
          onDeleteButtonClick: handleDeleteButtonClick,
        },
        currentUserId
      );
      cardListContainer.append(cardElement);
    });
  })
  .catch((err) => console.error("Failed to initialize application:", err));
