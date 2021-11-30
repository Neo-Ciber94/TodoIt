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
import { useSprings, animated } from "react-spring";
import { animationSprings } from "src/animations/springs";

const AnimatedFormControl = animated(FormControl);

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

  const [springs, _] = useSprings(3, (index) =>
    animationSprings.slideLeftFadeIn((index + 2) * 100)
  );
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
          <AnimatedFormControl style={springs[0]} variant="standard" className={`mt-8 mb-2`}>
            <StyledTextField
              label="Title"
              variant="standard"
              {...register("title", { required: true })}
              error={!!errors.title}
              helperText={errors.title && "Title is required"}
            />
          </AnimatedFormControl>

          <AnimatedFormControl style={springs[1]} variant="standard" className={`mt-8 mb-2`}>
            <StyledTextField
              label="Content"
              variant="outlined"
              multiline
              minRows={4}
              maxRows={8}
              {...register("content")}
            />
          </AnimatedFormControl>

        <animated.div style={springs[2]}>
          <Button
            type="submit"
            variant="contained"
            disabled={showLoading}
            className={`flex flex-row justify-center text-white bg-black hover:bg-gray-800 mt-2`}
          >
            {buttonText}
            {showLoading && (
              <CircularProgress className="text-white mx-4" size={20} />
            )}
          </Button>
        </animated.div>
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
