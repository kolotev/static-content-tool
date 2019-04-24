// https://codesandbox.io/s/github/kolotev/static-content-tool

import React from "react";
import ReactDOM from "react-dom";
import Repos from "./Repos";
import Drafts from "./Drafts";

const $root = document.getElementById("root");
const $mainApp = document.querySelector("#main_app");
// console.info("root : %o", $root);
// console.info("mainApp : %o", $mainApp);

let $target = null;

if ($root) {
    // console.info("root is here");
    $target = $root;
} else if ($mainApp) {
    // console.info("main_app is here");
    $target = $mainApp;
}

ReactDOM.render(<Repos />, $target);
