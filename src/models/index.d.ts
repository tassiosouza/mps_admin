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



type MRouteMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MOrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DriverMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CoordinatesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MpsSubscriptionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CustomerMetaData = {
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
  readonly name: string;
  readonly orders?: (MOrder | null)[] | null;
  readonly driver?: Driver | null;
  readonly distance?: number | null;
  readonly duration?: number | null;
  readonly location?: string | null;
  readonly routePlanName?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly mRouteDriverId?: string | null;
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
  readonly routeID: string;
  readonly address?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly orderDate?: number | null;
  readonly phone?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<MOrder, MOrderMetaData>);
  static copyOf(source: MOrder, mutator: (draft: MutableModel<MOrder, MOrderMetaData>) => MutableModel<MOrder, MOrderMetaData> | void): MOrder;
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
  readonly assignedRouteID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Driver, DriverMetaData>);
  static copyOf(source: Driver, mutator: (draft: MutableModel<Driver, DriverMetaData>) => MutableModel<Driver, DriverMetaData> | void): Driver;
}

export declare class Coordinates {
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Coordinates, CoordinatesMetaData>);
  static copyOf(source: Coordinates, mutator: (draft: MutableModel<Coordinates, CoordinatesMetaData>) => MutableModel<Coordinates, CoordinatesMetaData> | void): Coordinates;
}

export declare class MpsSubscription {
  readonly id: string;
  readonly number: string;
  readonly deliveryInstruction?: string | null;
  readonly mealPlan?: string | null;
  readonly subscriptionDate?: number | null;
  readonly address?: string | null;
  readonly status?: string | null;
  readonly name?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly avatar?: string | null;
  readonly location?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<MpsSubscription, MpsSubscriptionMetaData>);
  static copyOf(source: MpsSubscription, mutator: (draft: MutableModel<MpsSubscription, MpsSubscriptionMetaData>) => MutableModel<MpsSubscription, MpsSubscriptionMetaData> | void): MpsSubscription;
}

export declare class Customer {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly plan?: string | null;
  readonly phone: string;
  readonly owner?: string | null;
  readonly coordinates?: Coordinates | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly customerCoordinatesId?: string | null;
  constructor(init: ModelInit<Customer, CustomerMetaData>);
  static copyOf(source: Customer, mutator: (draft: MutableModel<Customer, CustomerMetaData>) => MutableModel<Customer, CustomerMetaData> | void): Customer;
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