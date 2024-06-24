import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet-routing-machine';
import { setmapInstructions } from '../../redux/actions';

const createRoutineMachineLayer = ({lat,lon, metas, dispatch}) => {

  
    const waypoints = [
        L.latLng(lat,lon),
        ...metas.map(meta => L.latLng(meta.lat, meta.lon))
    ];

    // Temporarily suppress the warning in development
    const originalConsoleWarn = console.warn;
    console.warn = (message, ...optionalParams) => {
        if (typeof message === 'string' && message.includes('OSRM')) {
            return;
        }
        originalConsoleWarn(message, ...optionalParams);
    };

    const instance = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
            styles: [{ color: "#6FA1EC", weight: 4 }] // Stile del percorso principale
        },
        altLineOptions: {
            styles: [{ color: "#FF5733", weight: 4, opacity: 0.7 }] // Stile dei percorsi alternativi
        },
        createMarker: () => null, // Nasconde i marker delle istruzioni
        show: false, // Nasconde il pannello delle istruzioni
        addWaypoints: false,
        routeWhileDragging: true,
        draggableWaypoints: true,
        fitSelectedRoutes: true,
        showAlternatives: true // Abilita la visualizzazione dei percorsi alternativi
    });

    instance.on('routesfound', function (e) {
        const routes = e.routes;
        dispatch(setmapInstructions(routes[0]));
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
