<script lang="ts">
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import TileWMS from 'ol/source/TileWMS';
	import { fromLonLat } from 'ol/proj';

	import 'ol/ol.css';
	import { mapStore } from '../../stores/map';
	import VectorLayer from 'ol/layer/Vector';
	import VectorSource from 'ol/source/Vector';
	import Style from 'ol/style/Style';
	import Icon from 'ol/style/Icon';
	import Stroke from 'ol/style/Stroke';
	import Fill from 'ol/style/Fill';

	//props
	export let center = [7, 51];
	export let zoom = 8;

	let mapId = 'map-id';
	let map: Map | null = null;

	const setupMap = (node: HTMLElement) => {
		const vectorLayer = new VectorLayer({
			source: new VectorSource(),
			style: new Style({
				image: new Icon({
					anchor: [0.5, 1],
					src: 'assets/marker.png'
				}),
				stroke: new Stroke({
					color: 'rgb(143, 237, 160)',
					width: 3
				}),
				fill: new Fill({
					color: 'rgba(143, 237, 160, 0.4)'
				})
			})
		});
		vectorLayer.set('name', 'vector');
		var topPlusOpenLayer = new TileLayer({
			source: new TileWMS({
				url: 'https://sgx.geodatenzentrum.de/wms_topplus_open?',
				params: {
					LAYERS: 'web',
					FORMAT: 'image/png',
					TILED: true
				},
				serverType: 'geoserver'
			})
		});
		map = new Map({
			target: node.id,
			layers: [
				topPlusOpenLayer,
				vectorLayer
			],
			view: new View({
				center: fromLonLat(center),
				zoom
			})
		});
		mapStore.set(map);
		return {
			destroy() {
				if (map) {
					map.setTarget();
					map = null;
				}
			}
		};
	};
</script>

<div id={mapId} class="map" use:setupMap />

<style>
	.map {
		width: 100%;
		height: 100%;
	}
</style>
