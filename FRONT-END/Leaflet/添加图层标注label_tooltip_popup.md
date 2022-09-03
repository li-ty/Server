``` html
<div id="map"></div>
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
  '<svg t="1621497200015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17065" width="200" height="200"><path d="M768 597.333333 597.333333 597.333333 597.333333 768 426.666667 768 426.666667 597.333333 256 597.333333 256 426.666667 426.666667 426.666667 426.666667 256 597.333333 256 597.333333 426.666667 768 426.666667M810.666667 128 213.333333 128C165.973333 128 128 165.973333 128 213.333333L128 810.666667C128 857.6 166.4 896 213.333333 896L810.666667 896C857.6 896 896 857.6 896 810.666667L896 213.333333C896 165.973333 857.6 128 810.666667 128Z" fill="#FF0000" p-id="17066"></path></svg>';

const svg2 =
  '<svg t="1621497335200" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17198" width="200" height="200"><path d="M512 128 42.666667 384 512 640 896 430.506667 896 725.333333 981.333333 725.333333 981.333333 384M213.333333 562.346667 213.333333 733.013333 512 896 810.666667 733.013333 810.666667 562.346667 512 725.333333 213.333333 562.346667Z" fill="#0000FF" p-id="17199"></path></svg>';

const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        NAME: 'A医院',
        TYPE: '医院'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.22196197509766, 39.99527080014614]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: 'B医院',
        TYPE: '医院'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.53816223144531, 39.9034155951341]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: 'C学校',
        TYPE: '学校'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.40151977539062, 39.7631584037253]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: 'D医院',
        TYPE: '医院'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.4276123046875, 39.969753220824714]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: 'E学校',
        TYPE: '学校'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.28273010253905, 39.832795514765444]
      }
    }
  ]
};

const glayer = new GeoJSON(data, {
  pointToLayer: (geoJsonPoint, latlng) => {
    switch (geoJsonPoint.properties['TYPE']) {
      case '医院':
        return new Marker(latlng, {
          icon: new Icon({
            iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svg),
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).bindTooltip(geoJsonPoint.properties['NAME'], { permanent: true });
      case '学校':
        return new Marker(latlng, {
          icon: new Icon({
            iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svg2),
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).bindTooltip(geoJsonPoint.properties['NAME'], { permanent: true });
    }
  }
});

glayer.addTo(map);

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
  top: 10px;
  right: 10px;
  z-index: 1000;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.8);
}

```
