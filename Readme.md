# React TS Audio Visualiser

This is a customizable audio visualizer React component created with TypeScript.

#### [Demo](https://react-audio-visualiser.vercel.app/)

### Installation

```
npm i react-ts-audiovisualiser
```

### Usage

Import the AudioVisualizer component and pass in the necessary props:

```
import { useState } from "react";
import "./App.css";
import AudioVisualiser from "./components/AudioVisualiser/AudioVisualiser";
function App() {
  const [data, setData] = useState<FileList>();
  return (
    <div id="container">
      <div id="items_container">
        <audio id="audio" controls></audio>
        <input
          onChange={(e) => {
            if (e.target.files) {
              setData(e.target.files);
            }
          }}
          type="file"
          id="fileupload"
          accept="audio/*"
        />
      </div>
      <AudioVisualiser data={data || []} />
    </div>
  );
}

export default App;
```

### Available props

```
type - "circular","blocks"
liquidStyle - "boolean"
color - "white" , "colorfull"
customColor - "any css acceptable color"
fftSize - 64 , 128 , 512 , 1024
height - "number" // by default its window.innerHeight/2
width - "number" // by default its window.innerWidth
```

I would love to see your views on this small package. Thanks for checking it out.
