import { useRef } from "react";
import { CustomDialog } from "./CustomDialog";
import PaletteIcon from "@mui/icons-material/Palette";

export interface ColorPickerDialogProps {
  title?: string;
  open: boolean;
  colors: string[];
  onColorSelected: (color: string[]) => void;
  onClose: () => void;
}

export const ColorPickerDialog: React.FC<ColorPickerDialogProps> = (props) => {
  const { title = "Colors", open, colors, onColorSelected, onClose } = props;
  const selectedColorsRef = useRef(new Set<string>());

  const isSelected = (color: string) => selectedColorsRef.current.has(color);

  const handleSelectColor = (color: string) => {
    const selectedColors = selectedColorsRef.current;

    if (selectedColors.has(color)) {
      selectedColors.delete(color);
    } else {
      selectedColors.add(color);
    }

    onColorSelected(Array.from(selectedColors));
  };

  return (
    <CustomDialog
      open={open}
      title={title}
      handleClose={onClose}
      Icon={PaletteIcon}
    >
      <div className="flex flex-row justify-center gap-4">
        {colors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className={`rounded-full w-12 h-12 border-3 ${
              isSelected(color) ? "ring-[5px] ring-gray-500" : ""
            }`}
            onClick={() => handleSelectColor(color)}
            style={{
              backgroundColor: color,
            }}
          ></div>
        ))}
      </div>
    </CustomDialog>
  );
};
