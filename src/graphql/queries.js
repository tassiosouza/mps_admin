/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMRoute = /* GraphQL */ `
  query GetMRoute($id: ID!) {
    getMRoute(id: $id) {
      id
      cost
      startTime
      endTime
      status
      driverID
      distance
      duration
      location
      routePlanName
      routeDate
      points
      createdAt
      updatedAt
    }
  }
`;
export const listMRoutes = /* GraphQL */ `
  query ListMRoutes(
    $filter: ModelMRouteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMRoutes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cost
        startTime
        endTime
        status
        driverID
        distance
        duration
        location
        routePlanName
        routeDate
        points
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMOrder = /* GraphQL */ `
  query GetMOrder($id: ID!) {
    getMOrder(id: $id) {
      id
      number
      deliveryInstruction
      mealPlan
      status
      customerName
      eta
      assignedRouteID
      address
      latitude
      longitude
      orderDate
      phone
      location
      sort
      avatar
      subscriptionID
      subscriptionNumber
      deliveryKey
      createdAt
      updatedAt
    }
  }
`;
export const listMOrders = /* GraphQL */ `
  query ListMOrders(
    $filter: ModelMOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        number
        deliveryInstruction
        mealPlan
        status
        customerName
        eta
        assignedRouteID
        address
        latitude
        longitude
        orderDate
        phone
        location
        sort
        avatar
        subscriptionID
        subscriptionNumber
        deliveryKey
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMpsSubscription = /* GraphQL */ `
  query GetMpsSubscription($id: ID!) {
    getMpsSubscription(id: $id) {
      id
      number
      deliveryInstruction
      mealPlan
      subscriptionDate
      address
      status
      name
      email
      phone
      latitude
      longitude
      avatar
      location
      createdAt
      updatedAt
    }
  }
`;
export const listMpsSubscriptions = /* GraphQL */ `
  query ListMpsSubscriptions(
    $filter: ModelMpsSubscriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMpsSubscriptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        number
        deliveryInstruction
        mealPlan
        subscriptionDate
        address
        status
        name
        email
        phone
        latitude
        longitude
        avatar
        location
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDriver = /* GraphQL */ `
  query GetDriver($id: ID!) {
    getDriver(id: $id) {
      id
      name
      email
      phone
      carCapacity
      owner
      onBoard
      status
      latitude
      longitude
      assignStatus
      createdAt
      updatedAt
    }
  }
`;
export const listDrivers = /* GraphQL */ `
  query ListDrivers(
    $filter: ModelDriverFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDrivers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        phone
        carCapacity
        owner
        onBoard
        status
        latitude
        longitude
        assignStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      isComplete
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        isComplete
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
