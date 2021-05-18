import axios from "axios";
import React from "react";
import config from "../configs";

const actions = {
  handleInputChange: (store, name, event) => {
    const state = {};

    state[name] = event.target.value;

    store.setState(state);
  },

  setStateObject: (store, object) => {
    store.setState(object);
  },

  setState: (store, name, value) => {
    store.setState({ [name]: value });
  },

  get: (store, url, dataName, subData, params) => {
    if (dataName) {
      store.setState({ [dataName]: null });
    }

    return axios.get(config.api + url, { params }).then(response => {
      if (dataName) {
        store.setState({ [dataName]: subData ? response.data.data[subData] : response.data.data });
      }

      return response.data;
    }).catch(function (error) {
      console.error(error);
      throw error;
    });
  },
};

export default actions;
