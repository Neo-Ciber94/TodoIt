import {
  Button,
  FormControl,
  TextField,
  CircularProgress,
  styled,
} from "@mui/material";
import { PASTEL_COLORS, randomPastelColor } from "@shared/config";
import { ITodo, ITodoInput } from "@shared/models/todo.model";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { usePageColor } from "src/contexts/PageColorContext";
import { ColorPickerDrawer } from "./ColorPickerDrawer";
import { useSprings, animated } from "react-spring";
import { animations } from "src/animations/springs";
import { useState } from "react";

const AnimatedFormControl = animated(FormControl);

export interface TodoFormProps {
  initialValue?: ITodoInput;
  buttonText: string;
  openColorPicker: boolean;
  onCloseColorPicker: () => void;
  onSubmit: (data: ITodoInput) => Promise<void> | void;
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
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ITodoInput>({
    defaultValues: initialValue,
  });

  const [isLoading, setIsLoading] = useState(false);
  const showError = (error: string) => toast.error(error);

  const [springs, _] = useSprings(3, (index) =>
    animations.slideLeftFadeIn((index + 2) * 100)
  );
  const { pageColor, setPageColor } = usePageColor(
    initialValue?.color || randomPastelColor()
  );

  const submit = async (data: ITodoInput) => {
    setIsLoading(true);

    try {
      await onSubmit(data);
    } catch (e: any) {
      const message = e.message || e.error || "An error ocurred";
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col md:px-30 sm:px-20 px-0"
      >
        <AnimatedFormControl
          style={springs[0]}
          variant="standard"
          className={`mt-8 mb-2`}
        >
          <StyledTextField
            label="Title"
            variant="standard"
            {...register("title", { required: true })}
            error={!!errors.title}
            helperText={errors.title && "Title is required"}
          />
        </AnimatedFormControl>

        <AnimatedFormControl
          style={springs[1]}
          variant="standard"
          sx={{ marginTop: 3, marginBottom: 1 }}
        >
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
            disabled={isLoading}
            sx={{
              marginTop: 1,
              width: ["100%", "auto", "20%"],
            }}
            className={`flex flex-row justify-center bg-black`}
          >
            {buttonText}
            {isLoading && (
              <CircularProgress
                sx={{ color: "white", margin: "16px 0" }}
                size={20}
              />
            )}
          </Button>
        </animated.div>
      </form>
      <ToastContainer theme="colored" />
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
