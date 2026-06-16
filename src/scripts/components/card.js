const getCardTemplate = () => {
  return document.getElementById("card-template").content.querySelector(".card").cloneNode(true);
};

export const createCardElement = (
  cardData,
  { onImageClick, onCardInfoClick, onLikeButtonClick, onDeleteButtonClick },
  currentUserId
) => {
  const cardElement = getCardTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountDisplay = cardElement.querySelector(".card__like-count");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardTitle = cardElement.querySelector(".card__title");

  // Set card content
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountDisplay.textContent = cardData.likes.length;

  // Hide delete button if card doesn't belong to current user
  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  }

  // Set like button state based on whether current user has liked the card
  const hasCurrentUserLiked = cardData.likes.some((user) => user._id === currentUserId);
  if (hasCurrentUserLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Attach event listeners
  cardImage.addEventListener("click", () => {
    onImageClick({ name: cardData.name, link: cardData.link });
  });

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_is-active");
    onLikeButtonClick(cardData._id, likeButton, likeCountDisplay, isLiked);
  });

  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener("click", () => {
      onDeleteButtonClick(cardData._id, cardElement);
    });
  }

  infoButton.addEventListener("click", () => {
    onCardInfoClick(cardData._id);
  });

  return cardElement;
};
