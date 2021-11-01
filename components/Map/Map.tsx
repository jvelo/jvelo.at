/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

const MAPBOX_STYLE = "mapbox://styles/jvelo/ckvgvoamk0wds15mj5j2g3zu6";
const ACCESS_TOKEN = process.env.MAPBOX_TOKEN;

const DEFAULT_ZOOM = 10.5;

const DEFAULT_COORDS = {
  latitude: 48.8587741, // Paname, paname, paname
  longitude: 2.3270149,
};

export const Map: React.FC = () => {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: DEFAULT_COORDS.latitude,
    longitude: DEFAULT_COORDS.longitude,
    zoom: DEFAULT_ZOOM,
  });

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxApiAccessToken={ACCESS_TOKEN}
      mapStyle={MAPBOX_STYLE}
    />
  );
};

export default Map;
