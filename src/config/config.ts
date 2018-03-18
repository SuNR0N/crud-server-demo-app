export enum Settings {
  PORT = 'port',
  ENV = 'env',
}

export interface IDefaults {
  PORT: number;
}

export interface IConfiguration {
  Defaults: IDefaults;
  Settings: typeof Settings;
}

export const Configuration: IConfiguration = {
  Defaults: {
    PORT: 3000,
  },
  Settings,
};
