export const rgbToHex = (rgb: string) => {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  if (!result) {
    throw new Error(
      "Formato RGB no válido. Asegúrate de que esté en el formato 'rgb(r, g, b)'."
    );
  }

  const r = parseInt(result[1], 10);
  const g = parseInt(result[2], 10);
  const b = parseInt(result[3], 10);

  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const hexToRgb = (hex: string) => {
  const isValidHex = /^#([A-Fa-f0-9]{6})$/.test(hex);
  if (!isValidHex) {
    throw new Error(
      "Formato hexadecimal no válido. Asegúrate de que esté en el formato '#RRGGBB'."
    );
  }

  hex = hex.substring(1);

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
};
