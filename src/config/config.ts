export enum Settings {
  PORT = 'port',
  ENV = 'env',
}

export interface IDefaults {
  PORT: number;
  ROOT_PATH: string;
}

export interface IConfiguration {
  Defaults: IDefaults;
  Settings: typeof Settings;
}

export const Configuration: IConfiguration = {
  Defaults: {
    PORT: 3000,
    ROOT_PATH: '/api/v1',
  },
  Settings,
};
