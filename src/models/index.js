// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const RouteStatus = {
  "PLANNED": "PLANNED",
  "ASSIGNED": "ASSIGNED",
  "INITIATED": "INITIATED",
  "CHECKING_BAGS": "CHECKING_BAGS",
  "IN_TRANSIT": "IN_TRANSIT",
  "DONE": "DONE",
  "CANCELED": "CANCELED",
  "ON_HOLD": "ON_HOLD",
  "SENDING_WELCOME_MESSAGES": "SENDING_WELCOME_MESSAGES"
};

const OrderStatus = {
  "CREATED": "CREATED",
  "IN_TRANSIT": "IN_TRANSIT",
  "DELIVERED": "DELIVERED",
  "CHECKED": "CHECKED",
  "CANCELED": "CANCELED"
};

const { MRoute, MOrder, Driver, Coordinates, MpsSubscription, Customer, Todo } = initSchema(schema);

export {
  MRoute,
  MOrder,
  Driver,
  Coordinates,
  MpsSubscription,
  Customer,
  Todo,
  RouteStatus,
  OrderStatus
};