import { IconButton, Drawer, Box } from "@mui/material";

export interface ColorPickerDrawerProps {
  open: boolean;
  selectedColor?: string;
  colors: string[];
  onClose?: () => void;
  onColorSelected: (color: string) => void;
}

export function ColorPickerDrawer(props: ColorPickerDrawerProps) {
  const { open, selectedColor, colors, onClose, onColorSelected } = props;

  const circleSizes = [30, 40, 50, 60, 70];

  return (
    <Drawer
      PaperProps={{
        sx: { backgroundColor: "rgb(31, 41, 55)" },
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-row justify-center p-8 h-full w-full sm:px-auto px-48">
        {colors.map((color) => (
          <IconButton
            key={color}
            onClick={() => {
              onColorSelected(color);
              if (onClose) {
                onClose();
              }
            }}
          >
            <Box
              className={`${
                selectedColor === color ? "ring-[5px] ring-gray-500" : ""
              }`}
              sx={{
                backgroundColor: color,
                width: circleSizes,
                height: circleSizes,
                borderRadius: "50%",
              }}
            ></Box>
          </IconButton>
        ))}
      </div>
    </Drawer>
  );
}
