import { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function EmojiDemo() {
  const [msg, setMsg] = useState("");

  return (
    <div className="p-4">
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => setMsg(msg + emoji.native)}
      />

      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="border p-2 mt-4"
      />
    </div>
  );
}
