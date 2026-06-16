const apiConfiguration = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-203",
  headers: {
    authorization: "49fa0bdb-c5ce-47ee-a148-f63ffbe764fb",
    "Content-Type": "application/json",
  },
};

const processResponseData = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`API Error: ${response.status} - ${response.statusText}`);
};

const handleApiError = (error) => {
  console.error("API Request failed:", error);
  return Promise.reject(error);
};

export const fetchCurrentUserProfile = () => {
  return fetch(`${apiConfiguration.baseUrl}/users/me`, {
    headers: apiConfiguration.headers,
  })
    .then(processResponseData)
    .catch(handleApiError);
};

export const fetchAllCards = () => {
  return fetch(`${apiConfiguration.baseUrl}/cards`, {
    headers: apiConfiguration.headers,
  })
    .then(processResponseData)
    .catch(handleApiError);
};

export const updateUserProfile = ({ name, about }) => {
  return fetch(`${apiConfiguration.baseUrl}/users/me`, {
    method: "PATCH",
    headers: apiConfiguration.headers,
    body: JSON.stringify({ name, about }),
  })
    .then(processResponseData)
    .catch(handleApiError);
};

export const updateUserProfileAvatar = (avatarUrl) => {
  return fetch(`${apiConfiguration.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: apiConfiguration.headers,
    body: JSON.stringify({ avatar: avatarUrl }),
  })
    .then(processResponseData)
    .catch(handleApiError);
};

export const createNewCard = ({ name, link }) => {
  return fetch(`${apiConfiguration.baseUrl}/cards`, {
    method: "POST",
    headers: apiConfiguration.headers,
    body: JSON.stringify({ name, link }),
  })
    .then(processResponseData)
    .catch(handleApiError);
};

export const removeCard = (cardId) => {
  return fetch(`${apiConfiguration.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: apiConfiguration.headers,
  })
    .then(processResponseData)
    .catch(handleApiError);
};

export const toggleCardLikeStatus = (cardId, isCurrentlyLiked) => {
  const httpMethod = isCurrentlyLiked ? "DELETE" : "PUT";
  return fetch(`${apiConfiguration.baseUrl}/cards/likes/${cardId}`, {
    method: httpMethod,
    headers: apiConfiguration.headers,
  })
    .then(processResponseData)
    .catch(handleApiError);
};
