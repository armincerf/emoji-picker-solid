import EmojiPicker from "emoji-picker-solid";
import { render } from "solid-js/web";
function App() {
  return (
    <div>
      <EmojiPicker />
    </div>
  );
}

const root = document.getElementById("root");
if (!root) {
	throw new Error("Root element not found");
}

render(() => <App />, root);
