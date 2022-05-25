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
  CircleMarker,
  FeatureGroup
} from 'leaflet';
import { MarkerClusterGroup } from './marker-cluster-group.js';

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
  maxZoom: 18
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

const cluster = new MarkerClusterGroup();
//const cluster = new FeatureGroup();
data.features.forEach(feature => {
  const marker = new Marker(
    [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
    {
      icon: new Icon({
        iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svg),
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    }
  );
  /*const marker = new CircleMarker([
    feature.geometry.coordinates[1],
    feature.geometry.coordinates[0]
  ]);*/
  cluster.addLayer(marker);
});

cluster.addTo(map);

```
## marker-cluster-group.js
``` js
import {
  FeatureGroup,
  LayerGroup,
  Marker,
  Point,
  Polygon,
  Util,
  DomUtil,
  DivIcon,
  Icon,
  LatLng,
  Browser,
  LatLngBounds
} from 'leaflet';
import { MarkerCluster } from './marker-cluster.js';
import { DistanceGrid } from './distance-grid.js';

export var MarkerClusterGroup = FeatureGroup.extend({
  options: {
    maxClusterRadius: 80, //A cluster will cover at most this many pixels from its center
    iconCreateFunction: null,
    clusterPane: Marker.prototype.options.pane,

    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    singleMarkerMode: false,

    disableClusteringAtZoom: null,

    // Setting this to false prevents the removal of any clusters outside of the viewpoint, which
    // is the default behaviour for performance reasons.
    removeOutsideVisibleBounds: true,

    // Set to false to disable all animations (zoom and spiderfy).
    // If false, option animateAddingMarkers below has no effect.
    // If L.DomUtil.TRANSITION is falsy, this option has no effect.
    animate: true,

    //Whether to animate adding markers after adding the MarkerClusterGroup to the map
    // If you are adding individual markers set to true, if adding bulk markers leave false for massive performance gains.
    animateAddingMarkers: false,

    // Make it possible to provide custom function to calculate spiderfy shape positions
    spiderfyShapePositions: null,

    //Increase to increase the distance away that spiderfied markers appear from the center
    spiderfyDistanceMultiplier: 1,

    // Make it possible to specify a polyline options on a spider leg
    spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },

    // When bulk adding layers, adds markers in chunks. Means addLayers may not add all the layers in the call, others will be loaded during setTimeouts
    chunkedLoading: false,
    chunkInterval: 200, // process markers for a maximum of ~ n milliseconds (then trigger the chunkProgress callback)
    chunkDelay: 50, // at the end of each interval, give n milliseconds back to system/browser
    chunkProgress: null, // progress callback: function(processed, total, elapsed) (e.g. for a progress indicator)

    //Options to pass to the L.Polygon constructor
    polygonOptions: {}
  },

  initialize: function(options) {
    Util.setOptions(this, options);
    if (!this.options.iconCreateFunction) {
      this.options.iconCreateFunction = this._defaultIconCreateFunction;
    }

    this._featureGroup = new FeatureGroup();
    this._featureGroup.addEventParent(this);

    this._nonPointGroup = new FeatureGroup();
    this._nonPointGroup.addEventParent(this);

    this._inZoomAnimation = 0;
    this._needsClustering = [];
    this._needsRemoving = []; //Markers removed while we aren't on the map need to be kept track of
    //The bounds of the currently shown area (from _getExpandedVisibleBounds) Updated on zoom/move
    this._currentShownBounds = null;

    this._queue = [];

    this._childMarkerEventHandlers = {
      dragstart: this._childMarkerDragStart,
      move: this._childMarkerMoved,
      dragend: this._childMarkerDragEnd
    };

    // Hook the appropriate animation methods.
    var animate = DomUtil.TRANSITION && this.options.animate;
    Util.extend(this, animate ? this._withAnimation : this._noAnimation);
    // Remember which MarkerCluster class to instantiate (animated or not).
    this._markerCluster = MarkerCluster;
  },

  addLayer: function(layer) {
    if (layer instanceof LayerGroup) {
      return this.addLayers([layer]);
    }

    //Don't cluster non point data
    if (!layer.getLatLng) {
      this._nonPointGroup.addLayer(layer);
      this.fire('layeradd', { layer: layer });
      return this;
    }

    if (!this._map) {
      this._needsClustering.push(layer);
      this.fire('layeradd', { layer: layer });
      return this;
    }

    if (this.hasLayer(layer)) {
      return this;
    }

    //If we have already clustered we'll need to add this one to a cluster

    if (this._unspiderfy) {
      this._unspiderfy();
    }

    this._addLayer(layer, this._maxZoom);
    this.fire('layeradd', { layer: layer });

    // Refresh bounds and weighted positions.
    this._topClusterLevel._recalculateBounds();

    this._refreshClustersIcons();

    //Work out what is visible
    var visibleLayer = layer,
      currentZoom = this._zoom;
    if (layer.__parent) {
      while (visibleLayer.__parent._zoom >= currentZoom) {
        visibleLayer = visibleLayer.__parent;
      }
    }

    if (this._currentShownBounds.contains(visibleLayer.getLatLng())) {
      if (this.options.animateAddingMarkers) {
        this._animationAddLayer(layer, visibleLayer);
      } else {
        this._animationAddLayerNonAnimated(layer, visibleLayer);
      }
    }
    return this;
  },

  removeLayer: function(layer) {
    if (layer instanceof LayerGroup) {
      return this.removeLayers([layer]);
    }

    //Non point layers
    if (!layer.getLatLng) {
      this._nonPointGroup.removeLayer(layer);
      this.fire('layerremove', { layer: layer });
      return this;
    }

    if (!this._map) {
      if (
        !this._arraySplice(this._needsClustering, layer) &&
        this.hasLayer(layer)
      ) {
        this._needsRemoving.push({ layer: layer, latlng: layer._latlng });
      }
      this.fire('layerremove', { layer: layer });
      return this;
    }

    if (!layer.__parent) {
      return this;
    }

    if (this._unspiderfy) {
      this._unspiderfy();
      this._unspiderfyLayer(layer);
    }

    //Remove the marker from clusters
    this._removeLayer(layer, true);
    this.fire('layerremove', { layer: layer });

    // Refresh bounds and weighted positions.
    this._topClusterLevel._recalculateBounds();

    this._refreshClustersIcons();

    layer.off(this._childMarkerEventHandlers, this);

    if (this._featureGroup.hasLayer(layer)) {
      this._featureGroup.removeLayer(layer);
      if (layer.clusterShow) {
        layer.clusterShow();
      }
    }

    return this;
  },

  //Takes an array of markers and adds them in bulk
  addLayers: function(layersArray, skipLayerAddEvent) {
    if (!Util.isArray(layersArray)) {
      return this.addLayer(layersArray);
    }

    var fg = this._featureGroup,
      npg = this._nonPointGroup,
      chunked = this.options.chunkedLoading,
      chunkInterval = this.options.chunkInterval,
      chunkProgress = this.options.chunkProgress,
      l = layersArray.length,
      offset = 0,
      originalArray = true,
      m;

    if (this._map) {
      var started = new Date().getTime();
      var process = Util.bind(function() {
        var start = new Date().getTime();

        // Make sure to unspiderfy before starting to add some layers
        if (this._map && this._unspiderfy) {
          this._unspiderfy();
        }

        for (; offset < l; offset++) {
          if (chunked && offset % 200 === 0) {
            // every couple hundred markers, instrument the time elapsed since processing started:
            var elapsed = new Date().getTime() - start;
            if (elapsed > chunkInterval) {
              break; // been working too hard, time to take a break :-)
            }
          }

          m = layersArray[offset];

          // Group of layers, append children to layersArray and skip.
          // Side effects:
          // - Total increases, so chunkProgress ratio jumps backward.
          // - Groups are not included in this group, only their non-group child layers (hasLayer).
          // Changing array length while looping does not affect performance in current browsers:
          // http://jsperf.com/for-loop-changing-length/6
          if (m instanceof LayerGroup) {
            if (originalArray) {
              layersArray = layersArray.slice();
              originalArray = false;
            }
            this._extractNonGroupLayers(m, layersArray);
            l = layersArray.length;
            continue;
          }

          //Not point data, can't be clustered
          if (!m.getLatLng) {
            npg.addLayer(m);
            if (!skipLayerAddEvent) {
              this.fire('layeradd', { layer: m });
            }
            continue;
          }

          if (this.hasLayer(m)) {
            continue;
          }

          this._addLayer(m, this._maxZoom);
          if (!skipLayerAddEvent) {
            this.fire('layeradd', { layer: m });
          }

          //If we just made a cluster of size 2 then we need to remove the other marker from the map (if it is) or we never will
          if (m.__parent) {
            if (m.__parent.getChildCount() === 2) {
              var markers = m.__parent.getAllChildMarkers(),
                otherMarker = markers[0] === m ? markers[1] : markers[0];
              fg.removeLayer(otherMarker);
            }
          }
        }

        if (chunkProgress) {
          // report progress and time elapsed:
          chunkProgress(offset, l, new Date().getTime() - started);
        }

        // Completed processing all markers.
        if (offset === l) {
          // Refresh bounds and weighted positions.
          this._topClusterLevel._recalculateBounds();

          this._refreshClustersIcons();

          this._topClusterLevel._recursivelyAddChildrenToMap(
            null,
            this._zoom,
            this._currentShownBounds
          );
        } else {
          setTimeout(process, this.options.chunkDelay);
        }
      }, this);

      process();
    } else {
      var needsClustering = this._needsClustering;

      for (; offset < l; offset++) {
        m = layersArray[offset];

        // Group of layers, append children to layersArray and skip.
        if (m instanceof LayerGroup) {
          if (originalArray) {
            layersArray = layersArray.slice();
            originalArray = false;
          }
          this._extractNonGroupLayers(m, layersArray);
          l = layersArray.length;
          continue;
        }

        //Not point data, can't be clustered
        if (!m.getLatLng) {
          npg.addLayer(m);
          continue;
        }

        if (this.hasLayer(m)) {
          continue;
        }

        needsClustering.push(m);
      }
    }
    return this;
  },

  //Takes an array of markers and removes them in bulk
  removeLayers: function(layersArray) {
    var i,
      m,
      l = layersArray.length,
      fg = this._featureGroup,
      npg = this._nonPointGroup,
      originalArray = true;

    if (!this._map) {
      for (i = 0; i < l; i++) {
        m = layersArray[i];

        // Group of layers, append children to layersArray and skip.
        if (m instanceof LayerGroup) {
          if (originalArray) {
            layersArray = layersArray.slice();
            originalArray = false;
          }
          this._extractNonGroupLayers(m, layersArray);
          l = layersArray.length;
          continue;
        }

        this._arraySplice(this._needsClustering, m);
        npg.removeLayer(m);
        if (this.hasLayer(m)) {
          this._needsRemoving.push({ layer: m, latlng: m._latlng });
        }
        this.fire('layerremove', { layer: m });
      }
      return this;
    }

    if (this._unspiderfy) {
      this._unspiderfy();

      // Work on a copy of the array, so that next loop is not affected.
      var layersArray2 = layersArray.slice(),
        l2 = l;
      for (i = 0; i < l2; i++) {
        m = layersArray2[i];

        // Group of layers, append children to layersArray and skip.
        if (m instanceof LayerGroup) {
          this._extractNonGroupLayers(m, layersArray2);
          l2 = layersArray2.length;
          continue;
        }

        this._unspiderfyLayer(m);
      }
    }

    for (i = 0; i < l; i++) {
      m = layersArray[i];

      // Group of layers, append children to layersArray and skip.
      if (m instanceof LayerGroup) {
        if (originalArray) {
          layersArray = layersArray.slice();
          originalArray = false;
        }
        this._extractNonGroupLayers(m, layersArray);
        l = layersArray.length;
        continue;
      }

      if (!m.__parent) {
        npg.removeLayer(m);
        this.fire('layerremove', { layer: m });
        continue;
      }

      this._removeLayer(m, true, true);
      this.fire('layerremove', { layer: m });

      if (fg.hasLayer(m)) {
        fg.removeLayer(m);
        if (m.clusterShow) {
          m.clusterShow();
        }
      }
    }

    // Refresh bounds and weighted positions.
    this._topClusterLevel._recalculateBounds();

    this._refreshClustersIcons();

    //Fix up the clusters and markers on the map
    this._topClusterLevel._recursivelyAddChildrenToMap(
      null,
      this._zoom,
      this._currentShownBounds
    );

    return this;
  },

  //Removes all layers from the MarkerClusterGroup
  clearLayers: function() {
    //Need our own special implementation as the LayerGroup one doesn't work for us

    //If we aren't on the map (yet), blow away the markers we know of
    if (!this._map) {
      this._needsClustering = [];
      this._needsRemoving = [];
      delete this._gridClusters;
      delete this._gridUnclustered;
    }

    if (this._noanimationUnspiderfy) {
      this._noanimationUnspiderfy();
    }

    //Remove all the visible layers
    this._featureGroup.clearLayers();
    this._nonPointGroup.clearLayers();

    this.eachLayer(function(marker) {
      marker.off(this._childMarkerEventHandlers, this);
      delete marker.__parent;
    }, this);

    if (this._map) {
      //Reset _topClusterLevel and the DistanceGrids
      this._generateInitialClusters();
    }

    return this;
  },

  //Override FeatureGroup.getBounds as it doesn't work
  getBounds: function() {
    var bounds = new LatLngBounds();

    if (this._topClusterLevel) {
      bounds.extend(this._topClusterLevel._bounds);
    }

    for (var i = this._needsClustering.length - 1; i >= 0; i--) {
      bounds.extend(this._needsClustering[i].getLatLng());
    }

    bounds.extend(this._nonPointGroup.getBounds());

    return bounds;
  },

  //Overrides LayerGroup.eachLayer
  eachLayer: function(method, context) {
    var markers = this._needsClustering.slice(),
      needsRemoving = this._needsRemoving,
      thisNeedsRemoving,
      i,
      j;

    if (this._topClusterLevel) {
      this._topClusterLevel.getAllChildMarkers(markers);
    }

    for (i = markers.length - 1; i >= 0; i--) {
      thisNeedsRemoving = true;

      for (j = needsRemoving.length - 1; j >= 0; j--) {
        if (needsRemoving[j].layer === markers[i]) {
          thisNeedsRemoving = false;
          break;
        }
      }

      if (thisNeedsRemoving) {
        method.call(context, markers[i]);
      }
    }

    this._nonPointGroup.eachLayer(method, context);
  },

  //Overrides LayerGroup.getLayers
  getLayers: function() {
    var layers = [];
    this.eachLayer(function(l) {
      layers.push(l);
    });
    return layers;
  },

  //Overrides LayerGroup.getLayer, WARNING: Really bad performance
  getLayer: function(id) {
    var result = null;

    id = parseInt(id, 10);

    this.eachLayer(function(l) {
      if (Util.stamp(l) === id) {
        result = l;
      }
    });

    return result;
  },

  //Returns true if the given layer is in this MarkerClusterGroup
  hasLayer: function(layer) {
    if (!layer) {
      return false;
    }

    var i,
      anArray = this._needsClustering;

    for (i = anArray.length - 1; i >= 0; i--) {
      if (anArray[i] === layer) {
        return true;
      }
    }

    anArray = this._needsRemoving;
    for (i = anArray.length - 1; i >= 0; i--) {
      if (anArray[i].layer === layer) {
        return false;
      }
    }

    return (
      !!(layer.__parent && layer.__parent._group === this) ||
      this._nonPointGroup.hasLayer(layer)
    );
  },

  //Zoom down to show the given layer (spiderfying if necessary) then calls the callback
  zoomToShowLayer: function(layer, callback) {
    var map = this._map;

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    var showMarker = function() {
      // Assumes that map.hasLayer checks for direct appearance on map, not recursively calling
      // hasLayer on Layer Groups that are on map (typically not calling this MarkerClusterGroup.hasLayer, which would always return true)
      if (
        (map.hasLayer(layer) || map.hasLayer(layer.__parent)) &&
        !this._inZoomAnimation
      ) {
        this._map.off('moveend', showMarker, this);
        this.off('animationend', showMarker, this);

        if (map.hasLayer(layer)) {
          callback();
        } else if (layer.__parent._icon) {
          this.once('spiderfied', callback, this);
          layer.__parent.spiderfy();
        }
      }
    };

    if (layer._icon && this._map.getBounds().contains(layer.getLatLng())) {
      //Layer is visible ond on screen, immediate return
      callback();
    } else if (layer.__parent._zoom < Math.round(this._map._zoom)) {
      //Layer should be visible at this zoom level. It must not be on screen so just pan over to it
      this._map.on('moveend', showMarker, this);
      this._map.panTo(layer.getLatLng());
    } else {
      this._map.on('moveend', showMarker, this);
      this.on('animationend', showMarker, this);
      layer.__parent.zoomToBounds();
    }
  },

  //Overrides FeatureGroup.onAdd
  onAdd: function(map) {
    this._map = map;
    var i, l, layer;

    if (!isFinite(this._map.getMaxZoom())) {
      throw 'Map has no maxZoom specified';
    }

    this._featureGroup.addTo(map);
    this._nonPointGroup.addTo(map);

    if (!this._gridClusters) {
      this._generateInitialClusters();
    }

    this._maxLat = map.options.crs.projection.MAX_LATITUDE;

    //Restore all the positions as they are in the MCG before removing them
    for (i = 0, l = this._needsRemoving.length; i < l; i++) {
      layer = this._needsRemoving[i];
      layer.newlatlng = layer.layer._latlng;
      layer.layer._latlng = layer.latlng;
    }
    //Remove them, then restore their new positions
    for (i = 0, l = this._needsRemoving.length; i < l; i++) {
      layer = this._needsRemoving[i];
      this._removeLayer(layer.layer, true);
      layer.layer._latlng = layer.newlatlng;
    }
    this._needsRemoving = [];

    //Remember the current zoom level and bounds
    this._zoom = Math.round(this._map._zoom);
    this._currentShownBounds = this._getExpandedVisibleBounds();

    this._map.on('zoomend', this._zoomEnd, this);
    this._map.on('moveend', this._moveEnd, this);

    if (this._spiderfierOnAdd) {
      //TODO FIXME: Not sure how to have spiderfier add something on here nicely
      this._spiderfierOnAdd();
    }

    this._bindEvents();

    //Actually add our markers to the map:
    l = this._needsClustering;
    this._needsClustering = [];
    this.addLayers(l, true);
  },

  //Overrides FeatureGroup.onRemove
  onRemove: function(map) {
    map.off('zoomend', this._zoomEnd, this);
    map.off('moveend', this._moveEnd, this);

    this._unbindEvents();

    //In case we are in a cluster animation
    this._map._mapPane.className = this._map._mapPane.className.replace(
      ' leaflet-cluster-anim',
      ''
    );

    if (this._spiderfierOnRemove) {
      //TODO FIXME: Not sure how to have spiderfier add something on here nicely
      this._spiderfierOnRemove();
    }

    delete this._maxLat;

    //Clean up all the layers we added to the map
    this._hideCoverage();
    this._featureGroup.remove();
    this._nonPointGroup.remove();

    this._featureGroup.clearLayers();

    this._map = null;
  },

  getVisibleParent: function(marker) {
    var vMarker = marker;
    while (vMarker && !vMarker._icon) {
      vMarker = vMarker.__parent;
    }
    return vMarker || null;
  },

  //Remove the given object from the given array
  _arraySplice: function(anArray, obj) {
    for (var i = anArray.length - 1; i >= 0; i--) {
      if (anArray[i] === obj) {
        anArray.splice(i, 1);
        return true;
      }
    }
  },

  /**
   * Removes a marker from all _gridUnclustered zoom levels, starting at the supplied zoom.
   * @param marker to be removed from _gridUnclustered.
   * @param z integer bottom start zoom level (included)
   * @private
   */
  _removeFromGridUnclustered: function(marker, z) {
    var map = this._map,
      gridUnclustered = this._gridUnclustered,
      minZoom = Math.floor(this._map.getMinZoom());

    for (; z >= minZoom; z--) {
      if (
        !gridUnclustered[z].removeObject(
          marker,
          map.project(marker.getLatLng(), z)
        )
      ) {
        break;
      }
    }
  },

  _childMarkerDragStart: function(e) {
    e.target.__dragStart = e.target._latlng;
  },

  _childMarkerMoved: function(e) {
    if (!this._ignoreMove && !e.target.__dragStart) {
      var isPopupOpen = e.target._popup && e.target._popup.isOpen();

      this._moveChild(e.target, e.oldLatLng, e.latlng);

      if (isPopupOpen) {
        e.target.openPopup();
      }
    }
  },

  _moveChild: function(layer, from, to) {
    layer._latlng = from;
    this.removeLayer(layer);

    layer._latlng = to;
    this.addLayer(layer);
  },

  _childMarkerDragEnd: function(e) {
    var dragStart = e.target.__dragStart;
    delete e.target.__dragStart;
    if (dragStart) {
      this._moveChild(e.target, dragStart, e.target._latlng);
    }
  },

  //Internal function for removing a marker from everything.
  //dontUpdateMap: set to true if you will handle updating the map manually (for bulk functions)
  _removeLayer: function(marker, removeFromDistanceGrid, dontUpdateMap) {
    var gridClusters = this._gridClusters,
      gridUnclustered = this._gridUnclustered,
      fg = this._featureGroup,
      map = this._map,
      minZoom = Math.floor(this._map.getMinZoom());

    //Remove the marker from distance clusters it might be in
    if (removeFromDistanceGrid) {
      this._removeFromGridUnclustered(marker, this._maxZoom);
    }

    //Work our way up the clusters removing them as we go if required
    var cluster = marker.__parent,
      markers = cluster._markers,
      otherMarker;

    //Remove the marker from the immediate parents marker list
    this._arraySplice(markers, marker);

    while (cluster) {
      cluster._childCount--;
      cluster._boundsNeedUpdate = true;

      if (cluster._zoom < minZoom) {
        //Top level, do nothing
        break;
      } else if (removeFromDistanceGrid && cluster._childCount <= 1) {
        //Cluster no longer required
        //We need to push the other marker up to the parent
        otherMarker =
          cluster._markers[0] === marker
            ? cluster._markers[1]
            : cluster._markers[0];

        //Update distance grid
        gridClusters[cluster._zoom].removeObject(
          cluster,
          map.project(cluster._cLatLng, cluster._zoom)
        );
        gridUnclustered[cluster._zoom].addObject(
          otherMarker,
          map.project(otherMarker.getLatLng(), cluster._zoom)
        );

        //Move otherMarker up to parent
        this._arraySplice(cluster.__parent._childClusters, cluster);
        cluster.__parent._markers.push(otherMarker);
        otherMarker.__parent = cluster.__parent;

        if (cluster._icon) {
          //Cluster is currently on the map, need to put the marker on the map instead
          fg.removeLayer(cluster);
          if (!dontUpdateMap) {
            fg.addLayer(otherMarker);
          }
        }
      } else {
        cluster._iconNeedsUpdate = true;
      }

      cluster = cluster.__parent;
    }

    delete marker.__parent;
  },

  _isOrIsParent: function(el, oel) {
    while (oel) {
      if (el === oel) {
        return true;
      }
      oel = oel.parentNode;
    }
    return false;
  },

  //Override L.Evented.fire
  fire: function(type, data, propagate) {
    if (data && data.layer instanceof MarkerCluster) {
      //Prevent multiple clustermouseover/off events if the icon is made up of stacked divs (Doesn't work in ie <= 8, no relatedTarget)
      if (
        data.originalEvent &&
        this._isOrIsParent(data.layer._icon, data.originalEvent.relatedTarget)
      ) {
        return;
      }
      type = 'cluster' + type;
    }

    FeatureGroup.prototype.fire.call(this, type, data, propagate);
  },

  //Override L.Evented.listens
  listens: function(type, propagate) {
    return (
      FeatureGroup.prototype.listens.call(this, type, propagate) ||
      FeatureGroup.prototype.listens.call(this, 'cluster' + type, propagate)
    );
  },

  //Default functionality
  _defaultIconCreateFunction: function(cluster) {
    var childCount = cluster.getChildCount();

    var c = ' marker-cluster-';
    if (childCount < 10) {
      c += 'small';
    } else if (childCount < 100) {
      c += 'medium';
    } else {
      c += 'large';
    }

    return new DivIcon({
      html: '<div><span>' + childCount + '</span></div>',
      className: 'marker-cluster' + c,
      iconSize: new Point(40, 40)
    });
  },

  _bindEvents: function() {
    var map = this._map,
      spiderfyOnMaxZoom = this.options.spiderfyOnMaxZoom,
      showCoverageOnHover = this.options.showCoverageOnHover,
      zoomToBoundsOnClick = this.options.zoomToBoundsOnClick;

    //Zoom on cluster click or spiderfy if we are at the lowest level
    if (spiderfyOnMaxZoom || zoomToBoundsOnClick) {
      this.on('clusterclick', this._zoomOrSpiderfy, this);
    }

    //Show convex hull (boundary) polygon on mouse over
    if (showCoverageOnHover) {
      this.on('clustermouseover', this._showCoverage, this);
      this.on('clustermouseout', this._hideCoverage, this);
      map.on('zoomend', this._hideCoverage, this);
    }
  },

  _zoomOrSpiderfy: function(e) {
    var cluster = e.layer,
      bottomCluster = cluster;

    while (bottomCluster._childClusters.length === 1) {
      bottomCluster = bottomCluster._childClusters[0];
    }

    if (
      bottomCluster._zoom === this._maxZoom &&
      bottomCluster._childCount === cluster._childCount &&
      this.options.spiderfyOnMaxZoom
    ) {
      // All child markers are contained in a single cluster from this._maxZoom to this cluster.
      cluster.spiderfy();
    } else if (this.options.zoomToBoundsOnClick) {
      cluster.zoomToBounds();
    }

    // Focus the map again for keyboard users.
    if (e.originalEvent && e.originalEvent.keyCode === 13) {
      this._map._container.focus();
    }
  },

  _showCoverage: function(e) {
    var map = this._map;
    if (this._inZoomAnimation) {
      return;
    }
    if (this._shownPolygon) {
      map.removeLayer(this._shownPolygon);
    }
    if (e.layer.getChildCount() > 2 && e.layer !== this._spiderfied) {
      this._shownPolygon = new Polygon(
        e.layer.getConvexHull(),
        this.options.polygonOptions
      );
      map.addLayer(this._shownPolygon);
    }
  },

  _hideCoverage: function() {
    if (this._shownPolygon) {
      this._map.removeLayer(this._shownPolygon);
      this._shownPolygon = null;
    }
  },

  _unbindEvents: function() {
    var spiderfyOnMaxZoom = this.options.spiderfyOnMaxZoom,
      showCoverageOnHover = this.options.showCoverageOnHover,
      zoomToBoundsOnClick = this.options.zoomToBoundsOnClick,
      map = this._map;

    if (spiderfyOnMaxZoom || zoomToBoundsOnClick) {
      this.off('clusterclick', this._zoomOrSpiderfy, this);
    }
    if (showCoverageOnHover) {
      this.off('clustermouseover', this._showCoverage, this);
      this.off('clustermouseout', this._hideCoverage, this);
      map.off('zoomend', this._hideCoverage, this);
    }
  },

  _zoomEnd: function() {
    if (!this._map) {
      //May have been removed from the map by a zoomEnd handler
      return;
    }
    this._mergeSplitClusters();

    this._zoom = Math.round(this._map._zoom);
    this._currentShownBounds = this._getExpandedVisibleBounds();
  },

  _moveEnd: function() {
    if (this._inZoomAnimation) {
      return;
    }

    var newBounds = this._getExpandedVisibleBounds();

    this._topClusterLevel._recursivelyRemoveChildrenFromMap(
      this._currentShownBounds,
      Math.floor(this._map.getMinZoom()),
      this._zoom,
      newBounds
    );
    this._topClusterLevel._recursivelyAddChildrenToMap(
      null,
      Math.round(this._map._zoom),
      newBounds
    );

    this._currentShownBounds = newBounds;
    return;
  },

  _generateInitialClusters: function() {
    var maxZoom = Math.ceil(this._map.getMaxZoom()),
      minZoom = Math.floor(this._map.getMinZoom()),
      radius = this.options.maxClusterRadius,
      radiusFn = radius;

    //If we just set maxClusterRadius to a single number, we need to create
    //a simple function to return that number. Otherwise, we just have to
    //use the function we've passed in.
    if (typeof radius !== 'function') {
      radiusFn = function() {
        return radius;
      };
    }

    if (this.options.disableClusteringAtZoom !== null) {
      maxZoom = this.options.disableClusteringAtZoom - 1;
    }
    this._maxZoom = maxZoom;
    this._gridClusters = {};
    this._gridUnclustered = {};

    //Set up DistanceGrids for each zoom
    for (var zoom = maxZoom; zoom >= minZoom; zoom--) {
      this._gridClusters[zoom] = new DistanceGrid(radiusFn(zoom));
      this._gridUnclustered[zoom] = new DistanceGrid(radiusFn(zoom));
    }

    // Instantiate the appropriate L.MarkerCluster class (animated or not).
    this._topClusterLevel = new this._markerCluster(this, minZoom - 1);
  },

  //Zoom: Zoom to start adding at (Pass this._maxZoom to start at the bottom)
  _addLayer: function(layer, zoom) {
    var gridClusters = this._gridClusters,
      gridUnclustered = this._gridUnclustered,
      minZoom = Math.floor(this._map.getMinZoom()),
      markerPoint,
      z;

    if (this.options.singleMarkerMode) {
      this._overrideMarkerIcon(layer);
    }

    layer.on(this._childMarkerEventHandlers, this);

    //Find the lowest zoom level to slot this one in
    for (; zoom >= minZoom; zoom--) {
      markerPoint = this._map.project(layer.getLatLng(), zoom); // calculate pixel position

      //Try find a cluster close by
      var closest = gridClusters[zoom].getNearObject(markerPoint);
      if (closest) {
        closest._addChild(layer);
        layer.__parent = closest;
        return;
      }

      //Try find a marker close by to form a new cluster with
      closest = gridUnclustered[zoom].getNearObject(markerPoint);
      if (closest) {
        var parent = closest.__parent;
        if (parent) {
          this._removeLayer(closest, false);
        }

        //Create new cluster with these 2 in it

        var newCluster = new this._markerCluster(this, zoom, closest, layer);
        gridClusters[zoom].addObject(
          newCluster,
          this._map.project(newCluster._cLatLng, zoom)
        );
        closest.__parent = newCluster;
        layer.__parent = newCluster;

        //First create any new intermediate parent clusters that don't exist
        var lastParent = newCluster;
        for (z = zoom - 1; z > parent._zoom; z--) {
          lastParent = new this._markerCluster(this, z, lastParent);
          gridClusters[z].addObject(
            lastParent,
            this._map.project(closest.getLatLng(), z)
          );
        }
        parent._addChild(lastParent);

        //Remove closest from this zoom level and any above that it is in, replace with newCluster
        this._removeFromGridUnclustered(closest, zoom);

        return;
      }

      //Didn't manage to cluster in at this zoom, record us as a marker here and continue upwards
      gridUnclustered[zoom].addObject(layer, markerPoint);
    }

    //Didn't get in anything, add us to the top
    this._topClusterLevel._addChild(layer);
    layer.__parent = this._topClusterLevel;
    return;
  },

  /**
   * Refreshes the icon of all "dirty" visible clusters.
   * Non-visible "dirty" clusters will be updated when they are added to the map.
   * @private
   */
  _refreshClustersIcons: function() {
    this._featureGroup.eachLayer(function(c) {
      if (c instanceof MarkerCluster && c._iconNeedsUpdate) {
        c._updateIcon();
      }
    });
  },

  //Enqueue code to fire after the marker expand/contract has happened
  _enqueue: function(fn) {
    this._queue.push(fn);
    if (!this._queueTimeout) {
      this._queueTimeout = setTimeout(Util.bind(this._processQueue, this), 300);
    }
  },
  _processQueue: function() {
    for (var i = 0; i < this._queue.length; i++) {
      this._queue[i].call(this);
    }
    this._queue.length = 0;
    clearTimeout(this._queueTimeout);
    this._queueTimeout = null;
  },

  //Merge and split any existing clusters that are too big or small
  _mergeSplitClusters: function() {
    var mapZoom = Math.round(this._map._zoom);

    //In case we are starting to split before the animation finished
    this._processQueue();

    if (
      this._zoom < mapZoom &&
      this._currentShownBounds.intersects(this._getExpandedVisibleBounds())
    ) {
      //Zoom in, split
      this._animationStart();
      //Remove clusters now off screen
      this._topClusterLevel._recursivelyRemoveChildrenFromMap(
        this._currentShownBounds,
        Math.floor(this._map.getMinZoom()),
        this._zoom,
        this._getExpandedVisibleBounds()
      );

      this._animationZoomIn(this._zoom, mapZoom);
    } else if (this._zoom > mapZoom) {
      //Zoom out, merge
      this._animationStart();

      this._animationZoomOut(this._zoom, mapZoom);
    } else {
      this._moveEnd();
    }
  },

  //Gets the maps visible bounds expanded in each direction by the size of the screen (so the user cannot see an area we do not cover in one pan)
  _getExpandedVisibleBounds: function() {
    if (!this.options.removeOutsideVisibleBounds) {
      return this._mapBoundsInfinite;
    } else if (Browser.mobile) {
      return this._checkBoundsMaxLat(this._map.getBounds());
    }

    return this._checkBoundsMaxLat(this._map.getBounds().pad(1)); // Padding expands the bounds by its own dimensions but scaled with the given factor.
  },

  /**
   * Expands the latitude to Infinity (or -Infinity) if the input bounds reach the map projection maximum defined latitude
   * (in the case of Web/Spherical Mercator, it is 85.0511287798 / see https://en.wikipedia.org/wiki/Web_Mercator#Formulas).
   * Otherwise, the removeOutsideVisibleBounds option will remove markers beyond that limit, whereas the same markers without
   * this option (or outside MCG) will have their position floored (ceiled) by the projection and rendered at that limit,
   * making the user think that MCG "eats" them and never displays them again.
   * @param bounds L.LatLngBounds
   * @returns {L.LatLngBounds}
   * @private
   */
  _checkBoundsMaxLat: function(bounds) {
    var maxLat = this._maxLat;

    if (maxLat !== undefined) {
      if (bounds.getNorth() >= maxLat) {
        bounds._northEast.lat = Infinity;
      }
      if (bounds.getSouth() <= -maxLat) {
        bounds._southWest.lat = -Infinity;
      }
    }

    return bounds;
  },

  //Shared animation code
  _animationAddLayerNonAnimated: function(layer, newCluster) {
    if (newCluster === layer) {
      this._featureGroup.addLayer(layer);
    } else if (newCluster._childCount === 2) {
      newCluster._addToMap();

      var markers = newCluster.getAllChildMarkers();
      this._featureGroup.removeLayer(markers[0]);
      this._featureGroup.removeLayer(markers[1]);
    } else {
      newCluster._updateIcon();
    }
  },

  /**
   * Extracts individual (i.e. non-group) layers from a Layer Group.
   * @param group to extract layers from.
   * @param output {Array} in which to store the extracted layers.
   * @returns {*|Array}
   * @private
   */
  _extractNonGroupLayers: function(group, output) {
    var layers = group.getLayers(),
      i = 0,
      layer;

    output = output || [];

    for (; i < layers.length; i++) {
      layer = layers[i];

      if (layer instanceof LayerGroup) {
        this._extractNonGroupLayers(layer, output);
        continue;
      }

      output.push(layer);
    }

    return output;
  },

  /**
   * Implements the singleMarkerMode option.
   * @param layer Marker to re-style using the Clusters iconCreateFunction.
   * @returns {L.Icon} The newly created icon.
   * @private
   */
  _overrideMarkerIcon: function(layer) {
    var icon = (layer.options.icon = this.options.iconCreateFunction({
      getChildCount: function() {
        return 1;
      },
      getAllChildMarkers: function() {
        return [layer];
      }
    }));

    return icon;
  }
});

// Constant bounds used in case option "removeOutsideVisibleBounds" is set to false.
MarkerClusterGroup.include({
  _mapBoundsInfinite: new LatLngBounds(
    new LatLng(-Infinity, -Infinity),
    new LatLng(Infinity, Infinity)
  )
});

MarkerClusterGroup.include({
  _noAnimation: {
    //Non Animated versions of everything
    _animationStart: function() {
      //Do nothing...
    },
    _animationZoomIn: function(previousZoomLevel, newZoomLevel) {
      this._topClusterLevel._recursivelyRemoveChildrenFromMap(
        this._currentShownBounds,
        Math.floor(this._map.getMinZoom()),
        previousZoomLevel
      );
      this._topClusterLevel._recursivelyAddChildrenToMap(
        null,
        newZoomLevel,
        this._getExpandedVisibleBounds()
      );

      //We didn't actually animate, but we use this event to mean "clustering animations have finished"
      this.fire('animationend');
    },
    _animationZoomOut: function(previousZoomLevel, newZoomLevel) {
      this._topClusterLevel._recursivelyRemoveChildrenFromMap(
        this._currentShownBounds,
        Math.floor(this._map.getMinZoom()),
        previousZoomLevel
      );
      this._topClusterLevel._recursivelyAddChildrenToMap(
        null,
        newZoomLevel,
        this._getExpandedVisibleBounds()
      );

      //We didn't actually animate, but we use this event to mean "clustering animations have finished"
      this.fire('animationend');
    },
    _animationAddLayer: function(layer, newCluster) {
      this._animationAddLayerNonAnimated(layer, newCluster);
    }
  },

  _withAnimation: {
    //Animated versions here
    _animationStart: function() {
      this._map._mapPane.className += ' leaflet-cluster-anim';
      this._inZoomAnimation++;
    },

    _animationZoomIn: function(previousZoomLevel, newZoomLevel) {
      var bounds = this._getExpandedVisibleBounds(),
        fg = this._featureGroup,
        minZoom = Math.floor(this._map.getMinZoom()),
        i;

      this._ignoreMove = true;

      //Add all children of current clusters to map and remove those clusters from map
      this._topClusterLevel._recursively(
        bounds,
        previousZoomLevel,
        minZoom,
        function(c) {
          var startPos = c._latlng,
            markers = c._markers,
            m;

          if (!bounds.contains(startPos)) {
            startPos = null;
          }

          if (c._isSingleParent() && previousZoomLevel + 1 === newZoomLevel) {
            //Immediately add the new child and remove us
            fg.removeLayer(c);
            c._recursivelyAddChildrenToMap(null, newZoomLevel, bounds);
          } else {
            //Fade out old cluster
            c.clusterHide();
            c._recursivelyAddChildrenToMap(startPos, newZoomLevel, bounds);
          }

          //Remove all markers that aren't visible any more
          //TODO: Do we actually need to do this on the higher levels too?
          for (i = markers.length - 1; i >= 0; i--) {
            m = markers[i];
            if (!bounds.contains(m._latlng)) {
              fg.removeLayer(m);
            }
          }
        }
      );

      this._forceLayout();

      //Update opacities
      this._topClusterLevel._recursivelyBecomeVisible(bounds, newZoomLevel);
      //TODO Maybe? Update markers in _recursivelyBecomeVisible
      fg.eachLayer(function(n) {
        if (!(n instanceof MarkerCluster) && n._icon) {
          n.clusterShow();
        }
      });

      //update the positions of the just added clusters/markers
      this._topClusterLevel._recursively(
        bounds,
        previousZoomLevel,
        newZoomLevel,
        function(c) {
          c._recursivelyRestoreChildPositions(newZoomLevel);
        }
      );

      this._ignoreMove = false;

      //Remove the old clusters and close the zoom animation
      this._enqueue(function() {
        //update the positions of the just added clusters/markers
        this._topClusterLevel._recursively(
          bounds,
          previousZoomLevel,
          minZoom,
          function(c) {
            fg.removeLayer(c);
            c.clusterShow();
          }
        );

        this._animationEnd();
      });
    },

    _animationZoomOut: function(previousZoomLevel, newZoomLevel) {
      this._animationZoomOutSingle(
        this._topClusterLevel,
        previousZoomLevel - 1,
        newZoomLevel
      );

      //Need to add markers for those that weren't on the map before but are now
      this._topClusterLevel._recursivelyAddChildrenToMap(
        null,
        newZoomLevel,
        this._getExpandedVisibleBounds()
      );
      //Remove markers that were on the map before but won't be now
      this._topClusterLevel._recursivelyRemoveChildrenFromMap(
        this._currentShownBounds,
        Math.floor(this._map.getMinZoom()),
        previousZoomLevel,
        this._getExpandedVisibleBounds()
      );
    },

    _animationAddLayer: function(layer, newCluster) {
      var me = this,
        fg = this._featureGroup;

      fg.addLayer(layer);
      if (newCluster !== layer) {
        if (newCluster._childCount > 2) {
          //Was already a cluster

          newCluster._updateIcon();
          this._forceLayout();
          this._animationStart();

          layer._setPos(this._map.latLngToLayerPoint(newCluster.getLatLng()));
          layer.clusterHide();

          this._enqueue(function() {
            fg.removeLayer(layer);
            layer.clusterShow();

            me._animationEnd();
          });
        } else {
          //Just became a cluster
          this._forceLayout();

          me._animationStart();
          me._animationZoomOutSingle(
            newCluster,
            this._map.getMaxZoom(),
            this._zoom
          );
        }
      }
    }
  },

  // Private methods for animated versions.
  _animationZoomOutSingle: function(cluster, previousZoomLevel, newZoomLevel) {
    var bounds = this._getExpandedVisibleBounds(),
      minZoom = Math.floor(this._map.getMinZoom());

    //Animate all of the markers in the clusters to move to their cluster center point
    cluster._recursivelyAnimateChildrenInAndAddSelfToMap(
      bounds,
      minZoom,
      previousZoomLevel + 1,
      newZoomLevel
    );

    var me = this;

    //Update the opacity (If we immediately set it they won't animate)
    this._forceLayout();
    cluster._recursivelyBecomeVisible(bounds, newZoomLevel);

    //TODO: Maybe use the transition timing stuff to make this more reliable
    //When the animations are done, tidy up
    this._enqueue(function() {
      //This cluster stopped being a cluster before the timeout fired
      if (cluster._childCount === 1) {
        var m = cluster._markers[0];
        //If we were in a cluster animation at the time then the opacity and position of our child could be wrong now, so fix it
        this._ignoreMove = true;
        m.setLatLng(m.getLatLng());
        this._ignoreMove = false;
        if (m.clusterShow) {
          m.clusterShow();
        }
      } else {
        cluster._recursively(bounds, newZoomLevel, minZoom, function(c) {
          c._recursivelyRemoveChildrenFromMap(
            bounds,
            minZoom,
            previousZoomLevel + 1
          );
        });
      }
      me._animationEnd();
    });
  },

  _animationEnd: function() {
    if (this._map) {
      this._map._mapPane.className = this._map._mapPane.className.replace(
        ' leaflet-cluster-anim',
        ''
      );
    }
    this._inZoomAnimation--;
    this.fire('animationend');
  },

  //Force a browser layout of stuff in the map
  // Should apply the current opacity and location to all elements so we can update them again for an animation
  _forceLayout: function() {
    //In my testing this works, infact offsetWidth of any element seems to work.
    //Could loop all this._layers and do this for each _icon if it stops working

    Util.falseFn(document.body.offsetWidth);
  }
});

```
## marker-cluster.js
``` js
import { Marker, Icon, LatLng, LatLngBounds } from 'leaflet';
import { QuickHull } from './quickhull.js';
Marker.include({
  clusterHide: function() {
    var backup = this.options.opacity;
    this.setOpacity(0);
    this.options.opacity = backup;
    return this;
  },

  clusterShow: function() {
    return this.setOpacity(this.options.opacity);
  }
});

export var MarkerCluster = Marker.extend({
  options: Icon.prototype.options,

  initialize: function(group, zoom, a, b) {
    Marker.prototype.initialize.call(
      this,
      a ? a._cLatLng || a.getLatLng() : new LatLng(0, 0),
      { icon: this, pane: group.options.clusterPane }
    );

    this._group = group;
    this._zoom = zoom;

    this._markers = [];
    this._childClusters = [];
    this._childCount = 0;
    this._iconNeedsUpdate = true;
    this._boundsNeedUpdate = true;

    this._bounds = new LatLngBounds();

    if (a) {
      this._addChild(a);
    }
    if (b) {
      this._addChild(b);
    }
  },

  //Recursively retrieve all child markers of this cluster
  getAllChildMarkers: function(storageArray, ignoreDraggedMarker) {
    storageArray = storageArray || [];

    for (var i = this._childClusters.length - 1; i >= 0; i--) {
      this._childClusters[i].getAllChildMarkers(storageArray);
    }

    for (var j = this._markers.length - 1; j >= 0; j--) {
      if (ignoreDraggedMarker && this._markers[j].__dragStart) {
        continue;
      }
      storageArray.push(this._markers[j]);
    }

    return storageArray;
  },

  //Returns the count of how many child markers we have
  getChildCount: function() {
    return this._childCount;
  },

  //Zoom to the minimum of showing all of the child markers, or the extents of this cluster
  zoomToBounds: function(fitBoundsOptions) {
    var childClusters = this._childClusters.slice(),
      map = this._group._map,
      boundsZoom = map.getBoundsZoom(this._bounds),
      zoom = this._zoom + 1,
      mapZoom = map.getZoom(),
      i;

    //calculate how far we need to zoom down to see all of the markers
    while (childClusters.length > 0 && boundsZoom > zoom) {
      zoom++;
      var newClusters = [];
      for (i = 0; i < childClusters.length; i++) {
        newClusters = newClusters.concat(childClusters[i]._childClusters);
      }
      childClusters = newClusters;
    }

    if (boundsZoom > zoom) {
      this._group._map.setView(this._latlng, zoom);
    } else if (boundsZoom <= mapZoom) {
      //If fitBounds wouldn't zoom us down, zoom us down instead
      this._group._map.setView(this._latlng, mapZoom + 1);
    } else {
      this._group._map.fitBounds(this._bounds, fitBoundsOptions);
    }
  },

  getBounds: function() {
    var bounds = new LatLngBounds();
    bounds.extend(this._bounds);
    return bounds;
  },

  _updateIcon: function() {
    this._iconNeedsUpdate = true;
    if (this._icon) {
      this.setIcon(this);
    }
  },

  //Cludge for Icon, we pretend to be an icon for performance
  createIcon: function() {
    if (this._iconNeedsUpdate) {
      this._iconObj = this._group.options.iconCreateFunction(this);
      this._iconNeedsUpdate = false;
    }
    return this._iconObj.createIcon();
  },
  createShadow: function() {
    return this._iconObj.createShadow();
  },

  _addChild: function(new1, isNotificationFromChild) {
    this._iconNeedsUpdate = true;

    this._boundsNeedUpdate = true;
    this._setClusterCenter(new1);

    if (new1 instanceof MarkerCluster) {
      if (!isNotificationFromChild) {
        this._childClusters.push(new1);
        new1.__parent = this;
      }
      this._childCount += new1._childCount;
    } else {
      if (!isNotificationFromChild) {
        this._markers.push(new1);
      }
      this._childCount++;
    }

    if (this.__parent) {
      this.__parent._addChild(new1, true);
    }
  },

  /**
   * Makes sure the cluster center is set. If not, uses the child center if it is a cluster, or the marker position.
   * @param child L.MarkerCluster|L.Marker that will be used as cluster center if not defined yet.
   * @private
   */
  _setClusterCenter: function(child) {
    if (!this._cLatLng) {
      // when clustering, take position of the first point as the cluster center
      this._cLatLng = child._cLatLng || child._latlng;
    }
  },

  /**
   * Assigns impossible bounding values so that the next extend entirely determines the new bounds.
   * This method avoids having to trash the previous L.LatLngBounds object and to create a new one, which is much slower for this class.
   * As long as the bounds are not extended, most other methods would probably fail, as they would with bounds initialized but not extended.
   * @private
   */
  _resetBounds: function() {
    var bounds = this._bounds;

    if (bounds._southWest) {
      bounds._southWest.lat = Infinity;
      bounds._southWest.lng = Infinity;
    }
    if (bounds._northEast) {
      bounds._northEast.lat = -Infinity;
      bounds._northEast.lng = -Infinity;
    }
  },

  _recalculateBounds: function() {
    var markers = this._markers,
      childClusters = this._childClusters,
      latSum = 0,
      lngSum = 0,
      totalCount = this._childCount,
      i,
      child,
      childLatLng,
      childCount;

    // Case where all markers are removed from the map and we are left with just an empty _topClusterLevel.
    if (totalCount === 0) {
      return;
    }

    // Reset rather than creating a new object, for performance.
    this._resetBounds();

    // Child markers.
    for (i = 0; i < markers.length; i++) {
      childLatLng = markers[i]._latlng;

      this._bounds.extend(childLatLng);

      latSum += childLatLng.lat;
      lngSum += childLatLng.lng;
    }

    // Child clusters.
    for (i = 0; i < childClusters.length; i++) {
      child = childClusters[i];

      // Re-compute child bounds and weighted position first if necessary.
      if (child._boundsNeedUpdate) {
        child._recalculateBounds();
      }

      this._bounds.extend(child._bounds);

      childLatLng = child._wLatLng;
      childCount = child._childCount;

      latSum += childLatLng.lat * childCount;
      lngSum += childLatLng.lng * childCount;
    }

    this._latlng = this._wLatLng = new LatLng(
      latSum / totalCount,
      lngSum / totalCount
    );

    // Reset dirty flag.
    this._boundsNeedUpdate = false;
  },

  //Set our markers position as given and add it to the map
  _addToMap: function(startPos) {
    if (startPos) {
      this._backupLatlng = this._latlng;
      this.setLatLng(startPos);
    }
    this._group._featureGroup.addLayer(this);
  },

  _recursivelyAnimateChildrenIn: function(bounds, center, maxZoom) {
    this._recursively(
      bounds,
      this._group._map.getMinZoom(),
      maxZoom - 1,
      function(c) {
        var markers = c._markers,
          i,
          m;
        for (i = markers.length - 1; i >= 0; i--) {
          m = markers[i];

          //Only do it if the icon is still on the map
          if (m._icon) {
            m._setPos(center);
            m.clusterHide();
          }
        }
      },
      function(c) {
        var childClusters = c._childClusters,
          j,
          cm;
        for (j = childClusters.length - 1; j >= 0; j--) {
          cm = childClusters[j];
          if (cm._icon) {
            cm._setPos(center);
            cm.clusterHide();
          }
        }
      }
    );
  },

  _recursivelyAnimateChildrenInAndAddSelfToMap: function(
    bounds,
    mapMinZoom,
    previousZoomLevel,
    newZoomLevel
  ) {
    this._recursively(bounds, newZoomLevel, mapMinZoom, function(c) {
      c._recursivelyAnimateChildrenIn(
        bounds,
        c._group._map.latLngToLayerPoint(c.getLatLng()).round(),
        previousZoomLevel
      );

      //TODO: depthToAnimateIn affects _isSingleParent, if there is a multizoom we may/may not be.
      //As a hack we only do a animation free zoom on a single level zoom, if someone does multiple levels then we always animate
      if (c._isSingleParent() && previousZoomLevel - 1 === newZoomLevel) {
        c.clusterShow();
        c._recursivelyRemoveChildrenFromMap(
          bounds,
          mapMinZoom,
          previousZoomLevel
        ); //Immediately remove our children as we are replacing them. TODO previousBounds not bounds
      } else {
        c.clusterHide();
      }

      c._addToMap();
    });
  },

  _recursivelyBecomeVisible: function(bounds, zoomLevel) {
    this._recursively(
      bounds,
      this._group._map.getMinZoom(),
      zoomLevel,
      null,
      function(c) {
        c.clusterShow();
      }
    );
  },

  _recursivelyAddChildrenToMap: function(startPos, zoomLevel, bounds) {
    this._recursively(
      bounds,
      this._group._map.getMinZoom() - 1,
      zoomLevel,
      function(c) {
        if (zoomLevel === c._zoom) {
          return;
        }

        //Add our child markers at startPos (so they can be animated out)
        for (var i = c._markers.length - 1; i >= 0; i--) {
          var nm = c._markers[i];

          if (!bounds.contains(nm._latlng)) {
            continue;
          }

          if (startPos) {
            nm._backupLatlng = nm.getLatLng();

            nm.setLatLng(startPos);
            if (nm.clusterHide) {
              nm.clusterHide();
            }
          }

          c._group._featureGroup.addLayer(nm);
        }
      },
      function(c) {
        c._addToMap(startPos);
      }
    );
  },

  _recursivelyRestoreChildPositions: function(zoomLevel) {
    //Fix positions of child markers
    for (var i = this._markers.length - 1; i >= 0; i--) {
      var nm = this._markers[i];
      if (nm._backupLatlng) {
        nm.setLatLng(nm._backupLatlng);
        delete nm._backupLatlng;
      }
    }

    if (zoomLevel - 1 === this._zoom) {
      //Reposition child clusters
      for (var j = this._childClusters.length - 1; j >= 0; j--) {
        this._childClusters[j]._restorePosition();
      }
    } else {
      for (var k = this._childClusters.length - 1; k >= 0; k--) {
        this._childClusters[k]._recursivelyRestoreChildPositions(zoomLevel);
      }
    }
  },

  _restorePosition: function() {
    if (this._backupLatlng) {
      this.setLatLng(this._backupLatlng);
      delete this._backupLatlng;
    }
  },

  //exceptBounds: If set, don't remove any markers/clusters in it
  _recursivelyRemoveChildrenFromMap: function(
    previousBounds,
    mapMinZoom,
    zoomLevel,
    exceptBounds
  ) {
    var m, i;
    this._recursively(
      previousBounds,
      mapMinZoom - 1,
      zoomLevel - 1,
      function(c) {
        //Remove markers at every level
        for (i = c._markers.length - 1; i >= 0; i--) {
          m = c._markers[i];
          if (!exceptBounds || !exceptBounds.contains(m._latlng)) {
            c._group._featureGroup.removeLayer(m);
            if (m.clusterShow) {
              m.clusterShow();
            }
          }
        }
      },
      function(c) {
        //Remove child clusters at just the bottom level
        for (i = c._childClusters.length - 1; i >= 0; i--) {
          m = c._childClusters[i];
          if (!exceptBounds || !exceptBounds.contains(m._latlng)) {
            c._group._featureGroup.removeLayer(m);
            if (m.clusterShow) {
              m.clusterShow();
            }
          }
        }
      }
    );
  },

  //Run the given functions recursively to this and child clusters
  // boundsToApplyTo: a L.LatLngBounds representing the bounds of what clusters to recurse in to
  // zoomLevelToStart: zoom level to start running functions (inclusive)
  // zoomLevelToStop: zoom level to stop running functions (inclusive)
  // runAtEveryLevel: function that takes an L.MarkerCluster as an argument that should be applied on every level
  // runAtBottomLevel: function that takes an L.MarkerCluster as an argument that should be applied at only the bottom level
  _recursively: function(
    boundsToApplyTo,
    zoomLevelToStart,
    zoomLevelToStop,
    runAtEveryLevel,
    runAtBottomLevel
  ) {
    var childClusters = this._childClusters,
      zoom = this._zoom,
      i,
      c;

    if (zoomLevelToStart <= zoom) {
      if (runAtEveryLevel) {
        runAtEveryLevel(this);
      }
      if (runAtBottomLevel && zoom === zoomLevelToStop) {
        runAtBottomLevel(this);
      }
    }

    if (zoom < zoomLevelToStart || zoom < zoomLevelToStop) {
      for (i = childClusters.length - 1; i >= 0; i--) {
        c = childClusters[i];
        if (c._boundsNeedUpdate) {
          c._recalculateBounds();
        }
        if (boundsToApplyTo.intersects(c._bounds)) {
          c._recursively(
            boundsToApplyTo,
            zoomLevelToStart,
            zoomLevelToStop,
            runAtEveryLevel,
            runAtBottomLevel
          );
        }
      }
    }
  },

  //Returns true if we are the parent of only one cluster and that cluster is the same as us
  _isSingleParent: function() {
    //Don't need to check this._markers as the rest won't work if there are any
    return (
      this._childClusters.length > 0 &&
      this._childClusters[0]._childCount === this._childCount
    );
  }
});

MarkerCluster.include({
  getConvexHull: function() {
    var childMarkers = this.getAllChildMarkers(),
      points = [],
      p,
      i;

    for (i = childMarkers.length - 1; i >= 0; i--) {
      p = childMarkers[i].getLatLng();
      points.push(p);
    }

    return new QuickHull().getConvexHull(points);
  }
});

```
## distance-grid.js
``` js
export class DistanceGrid {
  constructor(cellSize) {
    this._cellSize = cellSize;
    this._sqCellSize = cellSize * cellSize;
    this._grid = {};
    this._objectPoint = {};
  }

  addObject(obj, point) {
    var x = this._getCoord(point.x),
      y = this._getCoord(point.y),
      grid = this._grid,
      row = (grid[y] = grid[y] || {}),
      cell = (row[x] = row[x] || []),
      stamp = L.Util.stamp(obj);

    this._objectPoint[stamp] = point;

    cell.push(obj);
  }

  updateObject(obj, point) {
    this.removeObject(obj);
    this.addObject(obj, point);
  }

  //Returns true if the object was found
  removeObject(obj, point) {
    var x = this._getCoord(point.x),
      y = this._getCoord(point.y),
      grid = this._grid,
      row = (grid[y] = grid[y] || {}),
      cell = (row[x] = row[x] || []),
      i,
      len;

    delete this._objectPoint[L.Util.stamp(obj)];

    for (i = 0, len = cell.length; i < len; i++) {
      if (cell[i] === obj) {
        cell.splice(i, 1);

        if (len === 1) {
          delete row[x];
        }

        return true;
      }
    }
  }

  eachObject(fn, context) {
    var i,
      j,
      k,
      len,
      row,
      cell,
      removed,
      grid = this._grid;

    for (i in grid) {
      row = grid[i];

      for (j in row) {
        cell = row[j];

        for (k = 0, len = cell.length; k < len; k++) {
          removed = fn.call(context, cell[k]);
          if (removed) {
            k--;
            len--;
          }
        }
      }
    }
  }

  getNearObject(point) {
    var x = this._getCoord(point.x),
      y = this._getCoord(point.y),
      i,
      j,
      k,
      row,
      cell,
      len,
      obj,
      dist,
      objectPoint = this._objectPoint,
      closestDistSq = this._sqCellSize,
      closest = null;

    for (i = y - 1; i <= y + 1; i++) {
      row = this._grid[i];
      if (row) {
        for (j = x - 1; j <= x + 1; j++) {
          cell = row[j];
          if (cell) {
            for (k = 0, len = cell.length; k < len; k++) {
              obj = cell[k];
              dist = this._sqDist(objectPoint[L.Util.stamp(obj)], point);
              if (
                dist < closestDistSq ||
                (dist <= closestDistSq && closest === null)
              ) {
                closestDistSq = dist;
                closest = obj;
              }
            }
          }
        }
      }
    }
    return closest;
  }

  _getCoord(x) {
    var coord = Math.floor(x / this._cellSize);
    return isFinite(coord) ? coord : x;
  }

  _sqDist(p, p2) {
    var dx = p2.x - p.x,
      dy = p2.y - p.y;
    return dx * dx + dy * dy;
  }
}

```
## quickhull.js
``` js
export class QuickHull {
  /*
   * @param {Object} cpt a point to be measured from the baseline
   * @param {Array} bl the baseline, as represented by a two-element
   *   array of latlng objects.
   * @returns {Number} an approximate distance measure
   */
  getDistant(cpt, bl) {
    var vY = bl[1].lat - bl[0].lat,
      vX = bl[0].lng - bl[1].lng;
    return vX * (cpt.lat - bl[0].lat) + vY * (cpt.lng - bl[0].lng);
  }

  /*
   * @param {Array} baseLine a two-element array of latlng objects
   *   representing the baseline to project from
   * @param {Array} latLngs an array of latlng objects
   * @returns {Object} the maximum point and all new points to stay
   *   in consideration for the hull.
   */
  findMostDistantPointFromBaseLine(baseLine, latLngs) {
    var maxD = 0,
      maxPt = null,
      newPoints = [],
      i,
      pt,
      d;

    for (i = latLngs.length - 1; i >= 0; i--) {
      pt = latLngs[i];
      d = this.getDistant(pt, baseLine);

      if (d > 0) {
        newPoints.push(pt);
      } else {
        continue;
      }

      if (d > maxD) {
        maxD = d;
        maxPt = pt;
      }
    }

    return { maxPoint: maxPt, newPoints: newPoints };
  }

  /*
   * Given a baseline, compute the convex hull of latLngs as an array
   * of latLngs.
   *
   * @param {Array} latLngs
   * @returns {Array}
   */
  buildConvexHull(baseLine, latLngs) {
    var convexHullBaseLines = [],
      t = this.findMostDistantPointFromBaseLine(baseLine, latLngs);

    if (t.maxPoint) {
      // if there is still a point "outside" the base line
      convexHullBaseLines = convexHullBaseLines.concat(
        this.buildConvexHull([baseLine[0], t.maxPoint], t.newPoints)
      );
      convexHullBaseLines = convexHullBaseLines.concat(
        this.buildConvexHull([t.maxPoint, baseLine[1]], t.newPoints)
      );
      return convexHullBaseLines;
    } else {
      // if there is no more point "outside" the base line, the current base line is part of the convex hull
      return [baseLine[0]];
    }
  }

  /*
   * Given an array of latlngs, compute a convex hull as an array
   * of latlngs
   *
   * @param {Array} latLngs
   * @returns {Array}
   */
  getConvexHull(latLngs) {
    // find first baseline
    var maxLat = false,
      minLat = false,
      maxLng = false,
      minLng = false,
      maxLatPt = null,
      minLatPt = null,
      maxLngPt = null,
      minLngPt = null,
      maxPt = null,
      minPt = null,
      i;

    for (i = latLngs.length - 1; i >= 0; i--) {
      var pt = latLngs[i];
      if (maxLat === false || pt.lat > maxLat) {
        maxLatPt = pt;
        maxLat = pt.lat;
      }
      if (minLat === false || pt.lat < minLat) {
        minLatPt = pt;
        minLat = pt.lat;
      }
      if (maxLng === false || pt.lng > maxLng) {
        maxLngPt = pt;
        maxLng = pt.lng;
      }
      if (minLng === false || pt.lng < minLng) {
        minLngPt = pt;
        minLng = pt.lng;
      }
    }

    if (minLat !== maxLat) {
      minPt = minLatPt;
      maxPt = maxLatPt;
    } else {
      minPt = minLngPt;
      maxPt = maxLngPt;
    }

    var ch = [].concat(
      this.buildConvexHull([minPt, maxPt], latLngs),
      this.buildConvexHull([maxPt, minPt], latLngs)
    );
    return ch;
  }
}

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

.marker-cluster-small {
  background-color: rgba(181, 226, 140, 0.6);
}
.marker-cluster-small div {
  background-color: rgba(110, 204, 57, 0.6);
}

.marker-cluster-medium {
  background-color: rgba(241, 211, 87, 0.6);
}
.marker-cluster-medium div {
  background-color: rgba(240, 194, 12, 0.6);
}

.marker-cluster-large {
  background-color: rgba(253, 156, 115, 0.6);
}
.marker-cluster-large div {
  background-color: rgba(241, 128, 23, 0.6);
}

/* IE 6-8 fallback colors */
.leaflet-oldie .marker-cluster-small {
  background-color: rgb(181, 226, 140);
}
.leaflet-oldie .marker-cluster-small div {
  background-color: rgb(110, 204, 57);
}

.leaflet-oldie .marker-cluster-medium {
  background-color: rgb(241, 211, 87);
}
.leaflet-oldie .marker-cluster-medium div {
  background-color: rgb(240, 194, 12);
}

.leaflet-oldie .marker-cluster-large {
  background-color: rgb(253, 156, 115);
}
.leaflet-oldie .marker-cluster-large div {
  background-color: rgb(241, 128, 23);
}

.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
}
.marker-cluster div {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-top: 5px;

  text-align: center;
  border-radius: 15px;
  font: 12px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
.marker-cluster span {
  line-height: 30px;
}

.leaflet-cluster-anim .leaflet-marker-icon,
.leaflet-cluster-anim .leaflet-marker-shadow {
  -webkit-transition: -webkit-transform 0.3s ease-out, opacity 0.3s ease-in;
  -moz-transition: -moz-transform 0.3s ease-out, opacity 0.3s ease-in;
  -o-transition: -o-transform 0.3s ease-out, opacity 0.3s ease-in;
  transition: transform 0.3s ease-out, opacity 0.3s ease-in;
}

.leaflet-cluster-spider-leg {
  /* stroke-dashoffset (duration and function) should match with leaflet-marker-icon transform in order to track it exactly */
  -webkit-transition: -webkit-stroke-dashoffset 0.3s ease-out,
    -webkit-stroke-opacity 0.3s ease-in;
  -moz-transition: -moz-stroke-dashoffset 0.3s ease-out,
    -moz-stroke-opacity 0.3s ease-in;
  -o-transition: -o-stroke-dashoffset 0.3s ease-out,
    -o-stroke-opacity 0.3s ease-in;
  transition: stroke-dashoffset 0.3s ease-out, stroke-opacity 0.3s ease-in;
}

```
