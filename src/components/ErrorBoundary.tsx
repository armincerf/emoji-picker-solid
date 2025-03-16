import { JSX, createSignal, ErrorBoundary as SolidErrorBoundary } from 'solid-js';
import { Show } from 'solid-js/web';

interface ErrorBoundaryProps {
  children: JSX.Element;
}

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const [hasError, setHasError] = createSignal(false);

  return (
    <SolidErrorBoundary 
      fallback={(error) => {
        // eslint-disable-next-line no-console
        console.error('Emoji Picker Solid failed to render:', error);
        setHasError(true);
        return null;
      }}
    >
      <Show when={!hasError()}>
        {props.children}
      </Show>
    </SolidErrorBoundary>
  );
}
