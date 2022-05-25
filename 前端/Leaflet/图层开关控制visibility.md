``` html
<div id="map"></div>

<div class="panel">
  <div class="item">
    <input type="checkbox" id="check4" checked />
    <span style="margin-left: 5px; font-size: 12px">四环</span>
  </div>
  <div class="item">
    <input type="checkbox" id="check5" checked />
    <span style="margin-left: 5px; font-size: 12px">五环</span>
  </div>
</div>

```

``` js
// Import stylesheets
import './style.css';
import {
  Map,
  TileLayer,
  LayerGroup,
  Control,
  Marker,
  Icon,
  GeoJSON
} from 'leaflet';

// Write Javascript code!
const map = new Map('map');

const amapLayer = new TileLayer(
  'http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
  {
    subdomains: '1234'
  }
);

const tdtVectorLayer = new TileLayer(
  'http://t0.tianditu.gov.cn/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=11b55a09c9e0df4a1e91741b455b7f28',
  {}
);

const tdtLabelLayer = new TileLayer(
  'http://t0.tianditu.gov.cn/cva_w/wmts?layer=cva&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=11b55a09c9e0df4a1e91741b455b7f28',
  {}
);

const tdtLayer = new LayerGroup([tdtVectorLayer, tdtLabelLayer]);

amapLayer.addTo(map);

map.setView([39.909186, 116.397411], 10);

const layerControl = new Control.Layers(
  {
    高德: amapLayer,
    天地图: tdtLayer
  },
  {},
  { collapsed: false }
);
layerControl.addTo(map);

const svg =
  '<svg t="1621166776642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1407" width="200" height="200"><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="#FF3D00" p-id="1408"></path></svg>';

const svg2 =
  '<svg t="1621166776642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1407" width="200" height="200"><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="#0000FF" p-id="1408"></path></svg>';

const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        NAME: '西北五环'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.22196197509766, 39.99527080014614]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: '东五环'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.53816223144531, 39.9034155951341]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: '南五环'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.40151977539062, 39.7631584037253]
      }
    }
  ]
};

const glayer5 = new GeoJSON(data, {
  pointToLayer: (geoJsonPoint, latlng) => {
    return new Marker(latlng, {
      icon: new Icon({
        iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svg),
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    });
  }
});

glayer5.addTo(map);

const check5 = document.getElementById('check5');
check5.onchange = evt => {
  if (evt.target.checked) {
    glayer5.addTo(map);
  } else {
    glayer5.removeFrom(map);
  }
};

const data2 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        NAME: '西四环'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.27037048339844, 39.905522539728544]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: '北四环'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.39396667480469, 39.98343393295322]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: '南四环'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.3946533203125, 39.828577091142016]
      }
    }
  ]
};

const glayer4 = new GeoJSON(data2, {
  pointToLayer: (geoJsonPoint, latlng) => {
    return new Marker(latlng, {
      icon: new Icon({
        iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svg2),
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    });
  }
});

glayer4.addTo(map);

const check4 = document.getElementById('check4');
check4.onchange = evt => {
  if (evt.target.checked) {
    glayer4.addTo(map);
  } else {
    glayer4.removeFrom(map);
  }
};

```

``` css
@import '~leaflet/dist/leaflet.css';

html,
body {
  width: 100%;
  height: 100%;
  margin: 0px;
}

h1,
h2 {
  font-family: Lato;
}

#map {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  top: 70px;
  right: 10px;
  z-index: 1000;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 1);
  border: 2px solid rgba(0, 0, 0, 0.2);
  width: 56px;
}
```
