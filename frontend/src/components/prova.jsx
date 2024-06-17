
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { useEffect } from "react";

const RoutingMachine = (props) => {
    let instance = null;

    const createRoutingInstance = () => {
        const waypoints = [
            L.latLng(props.start_location.lat, props.start_location.lon),
            ...(props.metas.map(meta => L.latLng(meta.lat, meta.lon)))
        ];

        if (instance) {
            instance.setWaypoints(waypoints);
        } else {
            instance = L.Routing.control({
                waypoints: [
  
                    L.latLng(props.start_location.lat, props.start_location.lon),
                    ...(props.metas.map(meta => L.latLng(meta.lat, meta.lon))),
                 
                ],
                lineOptions: {
                    styles: [{ color: "#6FA1EC", weight: 4 }]
                },
                show: false,
                addWaypoints: false,
                routeWhileDragging: true,
                draggableWaypoints: true,
                fitSelectedRoutes: true,
                showAlternatives: false
            });
        }
    };

    useEffect(() => {
        createRoutingInstance();
    }, [props.start_location, props.metas]);

    return instance;
};

const RoutingMachineComponent = createControlComponent(RoutingMachine);

export default RoutingMachineComponent;

 