import * as React from "react";
import { ReactComponent as MapIcon } from "../assets/icons/map.svg";
import { ReactComponent as ObservationsIcon } from "../assets/icons/binoculars.svg";
import { ReactComponent as DamageIcon } from "../assets/icons/damage.svg";
import { ReactComponent as HuntIcon } from "../assets/icons/hunt.svg";
import { ReactComponent as SettingsIcon } from "../assets/icons/settings.svg";
import { ReactComponent as AnimalsIcon } from "../assets/icons/observations/animals.svg";
import { ReactComponent as SignsOfPresenceIcon } from "../assets/icons/observations/signsOfPresence.svg";
import { ReactComponent as DeadAnimalsIcon } from "../assets/icons/observations/deadAnimals.svg";
import { ReactComponent as MooseIcon } from "../assets/icons/animals/moose.svg";
import { ReactComponent as DeerIcon } from "../assets/icons/animals/deer.svg";
import { ReactComponent as RoeIcon } from "../assets/icons/animals/roe.svg";
import { ReactComponent as BoarIcon } from "../assets/icons/animals/boar.svg";
import { ReactComponent as LynxIcon } from "../assets/icons/animals/lynx.svg";
import { ReactComponent as WolfIcon } from "../assets/icons/animals/wolf.svg";
import { ReactComponent as BeaverIcon } from "../assets/icons/animals/beaver.svg";
import { ReactComponent as HareIcon } from "../assets/icons/animals/hare.svg";
import { ReactComponent as PolecatIcon } from "../assets/icons/animals/polecat.svg";
import { ReactComponent as MartenIcon } from "../assets/icons/animals/marten.svg";
import { ReactComponent as RacoonIcon } from "../assets/icons/animals/racoon.svg";
import { ReactComponent as FoxIcon } from "../assets/icons/animals/fox.svg";
import { ReactComponent as FerretIcon } from "../assets/icons/animals/ferret.svg";
import { ReactComponent as BadgerIcon } from "../assets/icons/animals/badger.svg";
import { ReactComponent as HazelGrouseIcon } from "../assets/icons/animals/hazel-grouse.svg";
import { ReactComponent as RackelhahnIcon } from "../assets/icons/animals/rackelhahn.svg";
import { ReactComponent as WesternCapercaillieIcon } from "../assets/icons/animals/western-capercaillie.svg";
import { ReactComponent as BlackGrouseIcon } from "../assets/icons/animals/black-grouse.svg";
import { ReactComponent as PheasantIcon } from "../assets/icons/animals/pheasant.svg";
import { ReactComponent as BirdsIcon } from "../assets/icons/animals/birds.svg";
import { ReactComponent as LandIcon } from "../assets/icons/damage/land.svg";
import { ReactComponent as ForestIcon } from "../assets/icons/damage/forest.svg";
import { ReactComponent as InfrastructureIcon } from "../assets/icons/damage/infrastructure.svg";
import { ReactComponent as CroppingIcon } from "../assets/icons/damage/cropping.svg";
import { ReactComponent as LivestockIcon } from "../assets/icons/damage/livestock.svg";
import { ReactComponent as OtherIcon } from "../assets/icons/animals/other.svg";
import { ReactComponent as CrossIcon } from "../assets/icons/cross.svg";
import { ReactComponent as CrossBoldIcon } from "../assets/icons/cross-bold.svg";
import { ReactComponent as LoadingIcon } from "../assets/icons/loading.svg";
import { ReactComponent as SuccessIcon } from "../assets/icons/success.svg";
import { ReactComponent as FailureIcon } from "../assets/icons/failure.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash.svg";
import { ReactComponent as ChevronDownIcon } from "../assets/icons/chevron-down.svg";
import { ReactComponent as ChevronUpIcon } from "../assets/icons/chevron-up.svg";
import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg";
import { ReactComponent as PictureIcon } from "../assets/icons/picture.svg";
import { ReactComponent as CameraIcon } from "../assets/icons/camera.svg";
import { ReactComponent as BrowseIcon } from "../assets/icons/browse.svg";
import { ReactComponent as HouseIcon } from "../assets/icons/house.svg";
import { ReactComponent as TargetIcon } from "../assets/icons/target.svg";
import { ReactComponent as TargetActiveIcon } from "../assets/icons/target-active.svg";
import { ReactComponent as TargetBackgroundIcon } from "../assets/icons/target-background.svg";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "../assets/icons/minus.svg";
import { ReactComponent as MarkerIcon } from "../assets/icons/marker.svg";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow-left.svg";
import { ReactComponent as LayersIcon } from "../assets/icons/map-layers.svg";
import { ReactComponent as NotAvailableIcon } from "../assets/icons/not-available.svg";
import { ReactComponent as UserSettingsIcon } from "../assets/icons/user-settings.svg";
import { ReactComponent as UserIcon } from "../assets/icons/user.svg";
import { ReactComponent as UserNewIcon } from "../assets/icons/user-new.svg";
import { ReactComponent as InfoIcon } from "../assets/icons/info.svg";
import { ReactComponent as ExitIcon } from "../assets/icons/exit.svg";
import { ReactComponent as ValidIcon } from "../assets/icons/valid.svg";
import { ReactComponent as InvalidIcon } from "../assets/icons/not-valid.svg";
import { ReactComponent as MtlIcon } from "../assets/icons/mtl/mtl.svg";
import { ReactComponent as TagIcon } from "../assets/icons/mtl/tag.svg";
import { ReactComponent as StatisticsIcon } from "../assets/icons/mtl/statistics.svg";
import { ReactComponent as MembersIcon } from "../assets/icons/mtl/members.svg";
import { ReactComponent as PermitTagIcon } from "../assets/icons/mtl/permit-tag.svg";
import { ReactComponent as HuntTargetIcon } from "../assets/icons/hunt-target.svg";
import { ReactComponent as HouseSlimIcon } from "../assets/icons/house-slim.svg";
import { ReactComponent as KeyIcon } from "../assets/icons/key.svg";
import { ReactComponent as FlagIcon } from "../assets/icons/flag.svg";
import { ReactComponent as VestIcon } from "../assets/icons/vest.svg";
import { ReactComponent as RegisterIcon } from "../assets/icons/register.svg";
import { ReactComponent as PendingIcon } from "../assets/icons/pending.svg";
import { ReactComponent as BackspaceIcon } from "../assets/icons/backspace.svg";

