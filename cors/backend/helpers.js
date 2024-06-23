const base64url = (str) => btoa(str).replace(/\+/gim, '-').replace(/\//gim, '-').replace(/=/gim, '');

module.exports = { base64url };
