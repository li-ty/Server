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
## index.js
``` js
import './style.css';
import {
  Canvas,
  Map,
  GeoJSON,
  Marker,
  Icon,
  LayerGroup,
  CircleMarker
} from 'leaflet';
import { LabelTextCollision } from './label.js';

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
  renderer: new LabelTextCollision({
    collisionFlg: true
  })
});

map.on('zoom', evt => {
  amap.setZoom(evt.target.getZoom());
});

map.on('move', evt => {
  const pt = evt.target.getCenter();
  amap.setZoomAndCenter(evt.target.getZoom(), [pt.lng, pt.lat]);
});

map.setView([39.909186, 116.397411], 10);

const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        NAME: '西北五环',
        URL:
          'https://lbsugc.cdn.bcebos.com/images/H6609c93d70cf3bc772e13cf7de00baa1cc112acc.jpg',
        DESC: '这是一段很长的描述很长的描述很长的描述很长的描述很长的描述'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.22196197509766, 39.99527080014614]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: '东五环',
        URL:
          'https://lbsugc.cdn.bcebos.com/images/H7e3e6709c93d70cfd71b5b16f7dcd100bba12bcc.jpg',
        DESC: '这又是一段很长的描述很长的描述很长的描述很长的描述很长的描述'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.53816223144531, 39.9034155951341]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: '南五环',
        URL:
          'https://poi-pic.cdn.bcebos.com/d0bf12c973c86ccf2eb79d337bdeb860.jpg',
        DESC: '这还是一段很长的描述很长的描述很长的描述很长的描述很长的描述'
      },
      geometry: {
        type: 'Point',
        coordinates: [116.40151977539062, 39.7631584037253]
      }
    }
  ]
};

const svg =
  '<svg t="1621166776642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1407" width="200" height="200"><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="#FF3D00" p-id="1408"></path></svg>';

const glayer5 = new GeoJSON(data, {
  pointToLayer: (geoJsonPoint, latlng) => {
    return new CircleMarker(latlng, {
      text: geoJsonPoint.properties['NAME']
    }); //.bindTooltip(geoJsonPoint.properties['NAME'], { permanent: true });
  }
});

glayer5.addTo(map);

```
## label.js（改写自某个leaflet插件，见leaflet官网）
``` js
import {
  Canvas,
  Util,
  DomUtil,
  Browser,
  DomEvent,
  Renderer,
  Point,
  Bounds
} from 'leaflet';

export var LabelTextCollision = Canvas.extend({
  options: {
    /**
     * Collision detection
     */
    collisionFlg: true
  },

  initialize: function(options) {
    //options = Util.setOptions(this, options);
    Renderer.prototype.initialize.call(this, options);
  },

  _handleMouseHover: function(e, point) {
    var id, layer;

    for (id in this._drawnLayers) {
      layer = this._drawnLayers[id];
      if (layer.options.interactive && layer._containsPoint(point)) {
        DomUtil.addClass(this._containerText, 'leaflet-interactive'); // change cursor
        this._fireEvent([layer], e, 'mouseover');
        this._hoveredLayer = layer;
      }
    }

    if (this._hoveredLayer) {
      this._fireEvent([this._hoveredLayer], e);
    }
  },

  _handleMouseOut: function(e, point) {
    var layer = this._hoveredLayer;
    if (layer && (e.type === 'mouseout' || !layer._containsPoint(point))) {
      // if we're leaving the layer, fire mouseout
      DomUtil.removeClass(this._containerText, 'leaflet-interactive');
      this._fireEvent([layer], e, 'mouseout');
      this._hoveredLayer = null;
    }
  },

  _updateTransform: function(center, zoom) {
    Canvas.prototype._updateTransform.call(this, center, zoom);

    var scale = this._map.getZoomScale(zoom, this._zoom),
      position = DomUtil.getPosition(this._container),
      viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
      currentCenterPoint = this._map.project(this._center, zoom),
      destCenterPoint = this._map.project(center, zoom),
      centerOffset = destCenterPoint.subtract(currentCenterPoint),
      topLeftOffset = viewHalf
        .multiplyBy(-scale)
        .add(position)
        .add(viewHalf)
        .subtract(centerOffset);

    if (Browser.any3d) {
      DomUtil.setTransform(this._containerText, topLeftOffset, scale);
    } else {
      DomUtil.setPosition(this._containerText, topLeftOffset);
    }
  },
  _initContainer: function(options) {
    Canvas.prototype._initContainer.call(this);

    this._containerText = document.createElement('canvas');

    DomEvent.on(
      this._containerText,
      'mousemove',
      Util.throttle(this._onMouseMove, 32, this),
      this
    )
      .on(
        this._containerText,
        'click dblclick mousedown mouseup contextmenu',
        this._onClick,
        this
      )
      .on(this._containerText, 'mouseout', this._handleMouseOut, this);

    this._ctxLabel = this._containerText.getContext('2d');

    DomUtil.addClass(this._containerText, 'leaflet-zoom-animated');
    this.getPane().appendChild(this._containerText);
  },

  _update: function() {
    // textList
    this._textList = [];

    Renderer.prototype._update.call(this);
    var b = this._bounds,
      container = this._containerText,
      size = b.getSize(),
      m = Browser.retina ? 2 : 1;

    DomUtil.setPosition(container, b.min);

    // set canvas size (also clearing it); use double size on retina
    container.width = m * size.x;
    container.height = m * size.y;
    container.style.width = size.x + 'px';
    container.style.height = size.y + 'px';

    // display text on the whole surface
    container.style.zIndex = '4';
    this._container.style.zIndex = '3';

    if (Browser.retina) {
      this._ctxLabel.scale(2, 2);
    }

    // translate so we use the same path coordinates after canvas
    // element moves
    this._ctxLabel.translate(-b.min.x, -b.min.y);
    Canvas.prototype._update.call(this);
  },

  _updatePoly: function(layer, closed) {
    Canvas.prototype._updatePoly.call(this, layer, closed);
    this._text(this._ctxLabel, layer);
  },

  _updateCircle: function(layer) {
    Canvas.prototype._updateCircle.call(this, layer);
    this._text(this._ctxLabel, layer);
  },

  _text: function(ctx, layer) {
    if (layer.options.text != undefined) {
      ctx.globalAlpha = 1;

      var p = layer._point;
      var textPoint;

      if (p == undefined) {
        // polygon or polyline
        if (layer._parts.length == 0 || layer._parts[0].length == 0) {
          return;
        }
        p = this._getCenter(layer._parts[0]);
      }

      // label bounds offset
      var offsetX = 0;
      var offsetY = 0;

      /**
       * TODO setting for custom font
       */
      ctx.lineWidth = 4.0;
      ctx.font = "16px 'Meiryo'";

      // Collision detection
      var textWidth = ctx.measureText(layer.options.text).width + p.x; // + offsetX;

      var textHeight = p.y + offsetY + 20;

      var bounds = new Bounds(
        new Point(p.x + offsetX, p.y + offsetY),
        new Point(textWidth, textHeight)
      );

      if (this.options.collisionFlg) {
        for (var index in this._textList) {
          var pointBounds = this._textList[index];
          if (pointBounds.intersects(bounds)) {
            return;
          }
        }
      }

      this._textList.push(bounds);

      ctx.strokeStyle = 'white';
      ctx.strokeText(layer.options.text, p.x + offsetX, p.y + offsetY);

      if (layer.options.textColor == undefined) {
        ctx.fillStyle = 'blue';
      } else {
        ctx.fillStyle = layer.options.textColor;
      }

      ctx.fillText(layer.options.text, p.x + offsetX, p.y + offsetY);
    }
  },

  _getCenter: function(points) {
    var i,
      halfDist,
      segDist,
      dist,
      p1,
      p2,
      ratio,
      len = points.length;

    if (!len) {
      return null;
    }

    // polyline centroid algorithm; only uses the first ring if
    // there are multiple

    for (i = 0, halfDist = 0; i < len - 1; i++) {
      halfDist += points[i].distanceTo(points[i + 1]) / 2;
    }

    // The line is so small in the current view that all points are
    // on the same pixel.
    if (halfDist === 0) {
      return points[0];
    }

    for (i = 0, dist = 0; i < len - 1; i++) {
      p1 = points[i];
      p2 = points[i + 1];
      segDist = p1.distanceTo(p2);
      dist += segDist;

      if (dist > halfDist) {
        ratio = (dist - halfDist) / segDist;
        var resutl = [
          p2.x - ratio * (p2.x - p1.x),
          p2.y - ratio * (p2.y - p1.y)
        ];

        return new Point(resutl[0], resutl[1]);
      }
    }
  }
});

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