const icons = {
    // tabs
    map: MapIcon,
    observations: ObservationsIcon,
    damage: DamageIcon,
    hunt: HuntIcon,
    settings: SettingsIcon,
    // observations
    animals: AnimalsIcon,
    signsOfPresence: SignsOfPresenceIcon,
    deadAnimals: DeadAnimalsIcon,
    // animals
    moose: MooseIcon,
    deer: DeerIcon,
    roe: RoeIcon,
    boar: BoarIcon,
    lynx: LynxIcon,
    wolf: WolfIcon,
    beaver: BeaverIcon,
    hare: HareIcon,
    polecat: PolecatIcon,
    marten: MartenIcon,
    racoon: RacoonIcon,
    fox: FoxIcon,
    ferret: FerretIcon,
    badger: BadgerIcon,
    hazelGrouse: HazelGrouseIcon,
    rackelhahn: RackelhahnIcon,
    westernCapercaillie: WesternCapercaillieIcon,
    blackGrouse: BlackGrouseIcon,
    pheasant: PheasantIcon,
    birds: BirdsIcon,
    // damage
    land: LandIcon,
    forest: ForestIcon,
    infrastructure: InfrastructureIcon,
    cropping: CroppingIcon,
    livestock: LivestockIcon,
    other: OtherIcon,
    // mtl
    mtl: MtlIcon,
    tag: TagIcon,
    statistics: StatisticsIcon,
    members: MembersIcon,
    permitTag: PermitTagIcon,
    // general
    cross: CrossIcon,
    crossBold: CrossBoldIcon,
    loading: LoadingIcon,
    success: SuccessIcon,
    failure: FailureIcon,
    delete: DeleteIcon,
    trash: TrashIcon,
    chevronDown: ChevronDownIcon,
    chevronUp: ChevronUpIcon,
    chevronLeft: ChevronLeftIcon,
    chevronRight: ChevronRightIcon,
    picture: PictureIcon,
    camera: CameraIcon,
    browse: BrowseIcon,
    house: HouseIcon,
    target: TargetIcon,
    targetActive: TargetActiveIcon,
    targetBackground: TargetBackgroundIcon,
    plus: PlusIcon,
    minus: MinusIcon,
    marker: MarkerIcon,
    arrowLeft: ArrowLeftIcon,
    layers: LayersIcon,
    notAvailable: NotAvailableIcon,
    userSettings: UserSettingsIcon,
    user: UserIcon,
    userNew: UserNewIcon,
    info: InfoIcon,
    exit: ExitIcon,
    valid: ValidIcon,
    invalid: InvalidIcon,
    huntTarget: HuntTargetIcon,
    key: KeyIcon,
    flag: FlagIcon,
    houseSlim: HouseSlimIcon,
    vest: VestIcon,
    register: RegisterIcon,
    pending: PendingIcon,
    backspace: BackspaceIcon,
};

export type IconName = keyof typeof icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
}

export function Icon(props: IconProps) {
    const { name, ...svgProps } = props;

    const Icon = icons[name];
    return <Icon {...svgProps} />;
}
