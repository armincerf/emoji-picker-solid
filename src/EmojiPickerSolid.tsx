import { createEffect, createSignal, Show } from 'solid-js';

import { PickerStyleTag } from './Stylesheet/stylesheet';
import { Reactions } from './components/Reactions/Reactions';
import { Body } from './components/body/Body';
import { ElementRefContextProvider } from './components/context/ElementRefContext';
import { PickerConfigProvider } from './components/context/PickerConfigContext';
import { useReactionsModeState } from './components/context/PickerContext';
import { Preview } from './components/footer/Preview';
import { Header } from './components/header/Header';
import PickerMain from './components/main/PickerMain';
import { compareConfig } from './config/compareConfig';
import { useAllowExpandReactions, useOpenConfig } from './config/useConfig';

import { PickerProps } from './index';

function EmojiPicker(props: PickerProps) {
  return (
    <ElementRefContextProvider>
      <PickerStyleTag />
      <PickerConfigProvider {...props}>
        <ContentControl />
      </PickerConfigProvider>
    </ElementRefContextProvider>
  );
}

function ContentControl() {
  const [reactionsDefaultOpen] = useReactionsModeState();
  const allowExpandReactions = useAllowExpandReactions();

  const [renderAll, setRenderAll] = createSignal(!reactionsDefaultOpen());

  const isOpen = useOpenConfig();

  createEffect(() => {
    if (reactionsDefaultOpen() && !allowExpandReactions()) {
      return;
    }

    if (!renderAll()) {
      setRenderAll(true);
    }
  });

  return (
    <Show when={isOpen()}>
      <PickerMain>
        <Reactions />
        <ExpandedPickerContent renderAll={renderAll()} />
      </PickerMain>
    </Show>
  );
}

function ExpandedPickerContent(props: { renderAll: boolean }) {
  return (
    <Show when={props.renderAll}>
      <Header />
      <Body />
      <Preview />
    </Show>
  );
}

export default EmojiPicker; 