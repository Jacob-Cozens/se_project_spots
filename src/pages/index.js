import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate bridge",
    link: "  https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

console.log(initialCards);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "32e5f08d-2c59-48ea-9639-c3858b959a65",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log(cards);
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileImage.src = userInfo.avatar;
  })
  .catch(console.error);

const avatarModalButton = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = document.forms["avatar-form"];
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");
const avatarCloseButton = avatarModal.querySelector(".modal__cls-btn");

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__avatar");
const profileModal = document.querySelector("#edit-modal");
const profileFormElement = profileModal.querySelector(".modal__form");
const profileCloseButton = profileModal.querySelector(".modal__cls-btn");
const profileModalNameInput = profileModal.querySelector("#modal-name");
const profileModalDescriptionInput =
  profileModal.querySelector("#modal-description");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__sub-btn");
const cardprofileCloseButton = cardModal.querySelector(".modal__cls-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__img");
const previewModalCapEl = previewModal.querySelector(".modal__caption");
const modalCloseTypePreview = previewModal.querySelector(".modal__cls-btn");

const deleteModal = document.querySelector("#delete-modal");
const cancelModalButton = document.querySelector(".modal__cancel-btn");
const deleteCloseButton = deleteModal.querySelector(".modal__cls-btn");
const deleteForm = deleteModal.querySelector(".modal__form");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__img");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  function handleDeleteCard(cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
  }

  function handleLike(evt, cardId) {
    const cardLikeBtn = evt.target;
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
    api
      .toggleLike(cardId, isLiked)
      .then((data) => {
        cardLikeBtn.classList.toggle("card__like-btn_liked", !isLiked);
      })
      .catch(console.error);
  }

  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  } else {
    cardLikeBtn.classList.remove("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImgEl.src = data.link;
    previewModalCapEl.textContent = data.name;
    previewModalImgEl.alt = data.name;
  });

  return cardElement;
}

function handleEditFormSubmit(evt) {
  const modalSubmitButton = evt.submitter;
  modalSubmitButton.textContent = "Saving...";
  evt.preventDefault();
  api
    .editUserInfo({
      name: profileModalNameInput.value,
      about: profileModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(profileModal);
    })
    .catch(console.error)
    .finally(() => {
      modalSubmitButton.textContent = "Save";
    });
}

function handleAddCardSubmit(evt) {
  const modalSubmitButton = evt.submitter;
  modalSubmitButton.textContent = "Saving...";
  evt.preventDefault();
  api
    .addNewCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      const cardEl = getCardElement(data);
      cardsList.prepend(cardEl);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      modalSubmitButton.textContent = "Save";
    });
}

function handleDeleteSubmit(evt) {
  const deleteButton = evt.submitter;
  deleteButton.textContent = "Deleting...";
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteButton.textContent = "Delete";
    });
}

function handleAvatarSubmit(evt) {
  const modalSubmitButton = evt.submitter;
  modalSubmitButton.textContent = "Saving...";
  evt.preventDefault();
  api
    .editUserAvatar({
      avatar: avatarLinkInput.value,
    })
    .then((data) => {
      profileImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      modalSubmitButton.textContent = "Save";
    });
}

profileEditButton.addEventListener("click", () => {
  profileModalNameInput.value = profileName.textContent;
  profileModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    profileFormElement,
    [profileModalNameInput, profileModalDescriptionInput],
    settings
  );
  openModal(profileModal);
});

profileCloseButton.addEventListener("click", () => {
  closeModal(profileModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

cardprofileCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

cancelModalButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

modalCloseTypePreview.addEventListener("click", () => closeModal(previewModal));

profileFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarFormElement.addEventListener("submit", handleAvatarSubmit);

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal.modal_opened");
    if (openModal) closeModal(openModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("click", handleOverlayClick);
}

enableValidation(settings);
