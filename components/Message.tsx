// import { cls } from "../libs/utils";

import { cls } from "@libs/utils";

// interface MessageProps {
//   message: string;
//   reversed?: boolean;
//   avatarUrl?: string;
// }

// const Message = ({ avatarUrl, message, reversed }: MessageProps) => {
//   return (
//     <div
//       className={cls(
//         "flex items-start space-x-2",
//         reversed ? "flex-row-reverse space-x-reverse" : ""
//       )}
//     >
//       <div className="h-8 rounded-full aspect-square bg-slate-400" />
//       <div className="w-1/2 p-2 text-sm text-gray-700 border border-gray-300 rounded-md">
//         <p>{message}</p>
//       </div>
//     </div>
//   );
// };

// export default Message;

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
}
const Message = ({ avatarUrl, message, reversed }: MessageProps) => {
  return (
    <div
      className={cls(
        "flex items-start space-x-2",
        reversed ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      <div className="h-8 w-8 rounded-full bg-slate-400" />
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Message;
