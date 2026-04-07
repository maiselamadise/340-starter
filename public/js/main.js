// regValidate.js
export default {
    registerRules: function () {
        console.log("Register rules function called");
        // Your validation rules here
    }
};


import regValidate from '../js/acct-update.js';

regValidate.registerRules();