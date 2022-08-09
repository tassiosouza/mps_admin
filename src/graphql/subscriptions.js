/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMpsRoute = /* GraphQL */ `
  subscription OnCreateMpsRoute {
    onCreateMpsRoute {
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
export const onUpdateMpsRoute = /* GraphQL */ `
  subscription OnUpdateMpsRoute {
    onUpdateMpsRoute {
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
export const onDeleteMpsRoute = /* GraphQL */ `
  subscription OnDeleteMpsRoute {
    onDeleteMpsRoute {
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
export const onCreateCoordinates = /* GraphQL */ `
  subscription OnCreateCoordinates {
    onCreateCoordinates {
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
export const onUpdateCoordinates = /* GraphQL */ `
  subscription OnUpdateCoordinates {
    onUpdateCoordinates {
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
export const onDeleteCoordinates = /* GraphQL */ `
  subscription OnDeleteCoordinates {
    onDeleteCoordinates {
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
export const onCreateMpOrder = /* GraphQL */ `
  subscription OnCreateMpOrder {
    onCreateMpOrder {
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
export const onUpdateMpOrder = /* GraphQL */ `
  subscription OnUpdateMpOrder {
    onUpdateMpOrder {
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
export const onDeleteMpOrder = /* GraphQL */ `
  subscription OnDeleteMpOrder {
    onDeleteMpOrder {
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
export const onCreateMpsSubscription = /* GraphQL */ `
  subscription OnCreateMpsSubscription {
    onCreateMpsSubscription {
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
export const onUpdateMpsSubscription = /* GraphQL */ `
  subscription OnUpdateMpsSubscription {
    onUpdateMpsSubscription {
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
export const onDeleteMpsSubscription = /* GraphQL */ `
  subscription OnDeleteMpsSubscription {
    onDeleteMpsSubscription {
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
export const onCreateCustomer = /* GraphQL */ `
  subscription OnCreateCustomer {
    onCreateCustomer {
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
export const onUpdateCustomer = /* GraphQL */ `
  subscription OnUpdateCustomer {
    onUpdateCustomer {
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
export const onDeleteCustomer = /* GraphQL */ `
  subscription OnDeleteCustomer {
    onDeleteCustomer {
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
export const onCreateDriver = /* GraphQL */ `
  subscription OnCreateDriver {
    onCreateDriver {
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
export const onUpdateDriver = /* GraphQL */ `
  subscription OnUpdateDriver {
    onUpdateDriver {
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
export const onDeleteDriver = /* GraphQL */ `
  subscription OnDeleteDriver {
    onDeleteDriver {
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
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo {
    onCreateTodo {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo {
    onUpdateTodo {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo {
    onDeleteTodo {
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
