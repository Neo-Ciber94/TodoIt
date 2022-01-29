import {
  Button,
  FormControl,
  TextField,
  CircularProgress,
  styled,
} from "@mui/material";
import { PASTEL_COLORS, randomPastelColor } from "@shared/config";
import { ITodoInput } from "@shared/models/todo.model";
import { useForm } from "react-hook-form";
import { usePageColor } from "src/contexts/PageColorContext";
import { ColorPickerDrawer } from "./ColorPickerDrawer";
import { useSprings, animated } from "react-spring";
import { animations } from "src/animations/springs";
import { useState } from "react";
import { useToast } from "src/hooks/useToast";
import { useCacheState } from "src/hooks/useCacheState";
import { useEffect } from "react";
import { LocalStorageCache } from "src/client/caching/storage-cache";

const AnimatedFormControl = animated(FormControl);

type ITodoInputCache = Partial<Pick<ITodoInput, "title" | "content" | "color">>;

export interface TodoFormProps {
  initialValue?: ITodoInput;
  buttonText: string;
  openColorPicker: boolean;
  cache?: boolean;
  onCloseColorPicker: () => void;
  onSubmit: (data: ITodoInput) => Promise<void> | void;
}

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "gray",
  },
  "& label": {
    color: "rgb(0, 0, 0, 0.3)",
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
  cache = false,
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
    watch,
    formState: { errors },
  } = useForm<ITodoInput>({
    defaultValues: initialValue,
  });

  useEffect(() => {
    if (cache) {
      const storageCache = new LocalStorageCache<ITodoInputCache>();
      const cachedValue = storageCache.get("todo-form");

      if (cachedValue) {
        if (cachedValue.title) {
          setValue("title", cachedValue.title);
        }

        if (cachedValue.content) {
          setValue("content", cachedValue.content);
        }

        if (cachedValue.color) {
          setValue("color", cachedValue.color);
        }
      }

      watch((form) => {
        storageCache.set(
          "todo-form",
          {
            title: form.title,
            content: form.content,
            color: form.color,
          },
          {
            ttl: 1000 * 60 * 60, // 1 hour
          }
        );
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToast();

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
                sx={{ color: "white", marginLeft: 2 }}
                size={20}
              />
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
