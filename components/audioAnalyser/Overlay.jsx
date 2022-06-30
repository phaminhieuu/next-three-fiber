import useStore from "../../store/store";
import React from "react";

export default function Overlay() {
  const loaded = useStore((state) => state.loaded);
  const clicked = useStore((state) => state.clicked);
  const api = useStore((state) => state.api);
  return (
    <>
      <div
        className={`fullscreen bg ${loaded ? "loaded" : "notready"} ${
          clicked && "clicked"
        }`}
      >
        <div onClick={() => loaded && api.start()}>
          {!loaded ? (
            "loading"
          ) : (
            <>
              <span style={{ color: "#606060" }}>Sẽ có nhạc đấy</span>
              <br />
              <span style={{ color: "#606060" }}>Nhớ cắm tai nghe</span>
              <br />
              <b>
                <span style={{ color: "black" }}>Bấm zô đi người đẹp</span>
              </b>
            </>
          )}
        </div>
      </div>
    </>
  );
}
