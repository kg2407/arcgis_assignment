import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Legend from '@arcgis/core/widgets/Legend';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import Expand from '@arcgis/core/widgets/Expand';
import './App.css';

function ArcGISMap() {
  // const [pm2LayerView, setPm2LayerView] = useState();
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const renderer = {
      type: 'simple',
      field: 'SITE_NAME',
      symbol: {
        type: 'simple-marker',
        color: 'cyan',
        outline: {
          color: 'gray'
        }
      },
      visualVariables: [
        {
          type: 'size',
          field: 'PM25_UG_M3',
          stops: [
            {
              value: 2,
              size: '12px'
            },
            {
              value: 3,
              size: '16px'
            },
            {
              value: 4,
              size: '20px'
            },
            {
              value: 5,
              size: '24px'
            }
          ]
        }
      ]
    };

    const template = {
      title: 'FeatureCollection',
      content: 'Site {SITE_NAME} address is : {SITE_ADDRESS}'
    };
    const geojsonLayer = new GeoJSONLayer({
      url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LATEST_CORE_SITE_READINGS/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
      renderer: renderer,
      popupTemplate: template
    });

    const webmap = new WebMap({
      portalItem: {
        id: '05e015c5f0314db9a487a9b46cb37eca'
      }
    });
    webmap.add(geojsonLayer);
    const view = new MapView({
      map: webmap,
      container: mapRef.current,
      center: [-75, 40],
      zoom: 10
    });
    const featureLayer = webmap.layers.getItemAt(0);
    const legend = new Legend({
      view: view,
      layerInfos: [
        {
          layer: featureLayer,
          title: 'Locations PM data'
        }
      ]
    });
    // setPm2LayerView(featureLayer);
    const filterElement = document.getElementById('pm2-filter');
    filterElement.style.visibility = 'visible';
    const expand = new Expand({
      view: view,
      content: filterElement,
      expandIcon: 'filter',
      group: 'top-left'
    });
    view.ui.add(expand, 'top-right');
    view.ui.add(legend, 'bottom-right');
    return () => view && view.destroy();
  }, []);
  function filterByPM2(e) {
    const pm2Data = e.target.getAttribute('data-pm2');
    console.log(pm2Data);
  }
  return (
    <div ref={mapRef} className='mapContainer'>
      <div id='pm2-filter' onClick={(e) => filterByPM2(e)}>
        <div className='pm2-item' data-pm2='<2'>
          &lt; 2
        </div>
        <div className='pm2-item' data-pm2='3'>
          3
        </div>
        <div className='pm2-item' data-pm2='4'>
          4
        </div>
        <div className='pm2-item' data-pm2='>5'>
          &gt; 5
        </div>
      </div>
    </div>
  );
}

export default ArcGISMap;
