// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const RouteStatus = {
  "PLANNED": "PLANNED",
  "INITIATED": "INITIATED",
  "CHECKING_BAGS": "CHECKING_BAGS",
  "IN_TRANSIT": "IN_TRANSIT",
  "DONE": "DONE",
  "ON_HOLD": "ON_HOLD",
  "ABORTED": "ABORTED",
  "SENDING_WELCOME_MESSAGES": "SENDING_WELCOME_MESSAGES"
};

const MpsOrderStatus = {
  "RECEIVED": "RECEIVED",
  "IN_TRANSIT": "IN_TRANSIT",
  "DELIVERED": "DELIVERED",
  "CHECKED": "CHECKED",
  "CANCELED": "CANCELED"
};

const OrderStatus = {
  "RECEIVED": "RECEIVED",
  "IN_TRANSIT": "IN_TRANSIT",
  "DELIVERED": "DELIVERED",
  "CHECKED": "CHECKED"
};

const { MpsRoute, MpOrder, Customer, Coordinates, Driver, Todo } = initSchema(schema);

export {
  MpsRoute,
  MpOrder,
  Customer,
  Coordinates,
  Driver,
  Todo,
  RouteStatus,
  MpsOrderStatus,
  OrderStatus
};