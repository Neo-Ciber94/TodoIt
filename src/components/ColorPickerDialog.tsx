import { useRef } from "react";
import { CustomDialog } from "./CustomDialog";
import PaletteIcon from "@mui/icons-material/Palette";

export interface ColorPickerDialogProps {
  title?: string;
  open: boolean;
  colors: string[];
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  onClose: () => void;
}

export const ColorPickerDialog: React.FC<ColorPickerDialogProps> = (props) => {
  const {
    title = "Colors",
    open,
    colors,
    selectedColors,
    setSelectedColors,
    onClose,
  } = props;

  const isSelected = (color: string) => selectedColors.includes(color);

  const handleSelectColor = (color: string) => {
    const newColors = [...selectedColors];
    if (newColors.includes(color)) {
      newColors.splice(newColors.indexOf(color), 1);
    } else {
      newColors.push(color);
    }

    setSelectedColors(newColors);
  };

  return (
    <CustomDialog
      open={open}
      title={title}
      handleClose={onClose}
      Icon={PaletteIcon}
    >
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {colors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className={`rounded-full w-8 md:w-12 h-8 md:h-12 border-3 ${
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
