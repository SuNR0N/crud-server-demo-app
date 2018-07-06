export class Utils {
  public static cleanObject<T = {}>(object: T): Partial<T> {
    return Object.entries(object)
      .reduce((previous, [key, value]) => {
        if (value !== undefined) {
          previous[key] = value;
        }
        return previous;
      }, {});
  }

  public static updateQueryStringParameter(url: string, key: string, value: string | number) {
    const keyCheckRegExp = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = url.indexOf('?') !== -1 ? '&' : '?';
    let updatedUrl;
    if (url.match(keyCheckRegExp)) {
      updatedUrl = url.replace(keyCheckRegExp, `$1${key}=${value}$2`);
    } else {
      updatedUrl = `${url}${separator}${key}=${value}`;
    }
    return updatedUrl;
  }
}
