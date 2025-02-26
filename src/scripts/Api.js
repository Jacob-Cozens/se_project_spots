// utils/Api.js

class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "32e5f08d-2c59-48ea-9639-c3858b959a65",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
