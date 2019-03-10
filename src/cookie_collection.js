class CookieCollection {
  constructor(params) {
    this._cookies = this.getDocumentCookies();
  }

  getCookie(name) {
    return this._cookies.get(name);
  }

  addCookie(name, value) {
    let cookie = this._createCookie(name, value);
    let result = this._cookies.set(cookie.name, cookie.value);
    this._updateDocumentCookie();
    return result;
  }

  deleteCookie(name) {
    let result = this._cookies.delete(name);
    this._updateDocumentCookie();
    return result;
  }

  toString() {
    let cookies = [];
    this._cookies.forEach((cookie) => cookies.push(cookie.toString()));
    return cookies.join('; ');
  }

  getDocumentCookies() {
    let cookies = new Map;
    document.cookie.split(';').forEach((cookie) => {
      if (this._isValidCookie(cookie)) {
        cookie = this._parseCookie(cookie);
        cookie = this._createCookie(cookie.name, cookie.value);
        cookies.set(cookie.name, cookie);
      }
    });
    return cookies;
  }

  _parseCookie(cookie) {
    let [name, ...value] = cookie.split('=');
    value = value.join('=');
    return {name, value};
  }

  _isValidCookie(cookie) {
    return cookie !== '' && cookie.match('=');
  }

  _updateDocumentCookie() {
    document.cookie = this.toString();
  }

  _createCookie(name, value) {
    return new Cookie({name, value});
  }
}

class Cookie {
  constructor(params) {
    this.name = params.name.trim();
    this.value = params.value.trim();
  }

  toString() {
    return `${this.name}=${this.value}`;
  }
}

