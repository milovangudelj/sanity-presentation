"use client";

import { NextStudio } from "next-sanity/studio";
import { useEffect, useState } from "react";
import config from "~/sanity.config";

export default function Studio() {
  // This render/key fix is needed to avoid a bug in the studio
  // where it loses the user session when using loginMethod: 'token'.
  // Forcing a second render gives enough time for the studio to
  // hydrate the user session.

  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setRenderCount(1);
    }, 200);
  }, []);

  return <NextStudio config={config} key={renderCount} />;
}
