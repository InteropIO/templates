export const getBounds = (element: HTMLElement | null) => {
  if (!element) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
    };
  }

  const bounds = element.getBoundingClientRect();

  return {
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    right: bounds.right,
    bottom: bounds.bottom,
    x: bounds.x,
    y: bounds.y,
  };
};
