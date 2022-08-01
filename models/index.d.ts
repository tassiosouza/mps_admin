import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum RouteStatus {
  PLANNED = "PLANNED",
  INITIATED = "INITIATED",
  CHECKING_BAGS = "CHECKING_BAGS",
  IN_TRANSIT = "IN_TRANSIT",
  DONE = "DONE",
  ON_HOLD = "ON_HOLD",
  ABORTED = "ABORTED",
  SENDING_WELCOME_MESSAGES = "SENDING_WELCOME_MESSAGES"
}

export enum MpsOrderStatus {
  RECEIVED = "RECEIVED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CHECKED = "CHECKED",
  CANCELED = "CANCELED"
}

export enum OrderStatus {
  RECEIVED = "RECEIVED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CHECKED = "CHECKED"
}



type MpsRouteMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MpOrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CustomerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CoordinatesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DriverMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TodoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class MpsRoute {
  readonly id: string;
  readonly cost?: number | null;
  readonly startTime?: number | null;
  readonly endTime?: number | null;
  readonly status?: RouteStatus | keyof typeof RouteStatus | null;
  readonly name: string;
  readonly orders?: (MpOrder | null)[] | null;
  readonly driver?: Driver | null;
  readonly distance?: number | null;
  readonly duration?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly mpsRouteDriverId?: string | null;
  constructor(init: ModelInit<MpsRoute, MpsRouteMetaData>);
  static copyOf(source: MpsRoute, mutator: (draft: MutableModel<MpsRoute, MpsRouteMetaData>) => MutableModel<MpsRoute, MpsRouteMetaData> | void): MpsRoute;
}

export declare class MpOrder {
  readonly id: string;
  readonly number: string;
  readonly deliveryInstruction?: string | null;
  readonly mealsInstruction?: string | null;
  readonly status?: MpsOrderStatus | keyof typeof MpsOrderStatus | null;
  readonly customer?: Customer | null;
  readonly eta?: number | null;
  readonly routeID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly mpOrderCustomerId?: string | null;
  constructor(init: ModelInit<MpOrder, MpOrderMetaData>);
  static copyOf(source: MpOrder, mutator: (draft: MutableModel<MpOrder, MpOrderMetaData>) => MutableModel<MpOrder, MpOrderMetaData> | void): MpOrder;
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

export declare class Coordinates {
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Coordinates, CoordinatesMetaData>);
  static copyOf(source: Coordinates, mutator: (draft: MutableModel<Coordinates, CoordinatesMetaData>) => MutableModel<Coordinates, CoordinatesMetaData> | void): Coordinates;
}

export declare class Driver {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string | null;
  readonly carCapacity?: number | null;
  readonly owner: string;
  readonly onBoard?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Driver, DriverMetaData>);
  static copyOf(source: Driver, mutator: (draft: MutableModel<Driver, DriverMetaData>) => MutableModel<Driver, DriverMetaData> | void): Driver;
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