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
}
