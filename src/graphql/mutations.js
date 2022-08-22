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
      name
      orders {
        items {
          id
          number
          deliveryInstruction
          mealPlan
          status
          customerName
          eta
          routeID
          address
          latitude
          longitude
          orderDate
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      driver {
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
        assignedRouteID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      location
      routePlanName
      routeDate
      points
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mRouteDriverId
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
      name
      orders {
        items {
          id
          number
          deliveryInstruction
          mealPlan
          status
          customerName
          eta
          routeID
          address
          latitude
          longitude
          orderDate
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      driver {
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
        assignedRouteID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      location
      routePlanName
      routeDate
      points
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mRouteDriverId
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
      name
      orders {
        items {
          id
          number
          deliveryInstruction
          mealPlan
          status
          customerName
          eta
          routeID
          address
          latitude
          longitude
          orderDate
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      driver {
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
        assignedRouteID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      location
      routePlanName
      routeDate
      points
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mRouteDriverId
    }
  }
`;
export const createCoordinates = /* GraphQL */ `
  mutation CreateCoordinates(
    $input: CreateCoordinatesInput!
    $condition: ModelCoordinatesConditionInput
  ) {
    createCoordinates(input: $input, condition: $condition) {
      id
      latitude
      longitude
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateCoordinates = /* GraphQL */ `
  mutation UpdateCoordinates(
    $input: UpdateCoordinatesInput!
    $condition: ModelCoordinatesConditionInput
  ) {
    updateCoordinates(input: $input, condition: $condition) {
      id
      latitude
      longitude
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteCoordinates = /* GraphQL */ `
  mutation DeleteCoordinates(
    $input: DeleteCoordinatesInput!
    $condition: ModelCoordinatesConditionInput
  ) {
    deleteCoordinates(input: $input, condition: $condition) {
      id
      latitude
      longitude
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      routeID
      address
      latitude
      longitude
      orderDate
      phone
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      routeID
      address
      latitude
      longitude
      orderDate
      phone
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      routeID
      address
      latitude
      longitude
      orderDate
      phone
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createCustomer = /* GraphQL */ `
  mutation CreateCustomer(
    $input: CreateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    createCustomer(input: $input, condition: $condition) {
      id
      name
      address
      plan
      phone
      owner
      coordinates {
        id
        latitude
        longitude
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      customerCoordinatesId
    }
  }
`;
export const updateCustomer = /* GraphQL */ `
  mutation UpdateCustomer(
    $input: UpdateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    updateCustomer(input: $input, condition: $condition) {
      id
      name
      address
      plan
      phone
      owner
      coordinates {
        id
        latitude
        longitude
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      customerCoordinatesId
    }
  }
`;
export const deleteCustomer = /* GraphQL */ `
  mutation DeleteCustomer(
    $input: DeleteCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    deleteCustomer(input: $input, condition: $condition) {
      id
      name
      address
      plan
      phone
      owner
      coordinates {
        id
        latitude
        longitude
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      customerCoordinatesId
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
      assignedRouteID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      assignedRouteID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      assignedRouteID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
