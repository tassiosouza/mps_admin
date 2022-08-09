/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMpsRoute = /* GraphQL */ `
  mutation CreateMpsRoute(
    $input: CreateMpsRouteInput!
    $condition: ModelMpsRouteConditionInput
  ) {
    createMpsRoute(input: $input, condition: $condition) {
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
          mealsInstruction
          status
          customer {
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
          eta
          routeID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          mpOrderCustomerId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpsRouteDriverId
    }
  }
`;
export const updateMpsRoute = /* GraphQL */ `
  mutation UpdateMpsRoute(
    $input: UpdateMpsRouteInput!
    $condition: ModelMpsRouteConditionInput
  ) {
    updateMpsRoute(input: $input, condition: $condition) {
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
          mealsInstruction
          status
          customer {
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
          eta
          routeID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          mpOrderCustomerId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpsRouteDriverId
    }
  }
`;
export const deleteMpsRoute = /* GraphQL */ `
  mutation DeleteMpsRoute(
    $input: DeleteMpsRouteInput!
    $condition: ModelMpsRouteConditionInput
  ) {
    deleteMpsRoute(input: $input, condition: $condition) {
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
          mealsInstruction
          status
          customer {
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
          eta
          routeID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          mpOrderCustomerId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpsRouteDriverId
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
export const createMpOrder = /* GraphQL */ `
  mutation CreateMpOrder(
    $input: CreateMpOrderInput!
    $condition: ModelMpOrderConditionInput
  ) {
    createMpOrder(input: $input, condition: $condition) {
      id
      number
      deliveryInstruction
      mealsInstruction
      status
      customer {
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
      eta
      routeID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpOrderCustomerId
    }
  }
`;
export const updateMpOrder = /* GraphQL */ `
  mutation UpdateMpOrder(
    $input: UpdateMpOrderInput!
    $condition: ModelMpOrderConditionInput
  ) {
    updateMpOrder(input: $input, condition: $condition) {
      id
      number
      deliveryInstruction
      mealsInstruction
      status
      customer {
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
      eta
      routeID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpOrderCustomerId
    }
  }
`;
export const deleteMpOrder = /* GraphQL */ `
  mutation DeleteMpOrder(
    $input: DeleteMpOrderInput!
    $condition: ModelMpOrderConditionInput
  ) {
    deleteMpOrder(input: $input, condition: $condition) {
      id
      number
      deliveryInstruction
      mealsInstruction
      status
      customer {
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
      eta
      routeID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpOrderCustomerId
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
