/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMRoute = /* GraphQL */ `
  mutation CreateMRoute(
    $input: CreateMRouteInput!
    $condition: ModelMRouteConditionInput
  ) {
    createMRoute(input: $input, condition: $condition) {
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
export const updateMRoute = /* GraphQL */ `
  mutation UpdateMRoute(
    $input: UpdateMRouteInput!
    $condition: ModelMRouteConditionInput
  ) {
    updateMRoute(input: $input, condition: $condition) {
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
export const deleteMRoute = /* GraphQL */ `
  mutation DeleteMRoute(
    $input: DeleteMRouteInput!
    $condition: ModelMRouteConditionInput
  ) {
    deleteMRoute(input: $input, condition: $condition) {
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
export const createMOrder = /* GraphQL */ `
  mutation CreateMOrder(
    $input: CreateMOrderInput!
    $condition: ModelMOrderConditionInput
  ) {
    createMOrder(input: $input, condition: $condition) {
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
export const updateMOrder = /* GraphQL */ `
  mutation UpdateMOrder(
    $input: UpdateMOrderInput!
    $condition: ModelMOrderConditionInput
  ) {
    updateMOrder(input: $input, condition: $condition) {
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
export const deleteMOrder = /* GraphQL */ `
  mutation DeleteMOrder(
    $input: DeleteMOrderInput!
    $condition: ModelMOrderConditionInput
  ) {
    deleteMOrder(input: $input, condition: $condition) {
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
export const createMpsSubscription = /* GraphQL */ `
  mutation CreateMpsSubscription(
    $input: CreateMpsSubscriptionInput!
    $condition: ModelMpsSubscriptionConditionInput
  ) {
    createMpsSubscription(input: $input, condition: $condition) {
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
      clusterId
      editing
      createdAt
      updatedAt
    }
  }
`;
export const updateMpsSubscription = /* GraphQL */ `
  mutation UpdateMpsSubscription(
    $input: UpdateMpsSubscriptionInput!
    $condition: ModelMpsSubscriptionConditionInput
  ) {
    updateMpsSubscription(input: $input, condition: $condition) {
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
      clusterId
      editing
      createdAt
      updatedAt
    }
  }
`;
export const deleteMpsSubscription = /* GraphQL */ `
  mutation DeleteMpsSubscription(
    $input: DeleteMpsSubscriptionInput!
    $condition: ModelMpsSubscriptionConditionInput
  ) {
    deleteMpsSubscription(input: $input, condition: $condition) {
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
      clusterId
      editing
      createdAt
      updatedAt
    }
  }
`;
export const createDriver = /* GraphQL */ `
  mutation CreateDriver(
    $input: CreateDriverInput!
    $condition: ModelDriverConditionInput
  ) {
    createDriver(input: $input, condition: $condition) {
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
export const updateDriver = /* GraphQL */ `
  mutation UpdateDriver(
    $input: UpdateDriverInput!
    $condition: ModelDriverConditionInput
  ) {
    updateDriver(input: $input, condition: $condition) {
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
export const deleteDriver = /* GraphQL */ `
  mutation DeleteDriver(
    $input: DeleteDriverInput!
    $condition: ModelDriverConditionInput
  ) {
    deleteDriver(input: $input, condition: $condition) {
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
export const createCluster = /* GraphQL */ `
  mutation CreateCluster(
    $input: CreateClusterInput!
    $condition: ModelClusterConditionInput
  ) {
    createCluster(input: $input, condition: $condition) {
      id
      name
      parentId
      subscriptionsCount
      color
      open
      level
      editing
      createdAt
      updatedAt
    }
  }
`;
export const updateCluster = /* GraphQL */ `
  mutation UpdateCluster(
    $input: UpdateClusterInput!
    $condition: ModelClusterConditionInput
  ) {
    updateCluster(input: $input, condition: $condition) {
      id
      name
      parentId
      subscriptionsCount
      color
      open
      level
      editing
      createdAt
      updatedAt
    }
  }
`;
export const deleteCluster = /* GraphQL */ `
  mutation DeleteCluster(
    $input: DeleteClusterInput!
    $condition: ModelClusterConditionInput
  ) {
    deleteCluster(input: $input, condition: $condition) {
      id
      name
      parentId
      subscriptionsCount
      color
      open
      level
      editing
      createdAt
      updatedAt
    }
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
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
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
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
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
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
