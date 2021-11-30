import {
  Button,
  FormControl,
  TextField,
  CircularProgress,
  styled,
} from "@mui/material";
import { PASTEL_COLORS, randomPastelColor } from "@shared/config";
import { ITodo } from "@shared/models/todo.model";
import { ArrayUtils } from "@shared/utils/ArrayUtils";
import { useForm } from "react-hook-form";
import { usePageColor } from "src/contexts/PageColorContext";
import { ColorPickerDrawer } from "./ColorPickerDrawer";

const delayMs = ArrayUtils.range(1, 3).map((i) => i * 100);
const delay = delayMs.map((ms) => `${ms}ms !important`);

type TodoFormData = Partial<ITodo>;

export interface TodoFormProps {
  initialValue?: TodoFormData;
  buttonText: string;
  openColorPicker: boolean;
  onCloseColorPicker: () => void;
  onSubmit: (data: TodoFormData) => void;
}

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "gray",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "gray",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});

export function TodoForm({
  onSubmit,
  buttonText,
  initialValue,
  openColorPicker,
  onCloseColorPicker,
}: TodoFormProps) {
  const {
    register,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = useForm<TodoFormData>({
    defaultValues: initialValue,
  });

  const { pageColor, setPageColor } = usePageColor(
    initialValue?.color || randomPastelColor()
  );
  const showLoading = isSubmitting || isSubmitSuccessful;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:px-40 px-0"
      >
        <FormControl
          variant="standard"
          sx={{ animationDelay: delay[0] }}
          className={`mt-8 mb-2 slideLeftFadeIn`}
        >
          <StyledTextField
            label="Title"
            variant="standard"
            {...register("title", { required: true })}
            error={!!errors.title}
            helperText={errors.title && "Title is required"}
          />
        </FormControl>

        <FormControl
          variant="standard"
          sx={{ animationDelay: delay[1] }}
          className={`mt-8 mb-2 slideLeftFadeIn`}
        >
          <StyledTextField
            label="Content"
            variant="outlined"
            multiline
            minRows={4}
            maxRows={8}
            {...register("content")}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={showLoading}
          sx={{ animationDelay: delay[2] }}
          className={`flex flex-row justify-center text-white bg-black hover:bg-gray-800 mt-2 slideLeftFadeIn`}
        >
          {buttonText}
          {showLoading && (
            <CircularProgress className="text-white mx-4" size={20} />
          )}
        </Button>
      </form>
      <ColorPickerDrawer
        open={openColorPicker}
        selectedColor={pageColor}
        colors={PASTEL_COLORS}
        onClose={onCloseColorPicker}
        onColorSelected={(color) => {
          setPageColor(color);
          setValue("color", color);
        }}
      />
    </>
  );
}
