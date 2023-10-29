export type KeyValueString = {
  [key: string]: string;
};

export type WidgetSettingsProps = {
  wid: string;
  onSubmit: (settings: KeyValueString) => void;
};
