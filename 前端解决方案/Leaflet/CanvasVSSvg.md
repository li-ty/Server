``` html
<head>
  <script
    type="text/javascript"
    src="https://webapi.amap.com/maps?v=1.4.15&key="
  ></script>
</head>
<div
  id="map"
  style="width: 100%; height: 100%; position: absolute; z-index: 2; background: transparent;"
></div>
<div
  id="amap"
  style="width: 100%; height: 100%; position: absolute; z-index: 1; "
></div>

```

``` js
import './style.css';
import {
  Canvas,
  Map,
  Marker,
  CircleMarker,
  Polyline,
  Polygon,
  Icon
} from 'leaflet';

// Write Javascript code!
//创建高德Map
const amap = new AMap.Map('amap', {
  fadeOnZoom: false,
  navigationMode: 'classic',
  optimizePanAnimation: false,
  animateEnable: false,
  dragEnable: false,
  zoomEnable: false,
  resizeEnable: true,
  doubleClickZoom: false,
  keyboardEnable: false,
  scrollWheel: false,
  expandZoomRange: true,
  zooms: [1, 20],
  mapStyle: 'amap://styles/1e65d329854a3cf61b568b7a4e2267fd',
  features: ['road', 'point', 'bg'],
  viewMode: '2D'
});
//创建Leaflet Map
const map = new Map('map', {
  renderer: new Canvas()
});

map.on('zoom', evt => {
  amap.setZoom(evt.target.getZoom());
});

map.on('move', evt => {
  const pt = evt.target.getCenter();
  amap.setZoomAndCenter(evt.target.getZoom(), [pt.lng, pt.lat]);
});

map.setView([39.909186, 116.397411], 10);

//点  图标
new Marker([39.909186, 116.397411], {
  icon: new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconAnchor: [12, 41]
  })
}).addTo(map);

//点  圆点
new CircleMarker([39.909186, 116.457411]).addTo(map);

//线
new Polyline([[39.909186, 116.457411], [39.999186, 116.457411]]).addTo(map);

//面
new Polygon([
  [39.999186, 116.507411],
  [39.999186, 116.407411],
  [40.099186, 116.407411],
  [40.099186, 116.507411]
]).addTo(map);

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

```
