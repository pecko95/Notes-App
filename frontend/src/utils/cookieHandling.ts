export const setCookie = (name: string, value: string | {}, days?: any) => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = `${name}=${value};path=/;expires=${expirationDate};Secure`;
}

export const getCookie = (name: string) => {
  const cookie = document.cookie.match(`(^|;)?${name}=([^;]*)(;|$)`)

  return cookie ? cookie[2] : null;
}

export const deleteCookie = (name: string) => {
  setCookie(name, '', -1);
}