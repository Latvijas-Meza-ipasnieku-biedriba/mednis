import { ProfileBasicInfo } from "./profile";
import { EditQueueEntry } from "../hooks/useEditQueue";

export interface UserData {
    userId: number;
    profileBasicInfo?: ProfileBasicInfo;
    editQueue: EditQueueEntry[];
    isCurrentUser: boolean;
}
