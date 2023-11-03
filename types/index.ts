export type KeyValueString = {
  [key: string]: string;
};

export type WidgetSettingsProps = {
  wid: string;
  onSubmit: (settings: KeyValueString) => void;
};

type WidgetInfo = {
  wid: string;
  name: string;
  thumbnail: string;
  w: number;
  h: number;
};

export type Widget = {
  wid?: string;
  info: WidgetInfo;
  schema: { [key: string]: any };
};

export type UserWidget = {
  wid: string;
};
