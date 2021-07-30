export interface Membership {
    id: number;
    code: string;
    name: string;
    members: Member[];
}

export interface Member {
    id: number;
    cardNumber: string;
    roles: MemberRoles[];
}

export enum MemberRoles {
    Trustee = "trustee",
    Administrator = "administrator",
    HuntManager = "huntManager",
    Hunter = "hunter",
    Member = "member",
}

export interface HuntingDistrict {
    id: number;
    code: string;
    vmdCode: string;
    descriptionLv: string;
    trusteeId: number;
    createdOn: string;
}
