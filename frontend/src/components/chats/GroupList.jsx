// import React from "react";
// import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

// const GroupList = ({ groups, selectedGroup, onGroupClick }) => {
//   return (
//     <ListGroup className="h-100 custom-scrollbar bg-blue rounded-0">
//       {Array.isArray(groups) && groups.length > 0 ? (
//         groups.map((group) => (
//           <ListGroup.Item
//             key={group.id}
//             onClick={() => onGroupClick(group)}
//             className={`group-item d-flex align-items-center justify-content-center rounded-0 p-3 border-0 fs-4 text-start ${
//               selectedGroup && selectedGroup.id === group.id ? "bg-red" : "bg-blue text-white"
//             }`}
//           >
//             <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-${group.id}`}>{group.name}</Tooltip>}>
//               <img
//                 src={group.image}
//                 alt="Group"
//                 className="rounded-circle"
//                 style={{ width: "40px", height: "40px", transition: "transform 0.2s ease-in-out" }}
//               />
//             </OverlayTrigger>
//           </ListGroup.Item>
//         ))
//       ) : (
//         <ListGroup.Item className="d-flex align-items-center justify-content-center">
//           No groups available
//         </ListGroup.Item>
//       )}
//     </ListGroup>
//   );
// };

// export default GroupList;
