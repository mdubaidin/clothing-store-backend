const emailValidator = v => /^(?!\.)([\w-]|(\.(?!\.))|(\+(?!\+)))+@([\w-]+\.(?!\.))+[\w-]{2,4}$/.test(v);
const phoneValidator = v => /^\d{3}-\d{3}-\d{4}$/.test(v); // bugfix

const usernameValidator = v => /^[a-z][a-z0-9_.]+[a-z0-9]$/.test(v);

const stripeIdValidator = v => /^prod_[a-zA-Z0-9]+$/.test(v);

export { emailValidator, phoneValidator, usernameValidator, stripeIdValidator };
