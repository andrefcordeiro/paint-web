/**
 * Interface to represent the toolbar buttons.
 */
export interface ToolButton {
  name: string;

  iconName?: string;

  onclickFunction: ((name: string) => void) | null;

  multiTool?: boolean;

  options?: ToolButton[];
}
