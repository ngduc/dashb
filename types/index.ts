export type KeyValueString = {
  [key: string]: string;
};

export type WidgetSettingsProps = {
  wid: string;
  onSubmit: (settings: KeyValueString) => void;
};

export type Widget = {
  wid?: string;
  info?: any;
  schema?: any;
};

export type UserWidget = {
  wid: string;
};
