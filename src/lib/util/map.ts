import type { FeatureCollection } from "geojson";
import type Map from "ol/Map"
import GeoJSON from 'ol/format/GeoJSON.js';
import type VectorSource from "ol/source/Vector";

type Answer = {
  success: boolean;
  text: string;
  geojson: FeatureCollection;
}

const geojsonparser = new GeoJSON();

export const addAIAnswerToMap = (answer: Answer, map: Map) => {
  if (answer.success && map) {
    const features = geojsonparser.readFeatures(answer.geojson, {
      dataProjection: 'EPSG:4326',
      featureProjection: map.getView().getProjection()
    });
    const vectorLayer = map.getAllLayers().find(layer => layer.get('name') === 'vector');
    const vectorSource = vectorLayer?.getSource() as VectorSource;
    if (vectorSource && features.length > 0) {
      vectorSource.clear();
      vectorSource.addFeatures(features);
      map.getView().fit(vectorSource.getExtent(), {
        maxZoom: 12
      });
    }
  }
}
