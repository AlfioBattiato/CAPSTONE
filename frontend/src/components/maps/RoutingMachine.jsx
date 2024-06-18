import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet-routing-machine';
import { setCurrentTravel } from '../../redux/actions';

const createRoutineMachineLayer = ({ start_location, metas, dispatch, travel }) => {
    const waypoints = [
        L.latLng(start_location.lat, start_location.lon),
        ...metas.map(meta => L.latLng(meta.lat, meta.lon))
    ];

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
        console.log(routes[0])
        const updatedTravel = {
            ...travel,
            map_instructions: routes[0]
        };
        dispatch(setCurrentTravel(updatedTravel));
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
