import { TodoForm } from "src/components/TodoForm";
import { Button, Container, IconButton } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import PaletteIcon from "@mui/icons-material/Palette";
import React, { useEffect, useRef, useState } from "react";
import { ITodo, ITodoInput } from "@shared/models/todo.model";
import { useSpring, animated } from "react-spring";
import { animationSprings } from "src/animations/springs";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TagsModal from "./TagsModal";
import { TagApiService } from "src/client/services";
import { ITag, ITagInput } from "@shared/models/tag.model";

const tagService = new TagApiService();

export interface CreateOrEditTodoPageProps {
  todo?: ITodo;
  onSubmit: (todo: ITodoInput) => void;
  title: string;
  submitText: string;
}

export function CreateOrEditTodoPage({
  todo,
  onSubmit,
  title: pageTitleText,
  submitText: submitButtonText,
}: CreateOrEditTodoPageProps) {
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const backButtonSpring = useSpring(animationSprings.slideLeftFadeIn(0));
  const titleSpring = useSpring(animationSprings.slideLeftFadeIn(100));
  const [tagsOpen, setTagsOpen] = useState(false);

  const handleSelectTags = (tags: ITagInput[]) => {
    console.log(tags);
  };

  return (
    <>
      <Container className="pt-4">
        <div className="md:px-30 sm:px-20 px-0 flex flex-row justify-between">
          <animated.div style={backButtonSpring}>
            <Link href="/" passHref>
              <Button
                variant="contained"
                className={`bg-black hover:bg-gray-800`}
              >
                <ArrowBackIcon />
                Back
              </Button>
            </Link>
          </animated.div>

          <div>
            <IconButton title="Add tags" onClick={() => setTagsOpen(true)}>
              <LocalOfferIcon sx={{ color: "black" }} />
            </IconButton>

            <IconButton
              title="Change Color"
              onClick={() => {
                setOpenColorPicker(true);
              }}
            >
              <PaletteIcon sx={{ color: "black" }} />
            </IconButton>
          </div>
        </div>

        <animated.div style={titleSpring}>
          <PageTitle title={pageTitleText} center />
        </animated.div>

        <TodoForm
          initialValue={todo}
          buttonText={submitButtonText}
          openColorPicker={openColorPicker}
          onCloseColorPicker={() => setOpenColorPicker(false)}
          onSubmit={(data) => onSubmit(data)}
        />
      </Container>

      <TagsModal
        initialTags={[]}
        todo={todo}
        open={tagsOpen}
        setOpen={setTagsOpen}
        onSelectTags={handleSelectTags}
      />
    </>
  );
}
