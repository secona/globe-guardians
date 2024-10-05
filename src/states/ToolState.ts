export class ToolState {
  private selectedTool = 1;

  constructor() {}

  getSelectedTool(): number {
    return this.selectedTool;
  }

  setSelectedTool(value: number) {
    this.selectedTool = Math.min(Math.max(value, 1), 4)
  }
}
