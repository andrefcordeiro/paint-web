export interface ToolButton {
  name: string;

  iconName?: string;

  onclickFunction: (name: string) => void;

  multiTool?: boolean;

  options?: ToolButton[];
}
