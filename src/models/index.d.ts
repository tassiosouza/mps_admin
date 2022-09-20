import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum RouteStatus {
  PLANNED = "PLANNED",
  ASSIGNED = "ASSIGNED",
  INITIATED = "INITIATED",
  CHECKING_BAGS = "CHECKING_BAGS",
  IN_TRANSIT = "IN_TRANSIT",
  DONE = "DONE",
  CANCELED = "CANCELED",
  ON_HOLD = "ON_HOLD",
  SENDING_WELCOME_MESSAGES = "SENDING_WELCOME_MESSAGES"
}

export enum OrderStatus {
  CREATED = "CREATED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CHECKED = "CHECKED",
  CANCELED = "CANCELED"
}

export enum SubscriptionStatus {
  ACTIVED = "ACTIVED",
  ASSIGNED = "ASSIGNED",
  CANCELED = "CANCELED"
}

export enum AssignStatus {
  ASSIGNED = "ASSIGNED",
  ASSIGNING = "ASSIGNING",
  UNASSIGNED = "UNASSIGNED"
}



type MRouteMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MOrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MpsSubscriptionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DriverMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ClusterMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TodoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class MRoute {
  readonly id: string;
  readonly cost?: number | null;
  readonly startTime?: number | null;
  readonly endTime?: number | null;
  readonly status?: RouteStatus | keyof typeof RouteStatus | null;
  readonly driverID?: string | null;
  readonly distance?: number | null;
  readonly duration?: number | null;
  readonly location?: string | null;
  readonly routePlanName?: string | null;
  readonly routeDate?: number | null;
  readonly points?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<MRoute, MRouteMetaData>);
  static copyOf(source: MRoute, mutator: (draft: MutableModel<MRoute, MRouteMetaData>) => MutableModel<MRoute, MRouteMetaData> | void): MRoute;
}

export declare class MOrder {
  readonly id: string;
  readonly number?: string | null;
  readonly deliveryInstruction?: string | null;
  readonly mealPlan?: string | null;
  readonly status?: OrderStatus | keyof typeof OrderStatus | null;
  readonly customerName?: string | null;
  readonly eta?: number | null;
  readonly assignedRouteID?: string | null;
  readonly address?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly orderDate?: number | null;
  readonly phone?: string | null;
  readonly location?: string | null;
  readonly sort?: number | null;
  readonly avatar?: string | null;
  readonly subscriptionID?: string | null;
  readonly subscriptionNumber?: string | null;
  readonly deliveryKey?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<MOrder, MOrderMetaData>);
  static copyOf(source: MOrder, mutator: (draft: MutableModel<MOrder, MOrderMetaData>) => MutableModel<MOrder, MOrderMetaData> | void): MOrder;
}

export declare class MpsSubscription {
  readonly id: string;
  readonly number: string;
  readonly deliveryInstruction?: string | null;
  readonly mealPlan?: string | null;
  readonly subscriptionDate?: number | null;
  readonly address?: string | null;
  readonly status?: SubscriptionStatus | keyof typeof SubscriptionStatus | null;
  readonly name?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly avatar?: string | null;
  readonly location?: string | null;
  readonly clusterId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<MpsSubscription, MpsSubscriptionMetaData>);
  static copyOf(source: MpsSubscription, mutator: (draft: MutableModel<MpsSubscription, MpsSubscriptionMetaData>) => MutableModel<MpsSubscription, MpsSubscriptionMetaData> | void): MpsSubscription;
}

export declare class Driver {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string | null;
  readonly carCapacity?: number | null;
  readonly owner: string;
  readonly onBoard?: boolean | null;
  readonly status?: boolean | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly assignStatus?: AssignStatus | keyof typeof AssignStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Driver, DriverMetaData>);
  static copyOf(source: Driver, mutator: (draft: MutableModel<Driver, DriverMetaData>) => MutableModel<Driver, DriverMetaData> | void): Driver;
}

export declare class Cluster {
  readonly id: string;
  readonly name: string;
  readonly parentId?: string | null;
  readonly subscriptionsCount?: number | null;
  readonly color?: string | null;
  readonly open?: boolean | null;
  readonly level?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Cluster, ClusterMetaData>);
  static copyOf(source: Cluster, mutator: (draft: MutableModel<Cluster, ClusterMetaData>) => MutableModel<Cluster, ClusterMetaData> | void): Cluster;
}

export declare class Todo {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly isComplete: boolean;
  readonly owner: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Todo, TodoMetaData>);
  static copyOf(source: Todo, mutator: (draft: MutableModel<Todo, TodoMetaData>) => MutableModel<Todo, TodoMetaData> | void): Todo;
}