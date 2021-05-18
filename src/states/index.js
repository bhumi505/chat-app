import React from "react";
import states from './States';
import actions from "./Actions";
import globalHook from "use-global-hook";

export default globalHook(React, states, actions);
