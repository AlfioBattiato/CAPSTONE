import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { useState } from "react";

const createRoutineMachineLayer = (props) => {
    console.log(props)
    
    const instance = L.Routing.control({
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
    
    return instance;
};


const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;