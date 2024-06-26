// import React from "react";
// import { ListGroup } from "react-bootstrap";
// import { Link } from "react-router-dom";

// const GroupMembers = ({ group }) => {
//   return (
//     <ListGroup className="custom-scrollbar rounded-0 h-100">
//       {Array.isArray(group.users) && group.users.length > 0 ? (
//         group.users.map((user) => (
//           <Link to={`/profile/${user.id}`} key={user.id} style={{ textDecoration: "none", color: "inherit" }}>
//             <ListGroup.Item className="px-4 rounded-0 py-3 fs-4 text-start bg-light">
//               <img
//                 src={user.profile_img}
//                 alt="User"
//                 className="rounded-circle me-3"
//                 style={{ width: "40px", height: "40px" }}
//               />
//               {user.username}
//             </ListGroup.Item>
//           </Link>
//         ))
//       ) : (
//         <ListGroup.Item>No members in this group</ListGroup.Item>
//       )}
//     </ListGroup>
//   );
// };

// export default GroupMembers;
