import { MemberRoles, Membership } from "../types/mtl";

export function isMemberTrusteeForDistrict(memberships: Membership[], hunterCardNumber: string, districtId?: number) {
    if (!districtId) {
        return false;
    }

    const member = memberships
        .find((membership) => membership.id === districtId)
        ?.members.find((member) => member.cardNumber === hunterCardNumber);
    if (!member) {
        return false;
    }

    return member.roles.includes(MemberRoles.Trustee);
}
